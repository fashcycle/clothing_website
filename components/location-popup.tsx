"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function LocationPopup() {
  const [open, setOpen] = useState(false)
  const [locationStatus, setLocationStatus] = useState<"idle" | "granted" | "denied">("idle")

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenLocationPopup")

    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setOpen(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handlePermission = (permission: "always" | "once" | "never") => {
    // Save to localStorage so we don't show the popup again
    localStorage.setItem("hasSeenLocationPopup", "true")

    if (permission === "always" || permission === "once") {
      // Store permission type
      localStorage.setItem("locationPermission", permission)
      setLocationStatus("granted")

      // Get actual location
      getActualLocation()
    } else {
      // For "never"
      localStorage.setItem("locationPermission", permission)
      setLocationStatus("denied")
    }

    // Close the popup
    setOpen(false)
  }

  // This function gets the actual user location
  const getActualLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } },
          )

          if (!response.ok) {
            throw new Error("Failed to get location details")
          }

          const data = await response.json()

          // Create location object
          const locationData = {
            latitude,
            longitude,
            city: data.address.city || data.address.town || data.address.village || "Unknown city",
            state: data.address.state || "Unknown state",
            country: data.address.country || "Unknown country",
            formatted: data.display_name || "Unknown location",
          }

          // Store the actual location data
          localStorage.setItem("userLocation", JSON.stringify(locationData))
          console.log("Location stored:", locationData)
        } catch (error) {
          console.error("Error getting location details:", error)

          // If reverse geocoding fails, at least store the coordinates
          const basicLocationData = {
            latitude,
            longitude,
            city: "Unknown city",
            state: "Unknown state",
            country: "Unknown country",
            formatted: `Lat: ${latitude}, Lng: ${longitude}`,
          }

          localStorage.setItem("userLocation", JSON.stringify(basicLocationData))
        }
      },
      (error) => {
        console.error("Error getting location:", error)

        // Handle errors based on error code
        let errorMessage = "Failed to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "You denied the request for geolocation."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out."
            break
        }

        // You might want to show this error to the user
        console.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg">
        <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-white/70 hover:text-white">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex items-start gap-3 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white mt-1"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div>
            <p className="text-lg font-medium">Know your location</p>
            <p className="text-sm text-white/70 mt-1">Fashcycle wants to access your location</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handlePermission("always")}
            className="w-full py-3 bg-[#0078D4] hover:bg-[#0078D4]/90 text-white rounded-md text-center transition-colors"
          >
            Allow while visiting the site
          </button>

          <button
            onClick={() => handlePermission("once")}
            className="w-full py-3 bg-[#0078D4] hover:bg-[#0078D4]/90 text-white rounded-md text-center transition-colors"
          >
            Allow this time
          </button>

          <button
            onClick={() => handlePermission("never")}
            className="w-full py-3 bg-[#0078D4] hover:bg-[#0078D4]/90 text-white rounded-md text-center transition-colors"
          >
            Never allow
          </button>
        </div>
      </div>
    </div>
  )
}

