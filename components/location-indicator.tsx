"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { useLocation } from "@/context/location-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LocationIndicator() {
  const { location, getLocation, clearLocation } = useLocation()
  const [storedLocation, setStoredLocation] = useState<any>(null)

  useEffect(() => {
    // Check if we have location in localStorage
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        setStoredLocation(JSON.parse(savedLocation))
      } catch (e) {
        console.error("Failed to parse saved location", e)
      }
    }
  }, [])

  // Use stored location if context location is not available
  const displayLocation = location || storedLocation

  if (!displayLocation) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-primary-foreground/90 hover:text-primary-foreground"
        onClick={getLocation}
      >
        <MapPin className="h-4 w-4 mr-1" />
        <span>Set Location</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary-foreground/90 hover:text-primary-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate max-w-[120px]">
            {displayLocation.city}, {displayLocation.state}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">
            {displayLocation.formatted ||
              `${displayLocation.city}, ${displayLocation.state}, ${displayLocation.country}`}
          </p>
        </div>
        <DropdownMenuItem onClick={getLocation}>Update Location</DropdownMenuItem>
        <DropdownMenuItem onClick={clearLocation}>Clear Location</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

