"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AppHeader } from "@/components/app-header"
import { GradingResultDialog } from "@/components/grading-result-dialog"
import { Loader2, FileText, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { NotesSection } from "@/components/notes-section"
import { saveEssayResult } from "@/lib/notes-utils"

type EssayType = {
  id: string
  name: string
  description: string
  prompt: string
}

type GradingResult = {
  score: number
  overallScore?: number
  letterGrade?: string
  rubricScores?: {
    contentAccuracy: number
    clarityOrganization: number
    depthAnalysis: number
    useOfEvidence: number
    writingStyleMechanics: number
  }
  keyPoints?: string[]
  suggestions: string[]
  feedback: string
}

// Mock essay types data
const essayTypes: Record<string, EssayType> = {
  "ap-dbq": {
    id: "ap-dbq",
    name: "AP Document-Based Question (DBQ)",
    description: "Analyze and synthesize historical data and documents",
    prompt:
      "Evaluate the extent to which the Progressive movement of the early 20th century (1890-1920) effectively addressed the political and social problems of the era. Use the provided documents and your knowledge of U.S. history to develop your argument.",
  },
  "ap-leq": {
    id: "ap-leq",
    name: "AP Long Essay Question (LEQ)",
    description: "Develop an argument about a historical topic using specific evidence",
    prompt:
      "Evaluate the extent to which technological innovations changed American society in the period from 1865 to 1920. Provide specific historical evidence to support your argument.",
  },
  "ap-frq-science": {
    id: "ap-frq-science",
    name: "AP Science Free Response",
    description: "Answer scientific questions with calculations, explanations, and analysis",
    prompt:
      "Describe the process of cellular respiration and explain how it relates to the laws of thermodynamics. Include specific chemical equations and identify where in the cell each stage occurs.",
  },
  "sat-essay": {
    id: "sat-essay",
    name: "SAT Essay",
    description: "Analyze how an author builds an argument to persuade an audience",
    prompt:
      "Read the passage and analyze how the author uses evidence, reasoning, and stylistic or persuasive elements to build an argument and make it effective. Your essay should not explain whether you agree with the author's claims, but rather analyze how the author builds the argument.",
  },
  // Other essay types would be defined here
}

export function EssayGrading() {
  const [essayContent, setEssayContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [essayType, setEssayType] = useState<EssayType | null>(null)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const essayTypeId = searchParams?.get("type") || "ap-dbq"

  useEffect(() => {
    if (essayTypeId && essayTypes[essayTypeId]) {
      setEssayType(essayTypes[essayTypeId])
    }
  }, [essayTypeId])

  const handleSubmitEssay = async () => {
    if (essayContent.trim().length < 100) {
      toast({
        title: "Essay too short",
        description: "Please write at least 100 characters for a proper evaluation.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'essay-grading',
          prompt: essayType?.prompt,
          essayContent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to grade essay');
      }

      const data = await res.json();
      const text = data.result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedText = text.replace(/```json\n?|```/g, '');
      const result = JSON.parse(cleanedText);
      
      // Map overallScore to score for compatibility
      const gradingResult = { ...result, score: result.overallScore };
      setGradingResult(gradingResult);
      setShowResults(true);
      // Save essay result to Firestore
      if (essayType) {
        await saveEssayResult({
          id: `essay-${Date.now()}`,
          topic: essayType.name,
          score: gradingResult.score,
          letterGrade: gradingResult.letterGrade,
          date: new Date().toISOString(),
        })
      }

    } catch (error) {
      toast({
        title: "Grading Error",
        description: "There was an error grading the essay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!essayType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <div className="flex items-center mb-6">
            <Link href="/dashboard/essay" className="mr-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/70 hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-foreground truncate">{essayType?.name || "Essay"}</h1>
              <p className="text-foreground/70 truncate">{essayType?.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-background/50 border-foreground/10 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center text-foreground">
                    <FileText className="h-5 w-5 mr-2 text-secondary" />
                    Essay Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-line">{essayType?.prompt}</p>
                </CardContent>
              </Card>

              <Card className="bg-background/50 border-foreground/10">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-foreground">Your Essay</CardTitle>
                  <CardDescription className="text-foreground/70">
                    Write your essay below and submit it for grading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Start writing your essay here..."
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    className="min-h-[300px] bg-background/30 border-foreground/20 text-foreground resize-y"
                    disabled={isSubmitting}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSubmitEssay}
                    disabled={isSubmitting || essayContent.trim().length < 100}
                    className="bg-secondary hover:bg-secondary/90 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Grading...
                      </>
                    ) : (
                      "Submit for Grading"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {gradingResult && (
                <GradingResultDialog open={showResults} onClose={() => setShowResults(false)} result={gradingResult} />
              )}
            </div>

            {/* Notes Section */}
            <div className="lg:col-span-1">
              <NotesSection currentTopic={essayType?.name || ""} compact={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
