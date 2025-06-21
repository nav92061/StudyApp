"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { QuizFeedbackDialog } from "@/components/quiz-feedback-dialog"
import { TopicSelector } from "@/components/topic-selector"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, XCircle, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NotesSection } from "@/components/notes-section"
import { loadNotes, generateQuestionsFromNotes, generateQuestionsFromTopic, Note, saveQuizResult } from "@/lib/notes-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  sourceNoteId?: string
}

export function QuizView() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("standard")
  const { toast } = useToast()

  // Mock topics
  const topics = [
    "AP Calculus AB",
    "AP Calculus BC",
    "AP Statistics",
    "AP Biology",
    "AP Chemistry",
    "AP Physics 1",
    "AP Physics 2",
    "AP Environmental Science",
    "AP U.S. History",
    "AP World History",
    "AP European History",
    "AP English Language",
    "AP English Literature",
    "AP Psychology",
    "SAT Math",
    "SAT Reading",
    "SAT Writing",
  ]

  // Check for note data in sessionStorage on component mount
  useEffect(() => {
    const quizFromNotes = sessionStorage.getItem('quizFromNotes')
    if (quizFromNotes) {
      try {
        const notes: Note[] = JSON.parse(quizFromNotes)
        sessionStorage.removeItem('quizFromNotes') // Clear the data
        if (notes.length > 0) {
          handleCreateQuizFromNotes(notes)
        }
      } catch (error) {
        console.error('Failed to parse notes from sessionStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedTopic) {
      setIsLoading(true)
      const fetchQuestions = async () => {
        try {
          let aiResult;
          if (activeTab === "notes") {
            const notes = await loadNotes()
            const filteredNotes = notes.filter((note: Note) => note.topic === selectedTopic)
            if (filteredNotes.length > 0) {
              aiResult = await generateQuestionsFromNotes(filteredNotes);
            } else {
              toast({ title: "No notes found", description: "Generating standard questions for this topic instead." });
              aiResult = await generateQuestionsFromTopic(selectedTopic);
            }
          } else {
            aiResult = await generateQuestionsFromTopic(selectedTopic);
          }
          setQuestions(parseGeminiQuestions(aiResult));
        } catch (e) {
            toast({ title: "AI Error", description: "Failed to generate questions." });
            setQuestions([]);
        } finally {
            setCurrentQuestionIndex(0);
            setSelectedAnswerId(null);
            setIsAnswerSubmitted(false);
            setProgress(0);
            setIsLoading(false);
        }
      };
      fetchQuestions()
    }
  }, [selectedTopic, activeTab, toast])

  // Helper to parse Gemini API response to Question[]
  function parseGeminiQuestions(aiResult: unknown): Question[] {
    try {
      if (typeof aiResult === 'object' && aiResult !== null && 'candidates' in aiResult) {
        // @ts-expect-error: dynamic structure from API
        const text = aiResult.candidates?.[0]?.content?.parts?.[0]?.text || ''
        if (typeof text === 'string') {
          const cleanedText = text.replace(/```json\n?|```/g, '');
          const parsed = JSON.parse(cleanedText);
          return Array.isArray(parsed) ? parsed : [];
        }
      }
      return []
    } catch {
      toast({ title: "Parsing Error", description: "The AI returned an unexpected format." });
      return []
    }
  }

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic)
  }

  const handleAnswerSelect = (answerId: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswerId(answerId)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswerId) {
      setIsAnswerSubmitted(true)

      // Find if the selected answer is correct
      const currentQuestion = questions[currentQuestionIndex]
      const selectedAnswer = currentQuestion.answers.find((a) => a.id === selectedAnswerId)

      if (selectedAnswer?.isCorrect) {
        toast({
          title: "Correct!",
          description: "Great job! You selected the right answer.",
          variant: "default",
        })
      } else {
        toast({
          title: "Incorrect",
          description: "That's not the right answer. Check the explanation.",
          variant: "destructive",
        })
      }

      setShowFeedback(true)
    } else {
      toast({
        title: "Select an answer",
        description: "Please select an answer before submitting.",
        variant: "default",
      })
    }
  }

  const handleNextQuestion = async () => {
    setShowFeedback(false)
    setSelectedAnswerId(null)
    setIsAnswerSubmitted(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100)
    } else {
      // Quiz completed
      toast({
        title: "Quiz Completed!",
        description: "You've completed all questions in this quiz.",
      })
      setProgress(100)
      // Save quiz result to Firestore
      if (selectedTopic && questions.length > 0) {
        const correctCount = questions.filter(q => q.answers.find(a => a.isCorrect && a.id === selectedAnswerId)).length
        const score = Math.round((correctCount / questions.length) * 100)
        await saveQuizResult({
          id: `quiz-${Date.now()}`,
          topic: selectedTopic,
          score,
          date: new Date().toISOString(),
          questionsCount: questions.length,
        })
      }
      // Reset quiz after delay
      setTimeout(() => {
        setSelectedTopic(null)
        setQuestions([])
        setProgress(0)
      }, 2000)
    }
  }

  const handleCreateQuizFromNotes = async (notes: Note[]) => {
    if (notes.length === 0) {
      toast({ title: "No notes selected", description: "Please select at least one note to create a quiz.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const aiResult = await generateQuestionsFromNotes(notes)
      const questions = parseGeminiQuestions(aiResult)
      setQuestions(questions)
      setSelectedTopic(notes[0].topic)
      setCurrentQuestionIndex(0)
      setSelectedAnswerId(null)
      setIsAnswerSubmitted(false)
      setProgress(0)
      setActiveTab("notes")
      toast({ title: "Quiz created", description: `Created ${questions.length} questions from your notes.` })
    } catch (e) {
      toast({ title: "AI Error", description: "Failed to generate questions from notes." })
    } finally {
      setIsLoading(false)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Multiple Choice Quiz</h1>
          <p className="text-foreground/70 mb-8">Test your knowledge with AI-generated questions</p>

          {!selectedTopic ? (
            <div className="space-y-6">
              <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-background/50 border border-foreground/10">
                  <TabsTrigger
                    value="standard"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    Standard Quiz
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    Quiz from Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="standard" className="space-y-6">
                  <TopicSelector topics={topics} onSelectTopic={handleTopicSelect} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-6">
                  <Card className="bg-background/50 border-foreground/10 mb-6">
                    <CardHeader>
                      <CardTitle className="text-xl font-medium text-foreground flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Create Quiz from Your Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70 mb-4">
                        Select a note to generate quiz questions based on your study materials.
                      </p>
                      <NotesSection onCreateQuiz={handleCreateQuizFromNotes} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-sm py-1">
                      Topic: {selectedTopic}
                    </Badge>
                    <p className="text-foreground/70 mt-2">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-foreground/20 text-foreground/70 hover:bg-foreground/10"
                    onClick={() => setSelectedTopic(null)}
                  >
                    Change Topic
                  </Button>
                </div>

                <Progress value={progress} className="h-2 bg-foreground/10" />

                {isLoading ? (
                  <Card className="bg-background/50 border-foreground/10">
                    <CardContent className="pt-10 pb-10 flex justify-center items-center">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="mt-4 text-foreground/70">Loading questions...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card className="bg-background/50 border-foreground/10">
                      <CardHeader>
                        <CardTitle className="text-xl font-medium text-foreground">{currentQuestion?.text}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {currentQuestion?.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className={`p-4 rounded-md border transition-all cursor-pointer
                                ${
                                  selectedAnswerId === answer.id
                                    ? "border-primary bg-primary/10"
                                    : "border-foreground/10 bg-background/80 hover:bg-background/90"
                                }
                                ${isAnswerSubmitted && answer.isCorrect ? "border-primary bg-primary/10" : ""}
                                ${
                                  isAnswerSubmitted && selectedAnswerId === answer.id && !answer.isCorrect
                                    ? "border-error bg-error/10"
                                    : ""
                                }
                              `}
                              onClick={() => handleAnswerSelect(answer.id)}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                  {isAnswerSubmitted ? (
                                    answer.isCorrect ? (
                                      <CheckCircle className="h-5 w-5 text-primary" />
                                    ) : selectedAnswerId === answer.id ? (
                                      <XCircle className="h-5 w-5 text-error" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border border-foreground/30" />
                                    )
                                  ) : (
                                    <div
                                      className={`h-5 w-5 rounded-full border ${
                                        selectedAnswerId === answer.id
                                          ? "border-primary bg-primary"
                                          : "border-foreground/30"
                                      }`}
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className="text-foreground">{answer.text}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div></div>
                        {isAnswerSubmitted ? (
                          <Button onClick={handleNextQuestion} className="bg-primary hover:bg-primary/90 text-white">
                            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswerId}
                            className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
                          >
                            Submit Answer
                          </Button>
                        )}
                      </CardFooter>
                    </Card>

                    {showFeedback && currentQuestion && (
                      <QuizFeedbackDialog
                        open={showFeedback}
                        onClose={() => setShowFeedback(false)}
                        question={currentQuestion}
                        selectedAnswerId={selectedAnswerId}
                        onNext={handleNextQuestion}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Notes Section */}
              <div className="lg:col-span-1">
                <NotesSection currentTopic={selectedTopic} compact={true} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
