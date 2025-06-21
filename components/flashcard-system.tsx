"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Flashcard, loadFlashcards, saveFlashcards } from "@/lib/notes-utils"
import { Loader2, RotateCw, ThumbsUp, ThumbsDown, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface FlashcardSystemProps {
  topic?: string
}

export function FlashcardSystem({ topic }: FlashcardSystemProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("study")
  const { toast } = useToast()
  const [user, setUser] = useState(auth.currentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        fetchFlashcards()
      } else {
        setFlashcards([])
        setIsLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchFlashcards = async () => {
    setIsLoading(true)
    const loadedFlashcards = await loadFlashcards()
    setFlashcards(loadedFlashcards)
    setIsLoading(false)
  }

  useEffect(() => {
    // Filter flashcards by topic if provided
    if (topic) {
      setFilteredFlashcards(flashcards.filter((fc) => fc.topic === topic))
    } else {
      setFilteredFlashcards(flashcards)
    }
  }, [flashcards, topic])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((currentIndex + 1) % filteredFlashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((currentIndex - 1 + filteredFlashcards.length) % filteredFlashcards.length)
  }

  const handleDifficultyRating = async (difficulty: "easy" | "medium" | "hard") => {
    if (filteredFlashcards.length === 0) return

    const currentFlashcard = filteredFlashcards[currentIndex]

    // Update the flashcard with new difficulty and review data
    const updatedFlashcard: Flashcard = {
      ...currentFlashcard,
      difficulty,
      lastReviewed: new Date().toISOString(),
      repetitions: currentFlashcard.repetitions + 1,
    }

    // Calculate next review date based on spaced repetition algorithm
    // This is a simple implementation - a real app would use a more sophisticated algorithm
    const daysToAdd = difficulty === "easy" ? 7 : difficulty === "medium" ? 3 : 1
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + daysToAdd)
    updatedFlashcard.nextReview = nextReview.toISOString()

    // Update the flashcard in the array
    const updatedFlashcards = flashcards.map((fc) => (fc.id === currentFlashcard.id ? updatedFlashcard : fc))

    setFlashcards(updatedFlashcards)
    await saveFlashcards(updatedFlashcards)

    // Move to the next card
    handleNext()

    toast({
      title: "Progress saved",
      description: `Card marked as ${difficulty}. Next review in ${daysToAdd} days.`,
    })
  }

  const currentFlashcard = filteredFlashcards[currentIndex]
  const progress = filteredFlashcards.length > 0 ? ((currentIndex + 1) / filteredFlashcards.length) * 100 : 0

  if (isLoading) {
    return (
      <Card className="bg-background/50 border-foreground/10">
        <CardContent className="pt-10 pb-10 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="mt-4 text-foreground/70">Loading flashcards...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="study" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-background/50 border border-foreground/10">
          <TabsTrigger value="study" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Study Cards
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="study" className="space-y-6">
          {filteredFlashcards.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-sm py-1">
                    {topic || "All Topics"}
                  </Badge>
                  <p className="text-foreground/70 mt-2">
                    Card {currentIndex + 1} of {filteredFlashcards.length}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
                  onClick={() => setIsFlipped(false)}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <Progress value={progress} className="h-2 bg-foreground/10" />

              <div className="relative min-h-[300px]">
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    isFlipped ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <Card
                    className="bg-background/50 border-foreground/10 h-full flex flex-col cursor-pointer"
                    onClick={handleFlip}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-medium text-foreground">Question</CardTitle>
                      <CardDescription className="text-foreground/70">Click the card to see the answer</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                      <p className="text-foreground text-lg text-center">{currentFlashcard?.front}</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Badge className="bg-secondary/20 text-secondary">{currentFlashcard?.topic}</Badge>
                    </CardFooter>
                  </Card>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    isFlipped ? "opacity-100" : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <Card
                    className="bg-background/50 border-foreground/10 h-full flex flex-col cursor-pointer"
                    onClick={handleFlip}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-medium text-foreground">Answer</CardTitle>
                      <CardDescription className="text-foreground/70">How well did you know this?</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                      <p className="text-foreground text-lg text-center">{currentFlashcard?.back}</p>
                    </CardContent>
                    <CardFooter className="justify-center space-x-2">
                      <Button
                        variant="outline"
                        className="border-error/30 text-error hover:bg-error/10"
                        onClick={() => handleDifficultyRating("hard")}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Hard
                      </Button>
                      <Button
                        variant="outline"
                        className="border-accent/30 text-accent hover:bg-accent/10"
                        onClick={() => handleDifficultyRating("medium")}
                      >
                        OK
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => handleDifficultyRating("easy")}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Easy
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <Card className="bg-background/50 border-foreground/10">
              <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
                <p className="text-foreground/70 mb-4">No flashcards available for this topic.</p>
                <Button
                  variant="outline"
                  className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
                  onClick={() => {
                    // In a real app, this would navigate to create flashcards
                    toast({
                      title: "Create flashcards",
                      description: "You can create flashcards from your notes.",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Flashcards
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card className="bg-background/50 border-foreground/10">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">Flashcard Statistics</CardTitle>
              <CardDescription className="text-foreground/70">
                Your progress with {topic ? `${topic} flashcards` : "all flashcards"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-md bg-background/80 border border-foreground/10">
                  <p className="text-foreground/70 text-sm">Total Cards</p>
                  <p className="text-2xl font-bold text-foreground">{filteredFlashcards.length}</p>
                </div>
                <div className="p-4 rounded-md bg-background/80 border border-foreground/10">
                  <p className="text-foreground/70 text-sm">Mastered</p>
                  <p className="text-2xl font-bold text-primary">
                    {filteredFlashcards.filter((fc) => fc.repetitions > 3).length}
                  </p>
                </div>
                <div className="p-4 rounded-md bg-background/80 border border-foreground/10">
                  <p className="text-foreground/70 text-sm">To Review</p>
                  <p className="text-2xl font-bold text-accent">
                    {
                      filteredFlashcards.filter((fc) => {
                        if (!fc.nextReview) return true
                        return new Date(fc.nextReview) <= new Date()
                      }).length
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Difficulty Distribution</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/90">Easy</span>
                      <span className="font-medium text-primary">
                        {filteredFlashcards.filter((fc) => fc.difficulty === "easy").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (filteredFlashcards.filter((fc) => fc.difficulty === "easy").length /
                          Math.max(1, filteredFlashcards.length)) *
                        100
                      }
                      className="h-2 bg-foreground/10 bg-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/90">Medium</span>
                      <span className="font-medium text-accent">
                        {filteredFlashcards.filter((fc) => fc.difficulty === "medium").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (filteredFlashcards.filter((fc) => fc.difficulty === "medium").length /
                          Math.max(1, filteredFlashcards.length)) *
                        100
                      }
                      className="h-2 bg-foreground/10 bg-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/90">Hard</span>
                      <span className="font-medium text-error">
                        {filteredFlashcards.filter((fc) => fc.difficulty === "hard").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (filteredFlashcards.filter((fc) => fc.difficulty === "hard").length /
                          Math.max(1, filteredFlashcards.length)) *
                        100
                      }
                      className="h-2 bg-foreground/10 bg-error"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
