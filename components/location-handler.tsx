"use client"

import { useState, useEffect } from "react"

export function useRealLocation() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
    city: string
    state: string
    country: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getActualLocation = async () => {
    // Check if permission was previously granted through our UI
    const permission = localStorage.getItem("locationPermission")

    if (permission !== "always" && permission !== "once") {
      setError("Location permission not granted")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Now we can request the actual location
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser")
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords
      // Use reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } },
      )

      if (!response.ok) {
        throw new Error("Failed to get location details")
      }

      const data = await response.json()

      const locationData = {
        latitude,
        longitude,
        city: data.address.city || data.address.town || data.address.village || "Unknown city",
        state: data.address.state || "Unknown state",
        country: data.address.country || "Unknown country",
      }
      setLocation(locationData)
      localStorage.setItem("userLocation", JSON.stringify(locationData))
    } catch (error) {
      console.error("Error getting location:", error)
      setError(error instanceof Error ? error.message : "Failed to get your location")
    } finally {
      setLoading(false)
    }
  }

  return { location, loading, error, getActualLocation }
}

// This component can be used when you actually want to get the user's location
export default function LocationHandler() {
  const { location, loading, error, getActualLocation } = useRealLocation()

  useEffect(() => {
    // Check if we should automatically get location
    const permission = localStorage.getItem("locationPermission")
    if (permission === "always") {
      getActualLocation()
    }
  }, [])

  return null // This is a utility component, it doesn't render anything
}

