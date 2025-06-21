"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { FlashcardSystem } from "@/components/flashcard-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FlashcardsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // Mock topics for filtering
  const topics = ["AP Calculus BC", "AP Biology", "AP U.S. History", "AP English Literature", "SAT Math", "SAT Reading"]

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Flashcards</h1>
          <p className="text-foreground/70 mb-8">Review and study with spaced repetition flashcards</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-background/50 border-foreground/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-foreground">Filter Flashcards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                    <Input
                      placeholder="Search flashcards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/30 border-foreground/20 text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground flex items-center">
                      <BookOpen className="h-4 w-4 mr-1 text-foreground/70" />
                      Topics
                    </h3>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                      <div
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          !selectedTopic ? "bg-primary/10 text-primary" : "hover:bg-foreground/5"
                        }`}
                        onClick={() => setSelectedTopic(null)}
                      >
                        <span className={`text-sm ${!selectedTopic ? "text-primary" : "text-foreground/80"}`}>
                          All Topics
                        </span>
                      </div>
                      {topics.map((topic) => (
                        <div
                          key={topic}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            selectedTopic === topic ? "bg-primary/10 text-primary" : "hover:bg-foreground/5"
                          }`}
                          onClick={() => setSelectedTopic(topic)}
                        >
                          <span
                            className={`text-sm ${selectedTopic === topic ? "text-primary" : "text-foreground/80"}`}
                          >
                            {topic}
                          </span>
                          <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20">3</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-background/50 border border-foreground/10">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    All Cards
                  </TabsTrigger>
                  <TabsTrigger
                    value="due"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    Due Today
                  </TabsTrigger>
                  <TabsTrigger
                    value="difficult"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    Difficult
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  <FlashcardSystem topic={selectedTopic || undefined} />
                </TabsContent>

                <TabsContent value="due" className="space-y-6">
                  <FlashcardSystem topic={selectedTopic || undefined} />
                </TabsContent>

                <TabsContent value="difficult" className="space-y-6">
                  <FlashcardSystem topic={selectedTopic || undefined} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
