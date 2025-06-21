"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronRight } from "lucide-react"

interface TopicSelectorProps {
  topics: string[]
  onSelectTopic: (topic: string) => void
}

export function TopicSelector({ topics, onSelectTopic }: TopicSelectorProps) {
  return (
    <Card className="bg-background/50 border-foreground/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Select a Topic</CardTitle>
        <CardDescription className="text-foreground/70">Choose a topic to start the quiz</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-6 px-4 border-foreground/10 bg-background/80 hover:bg-background/90 hover:border-primary/50 flex justify-between items-center"
              onClick={() => onSelectTopic(topic)}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-3" />
                <span className="text-foreground text-lg">{topic}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-foreground/50" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
