"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LocationData = {
  city: string
  state: string
  country: string
  formatted: string
  latitude: number | null
  longitude: number | null
}

type LocationContextType = {
  location: LocationData | null
  loading: boolean
  error: string | null
  getLocation: () => Promise<void>
  clearLocation: () => void
}

const defaultLocationContext: LocationContextType = {
  location: null,
  loading: false,
  error: null,
  getLocation: async () => {},
  clearLocation: () => {},
}

const LocationContext = createContext<LocationContextType>(defaultLocationContext)

export const useLocation = () => useContext(LocationContext)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we have location in localStorage
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation))
      } catch (e) {
        console.error("Failed to parse saved location", e)
        localStorage.removeItem("userLocation")
      }
    }

    // Check permission and get location if needed
    const locationPermission = localStorage.getItem("locationPermission")
    if (locationPermission === "always") {
      getLocation()
    }
  }, [])

  const getLocation = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    try {
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
        city: data.address.city || data.address.town || data.address.village || "Unknown city",
        state: data.address.state || "Unknown state",
        country: data.address.country || "Unknown country",
        formatted: data.display_name || "Unknown location",
        latitude,
        longitude,
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

  const clearLocation = () => {
    setLocation(null)
    localStorage.removeItem("userLocation")
    localStorage.removeItem("locationPermission")
  }

  return (
    <LocationContext.Provider value={{ location, loading, error, getLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

