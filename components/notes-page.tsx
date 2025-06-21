"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { NotesSection } from "@/components/notes-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Tag, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Mock topics for filtering
  const topics = ["AP Calculus BC", "AP Biology", "AP U.S. History", "AP English Literature", "SAT Math", "SAT Reading"]

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Notes</h1>
          <p className="text-foreground/70 mb-8">Organize and review your study notes</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-background/50 border-foreground/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-foreground">Filter Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                    <Input
                      placeholder="Search notes..."
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
                      {topics.map((topic) => (
                        <div
                          key={topic}
                          className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-foreground/5"
                          onClick={() => {
                            // In a real app, this would filter notes by topic
                          }}
                        >
                          <span className="text-foreground/80 text-sm">{topic}</span>
                          <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20">3</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-foreground/10">
                    <h3 className="text-sm font-medium text-foreground flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-foreground/70" />
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">formulas</Badge>
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">key-concepts</Badge>
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">review</Badge>
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">homework</Badge>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-foreground/10">
                    <h3 className="text-sm font-medium text-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-foreground/70" />
                      Time Period
                    </h3>
                    <div className="space-y-1">
                      <div
                        className="flex items-center p-2 rounded-md cursor-pointer hover:bg-foreground/5"
                        onClick={() => {
                          // In a real app, this would filter notes by time
                        }}
                      >
                        <span className="text-foreground/80 text-sm">Last 7 days</span>
                      </div>
                      <div
                        className="flex items-center p-2 rounded-md cursor-pointer hover:bg-foreground/5"
                        onClick={() => {
                          // In a real app, this would filter notes by time
                        }}
                      >
                        <span className="text-foreground/80 text-sm">Last 30 days</span>
                      </div>
                      <div
                        className="flex items-center p-2 rounded-md cursor-pointer hover:bg-foreground/5"
                        onClick={() => {
                          // In a real app, this would filter notes by time
                        }}
                      >
                        <span className="text-foreground/80 text-sm">All time</span>
                      </div>
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
                    className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
                  >
                    All Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
                  >
                    Recent
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
                  >
                    Favorites
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  <NotesSection />
                </TabsContent>

                <TabsContent value="recent" className="space-y-6">
                  <NotesSection />
                </TabsContent>

                <TabsContent value="favorites" className="space-y-6">
                  <div className="text-center py-12">
                    <p className="text-foreground/50">No favorite notes yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
