"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Answer = {
  id: string
  text: string
  isCorrect: boolean
}

type Question = {
  id: string
  text: string
  answers: Answer[]
  explanation: string
}

interface QuizFeedbackDialogProps {
  open: boolean
  onClose: () => void
  question: Question
  selectedAnswerId: string | null
  onNext: () => void
}

export function QuizFeedbackDialog({ open, onClose, question, selectedAnswerId, onNext }: QuizFeedbackDialogProps) {
  const selectedAnswer = question.answers.find((a) => a.id === selectedAnswerId)
  const correctAnswer = question.answers.find((a) => a.isCorrect)
  const isCorrect = selectedAnswer?.isCorrect

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-foreground/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-primary">Correct Answer!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-error" />
                <span className="text-error">Incorrect Answer</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <h3 className="font-medium text-foreground mb-1">Question:</h3>
            <p className="text-foreground/80">{question.text}</p>
          </div>

          {!isCorrect && (
            <div>
              <h3 className="font-medium text-foreground mb-1">Your Answer:</h3>
              <p className="text-error/80">{selectedAnswer?.text || "No answer selected"}</p>

              <h3 className="font-medium text-foreground mb-1 mt-3">Correct Answer:</h3>
              <p className="text-primary/80">{correctAnswer?.text}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-foreground/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Explanation:</h3>
                <p className="text-foreground/80 whitespace-pre-line">{question.explanation}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onNext} className="w-full bg-primary hover:bg-primary/90 text-white">
            Next Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
