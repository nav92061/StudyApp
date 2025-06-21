"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { BookOpen, FileText, BarChart3, Users, ChevronRight, Notebook, BookMarked } from "lucide-react"

export function DashboardView() {
  const [username] = useState("")

  const menuItems = [
    {
      title: "Multiple Choice Quiz",
      description: "Practice AP and SAT multiple choice questions",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      href: "/dashboard/quiz",
      color: "bg-primary/10 hover:bg-primary/20",
    },
    {
      title: "Essay Practice",
      description: "Practice AP essays and SAT writing tasks",
      icon: <FileText className="h-8 w-8 text-secondary" />,
      href: "/dashboard/essay",
      color: "bg-secondary/10 hover:bg-secondary/20",
    },
    {
      title: "Study Notes",
      description: "Create and organize your study notes",
      icon: <Notebook className="h-8 w-8 text-accent" />,
      href: "/dashboard/notes",
      color: "bg-accent/10 hover:bg-accent/20",
    },
    {
      title: "Flashcards",
      description: "Review with spaced repetition flashcards",
      icon: <BookMarked className="h-8 w-8 text-primary" />,
      href: "/dashboard/flashcards",
      color: "bg-primary/10 hover:bg-primary/20",
    },
    {
      title: "Performance Stats",
      description: "Track your AP and SAT test prep progress",
      icon: <BarChart3 className="h-8 w-8 text-accent" />,
      href: "/dashboard/stats",
      color: "bg-accent/10 hover:bg-accent/20",
    },
    {
      title: "Class Management",
      description: "Manage your AP classes and SAT study topics",
      icon: <Users className="h-8 w-8 text-foreground/80" />,
      href: "/dashboard/class-setup",
      color: "bg-foreground/5 hover:bg-foreground/10",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username={username} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome, {username}!</h1>
          <p className="text-foreground/70 mb-8">What would you like to do today?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link href={item.href} key={index} className="block">
                <Card
                  className={`transition-all duration-300 ${item.color} border-none shadow-lg hover:shadow-xl h-full`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center">
                      {item.icon}
                      <CardTitle className="ml-4 text-xl font-bold text-foreground">{item.title}</CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/50" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-foreground/70 text-base">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Card className="bg-background/50 border border-foreground/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-background/80 border border-foreground/10">
                    <p className="text-foreground/70 text-sm">No recent activity to display.</p>
                    <p className="text-foreground/50 text-sm mt-1">
                      Start a quiz or submit an essay to see your activity here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
