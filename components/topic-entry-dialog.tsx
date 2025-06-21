"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TopicEntryDialogProps {
  open: boolean
  onClose: () => void
  onAddTopic: (topic: string) => void
}

export function TopicEntryDialog({ open, onClose, onAddTopic }: TopicEntryDialogProps) {
  const [topic, setTopic] = useState("")

  const handleSubmit = () => {
    if (topic.trim()) {
      onAddTopic(topic.trim())
      setTopic("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-foreground/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Topic</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-foreground/90">
              Topic Name
            </Label>
            <Input
              id="topic"
              placeholder="Enter topic name"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-background/30 border-foreground/20 text-foreground"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!topic.trim()} className="bg-primary hover:bg-primary/90 text-white">
            Add Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
