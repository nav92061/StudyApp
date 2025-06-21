"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { FileText, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

type EssayType = {
  id: string
  name: string
  description: string
}

export function EssayTypeSelection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const essayTypes: EssayType[] = [
    {
      id: "ap-dbq",
      name: "AP Document-Based Question (DBQ)",
      description: "Analyze and synthesize historical data and documents",
    },
    {
      id: "ap-leq",
      name: "AP Long Essay Question (LEQ)",
      description: "Develop an argument about a historical topic using specific evidence",
    },
    {
      id: "ap-frq-science",
      name: "AP Science Free Response",
      description: "Answer scientific questions with calculations, explanations, and analysis",
    },
    {
      id: "ap-frq-math",
      name: "AP Math Free Response",
      description: "Solve complex mathematical problems with detailed work shown",
    },
    {
      id: "ap-argument",
      name: "AP English Argument Essay",
      description: "Defend, challenge, or qualify a claim about a specific topic",
    },
    {
      id: "ap-synthesis",
      name: "AP English Synthesis Essay",
      description: "Synthesize information from multiple texts to support an argument",
    },
    {
      id: "ap-rhetorical",
      name: "AP English Rhetorical Analysis",
      description: "Analyze how an author uses rhetorical strategies to make an argument",
    },
    {
      id: "sat-essay",
      name: "SAT Essay",
      description: "Analyze how an author builds an argument to persuade an audience",
    },
    {
      id: "college-app",
      name: "College Application Essay",
      description: "Personal statement for college applications",
    },
    {
      id: "scholarship",
      name: "Scholarship Essay",
      description: "Essay for scholarship applications",
    },
  ]

  const filteredEssayTypes = essayTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectEssayType = (essayTypeId: string) => {
    router.push(`/dashboard/essay/grading?type=${essayTypeId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Essay Grading</h1>
          <p className="text-foreground/70 mb-8">Select an essay type to get started</p>

          <Card className="bg-background/50 border-foreground/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">Essay Types</CardTitle>
              <CardDescription className="text-foreground/70">
                Choose the type of essay you want to write
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                <Input
                  placeholder="Search essay types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/30 border-foreground/20 text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEssayTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    className="h-auto py-4 px-4 border-foreground/10 bg-background/80 hover:bg-background/90 hover:border-secondary/50 flex justify-between items-start text-left"
                    onClick={() => handleSelectEssayType(type.id)}
                  >
                    <div className="flex items-start mr-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-foreground font-medium block truncate">{type.name}</span>
                        <span className="text-foreground/70 text-sm block mt-1 line-clamp-2">{type.description}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/50 flex-shrink-0 mt-0.5 ml-2" />
                  </Button>
                ))}
              </div>

              {filteredEssayTypes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-foreground/70">No essay types match your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
