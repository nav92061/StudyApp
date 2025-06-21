"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart3, PieChart, LineChart, BookOpen, FileText, Award } from "lucide-react"
import { loadQuizResults, loadEssayResults, QuizResult, EssayResult } from "@/lib/notes-utils"

export function StatsView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [essayResults, setEssayResults] = useState<EssayResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [quizzes, essays] = await Promise.all([
        loadQuizResults(),
        loadEssayResults(),
      ])
      setQuizResults(quizzes)
      setEssayResults(essays)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Compute stats
  const quizzesTaken = quizResults.length
  const essaysSubmitted = essayResults.length
  const averageQuizScore = quizzesTaken > 0 ? Math.round(quizResults.reduce((a, b) => a + b.score, 0) / quizzesTaken) : 0
  const averageEssayScore = essaysSubmitted > 0 ? (essayResults.reduce((a, b) => a + (b.score || 0), 0) / essaysSubmitted).toFixed(1) : "0"

  // Per-topic stats
  const topicMap: Record<string, { quizScores: number[]; essayScores: number[] }> = {}
  quizResults.forEach(q => {
    if (!topicMap[q.topic]) topicMap[q.topic] = { quizScores: [], essayScores: [] }
    topicMap[q.topic].quizScores.push(q.score)
  })
  essayResults.forEach(e => {
    if (!topicMap[e.topic]) topicMap[e.topic] = { quizScores: [], essayScores: [] }
    topicMap[e.topic].essayScores.push(e.score)
  })
  const topicStats = Object.entries(topicMap).map(([name, { quizScores, essayScores }]) => ({
    name,
    quizScore: quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0,
    essayScore: essayScores.length ? (essayScores.reduce((a, b) => a + b, 0) / essayScores.length).toFixed(1) : 0,
    progress: quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0,
  }))

  // Recent activity (last 5)
  const recentQuizActivity = quizResults.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(q => ({
    type: "quiz",
    topic: q.topic,
    score: `${q.score}%`,
    date: new Date(q.date).toLocaleDateString(),
  }))
  const recentEssayActivity = essayResults.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(e => ({
    type: "essay",
    topic: e.topic,
    score: e.letterGrade || `${e.score}/10`,
    date: new Date(e.date).toLocaleDateString(),
  }))
  const recentActivity = [...recentQuizActivity, ...recentEssayActivity].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 75) return "text-accent"
    if (score >= 60) return "text-orange-500"
    return "text-error"
  }

  // Helper function to get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-primary"
    if (score >= 75) return "bg-accent"
    if (score >= 60) return "bg-orange-500"
    return "bg-error"
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground/70">Loading statistics...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Statistics</h1>
          <p className="text-foreground/70 mb-8">Track your progress and performance</p>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-background/50 border border-foreground/10">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="topics"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <PieChart className="h-4 w-4 mr-2" />
                Topics
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <LineChart className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-background/50 border-foreground/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-foreground">Quizzes Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-primary mr-3" />
                      <span className="text-3xl font-bold text-foreground">{quizzesTaken}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/50 border-foreground/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-foreground">Essays Submitted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-secondary mr-3" />
                      <span className="text-3xl font-bold text-foreground">{essaysSubmitted}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/50 border-foreground/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-foreground">Topics Mastered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-accent mr-3" />
                      <span className="text-3xl font-bold text-foreground">{topicStats.filter(t => t.progress === 100).length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-background/50 border-foreground/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-foreground">Average Quiz Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Overall Average</span>
                      <span className={`text-2xl font-bold ${getScoreColor(averageQuizScore)}`}>
                        {averageQuizScore}%
                      </span>
                    </div>
                    <Progress
                      value={averageQuizScore}
                      className={`h-2 bg-foreground/10 ${getProgressColor(averageQuizScore)}`}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-background/50 border-foreground/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-foreground">Average Essay Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Overall Average</span>
                      <span className={`text-2xl font-bold ${getScoreColor(Number(averageEssayScore) * 10)}`}>
                        {averageEssayScore}/10
                      </span>
                    </div>
                    <Progress
                      value={Number(averageEssayScore) * 10}
                      className={`h-2 bg-foreground/10 ${getProgressColor(Number(averageEssayScore) * 10)}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-6">
              <Card className="bg-background/50 border-foreground/10">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">Topic Performance</CardTitle>
                  <CardDescription className="text-foreground/70">
                    Your performance across different topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {topicStats.map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{topic.name}</span>
                          <span className={`font-medium ${getScoreColor(topic.progress)}`}>{topic.progress}%</span>
                        </div>
                        <Progress
                          value={topic.progress}
                          className={`h-2 bg-foreground/10 ${getProgressColor(topic.progress)}`}
                        />
                        <div className="flex justify-between text-sm text-foreground/70 pt-1">
                          <span>Quiz: {topic.quizScore}%</span>
                          <span>Essay: {topic.essayScore}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-background/50 border-foreground/10">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">Recent Activity</CardTitle>
                  <CardDescription className="text-foreground/70">Your recent quizzes and essays</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-foreground/10 bg-background/80 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {activity.type === "quiz" ? (
                            <BookOpen className="h-5 w-5 text-primary mr-3" />
                          ) : (
                            <FileText className="h-5 w-5 text-secondary mr-3" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">
                              {activity.topic} {activity.type === "quiz" ? "Quiz" : "Essay"}
                            </p>
                            <p className="text-sm text-foreground/70">{activity.date}</p>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              activity.type === "quiz" ? getScoreColor(Number.parseInt(activity.score)) : "text-accent"
                            }`}
                          >
                            {activity.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
