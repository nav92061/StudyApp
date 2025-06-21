"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle } from "lucide-react"

type GradingResult = {
  score: number
  feedback: string
  suggestions: string[]
}

interface GradingResultDialogProps {
  open: boolean
  onClose: () => void
  result: GradingResult
}

export function GradingResultDialog({ open, onClose, result }: GradingResultDialogProps) {
  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-primary"
    if (score >= 7) return "text-accent"
    if (score >= 5) return "text-orange-500"
    return "text-error"
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background border-foreground/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Essay Grading Results</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 my-2 max-h-[70vh] overflow-y-auto pr-2">
          {/* Overall Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-foreground/5 border border-foreground/10">
            <div>
              <h3 className="font-medium text-foreground">Overall Score</h3>
              <p className="text-foreground/70 text-sm">Based on AI evaluation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score?.toFixed(1) || 'N/A'}</div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground text-lg">Suggestions for Improvement</h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-foreground/90">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Feedback */}
          {result.feedback && (
            <div className="space-y-3 pt-4 border-t border-foreground/10">
              <h3 className="font-medium text-foreground text-lg">Detailed Feedback</h3>
              <p className="text-foreground/90 whitespace-pre-line">{result.feedback}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
          >
            Close
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-white" onClick={onClose}>
            Save Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
