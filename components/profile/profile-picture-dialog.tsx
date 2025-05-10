"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, Trash } from "lucide-react"
import { useRef } from "react"

interface ProfilePictureDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  previewImage: string | null
  userImage: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeProfilePicture: () => any
  handleImageUpload: () => void  // Updated type
  fileInputRef: React.RefObject<HTMLInputElement>
  triggerFileInput: () => void
}

export function ProfilePictureDialog({
  isOpen,
  onOpenChange,
  previewImage,
  userImage,
  onFileChange,
  removeProfilePicture,
  handleImageUpload,
  fileInputRef,
  triggerFileInput
}: ProfilePictureDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>Upload a new profile picture or remove your current one.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
            {previewImage ? (
              <img src={previewImage || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <img
                src={userImage || "/placeholder.svg?height=300&width=300&query=person"}
                alt="Current profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />

          <div className="flex gap-2">
            <Button variant="outline" onClick={triggerFileInput} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Choose Image
            </Button>

            <Button
              variant="outline"
              onClick={removeProfilePicture}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-green-900 hover:border-green-900"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => handleImageUpload()} disabled={!previewImage}>
  Save
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}