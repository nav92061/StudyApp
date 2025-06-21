"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  FileText,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Video,
  BookMarked,
  Notebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LandingPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({ questions: 0, improvement: 0, subjects: 0, students: 0 })
  const { toast } = useToast()
  const statsRef = useRef<HTMLDivElement>(null)

  // Sample questions to showcase the platform
  const sampleQuestions = [
    {
      id: "calc-1",
      subject: "AP Calculus BC",
      question: "Find the derivative of f(x) = 3x² + 2x - 5",
      answers: [
        { id: "a", text: "f'(x) = 6x + 2", correct: true },
        { id: "b", text: "f'(x) = 3x + 2", correct: false },
        { id: "c", text: "f'(x) = 6x² + 2x", correct: false },
        { id: "d", text: "f'(x) = 3x² + 2", correct: false },
      ],
      explanation: "Using the power rule: d/dx(ax^n) = nax^(n-1), we get f'(x) = 6x + 2",
    },
    {
      id: "bio-1",
      subject: "AP Biology",
      question: "Which process occurs during the light-dependent reactions of photosynthesis?",
      answers: [
        { id: "a", text: "Calvin cycle", correct: false },
        { id: "b", text: "ATP and NADPH production", correct: true },
        { id: "c", text: "Glucose synthesis", correct: false },
        { id: "d", text: "Carbon fixation", correct: false },
      ],
      explanation: "Light-dependent reactions produce ATP and NADPH, which are then used in the Calvin cycle.",
    },
    {
      id: "hist-1",
      subject: "AP U.S. History",
      question: "The Great Compromise at the Constitutional Convention resolved which issue?",
      answers: [
        { id: "a", text: "Slavery representation", correct: false },
        { id: "b", text: "State vs. federal power", correct: false },
        { id: "c", text: "Legislative representation", correct: true },
        { id: "d", text: "Executive powers", correct: false },
      ],
      explanation:
        "The Great Compromise created a bicameral legislature with proportional representation in the House and equal representation in the Senate.",
    },
  ]

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Interactive Quizzes",
      description: "Practice with thousands of AP and SAT questions with instant feedback and detailed explanations.",
      color: "bg-primary/10",
    },
    {
      icon: <FileText className="h-8 w-8 text-secondary" />,
      title: "Essay Grading",
      description: "Get AI-powered feedback on your essays with detailed rubric scoring and improvement suggestions.",
      color: "bg-secondary/10",
    },
    {
      icon: <Notebook className="h-8 w-8 text-accent" />,
      title: "Smart Notes",
      description: "Create organized study notes that automatically generate quizzes and flashcards.",
      color: "bg-accent/10",
    },
    {
      icon: <BookMarked className="h-8 w-8 text-primary" />,
      title: "Flashcards",
      description: "Study with spaced repetition flashcards generated from your notes and course materials.",
      color: "bg-primary/10",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and personalized study recommendations.",
      color: "bg-secondary/10",
    },
    {
      icon: <Star className="h-8 w-8 text-accent" />,
      title: "Performance Stats",
      description: "Track your AP and SAT test prep progress with comprehensive analytics and insights.",
      color: "bg-accent/10",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AP Student",
      content: "AceAI helped me improve my AP Calculus score from a 3 to a 5! The practice questions were spot-on.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "SAT Prep Student",
      content: "The essay grading feature gave me the feedback I needed to boost my writing score by 150 points.",
      rating: 5,
      avatar: "MJ",
    },
    {
      name: "Emily Rodriguez",
      role: "AP Biology Student",
      content: "Creating flashcards from my notes saved me hours of study time. The spaced repetition really works!",
      rating: 5,
      avatar: "ER",
    },
  ]

  const faqs = [
    {
      question: "How does AceAI generate practice questions?",
      answer:
        "AceAI uses advanced AI to create questions based on official AP and SAT standards, your study notes, and curriculum requirements. Each question includes detailed explanations to help you understand the concepts.",
    },
    {
      question: "Can I use AceAI for multiple AP subjects?",
      answer:
        "Yes! AceAI supports all major AP subjects including Calculus, Biology, Chemistry, Physics, History, English, and more. You can also use it for SAT preparation.",
    },
    {
      question: "How accurate is the essay grading?",
      answer:
        "Our AI essay grading system is trained on thousands of sample essays and provides feedback based on official AP and SAT rubrics. While it's a powerful study tool, we recommend using it alongside teacher feedback.",
    },
    {
      question: "Is my study data private and secure?",
      answer:
        "Absolutely. Your notes, essays, and progress data are stored securely and never shared with third parties. You have full control over your data.",
    },
    {
      question: "Can I create custom study materials?",
      answer:
        "Yes! You can create custom notes, generate flashcards from your materials, extract content from videos, and even create quizzes based on your specific study needs.",
    },
  ]

  // Auto-rotate sample questions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % sampleQuestions.length)
      setSelectedAnswer(null)
      setShowResult(false)
    }, 8000)

    return () => clearInterval(interval)
  }, [sampleQuestions.length])

  // Animated counting for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateStats = () => {
    const targets = { questions: 50000, improvement: 95, subjects: 20, students: 10000 }
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        questions: Math.floor(targets.questions * progress),
        improvement: Math.floor(targets.improvement * progress),
        subjects: Math.floor(targets.subjects * progress),
        students: Math.floor(targets.students * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setStats(targets)
      }
    }, stepDuration)
  }

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
    setShowResult(true)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "Thank you for your interest. We'll get back to you soon.",
    })
    setEmail("")
    setMessage("")
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const currentQuestion = sampleQuestions[currentQuestionIndex]
  const correctAnswer = currentQuestion.answers.find((a) => a.correct)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13111A] via-[#1A1625] to-[#13111A]">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm border-b border-foreground/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">Ace</span>
              <span className="text-2xl font-bold text-foreground">AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-20 ml-20">
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Demo
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 animate-pulse-custom"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-6 text-sm py-2 px-4">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Test Prep
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-slide-up">
              Ace Your AP & SAT Exams
            </h1>
            <p
              className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Master AP courses and SAT prep with AI-powered quizzes, essay grading, smart notes, and personalized study
              plans.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-foreground/20 text-foreground hover:bg-foreground/10 text-lg px-8 py-4"
                onClick={() => scrollToSection("demo")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Everything You Need to Succeed</h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Comprehensive study tools powered by AI to help you achieve your best scores on AP exams and the SAT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`${feature.color} border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <CardTitle className="ml-4 text-xl font-bold text-foreground">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/70 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">See AceAI in Action</h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Experience our interactive quiz system with real AP-style questions and instant feedback.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-background/50 border-foreground/10 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{currentQuestion.subject}</Badge>
                  <div className="flex space-x-1">
                    {sampleQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentQuestionIndex ? "bg-primary" : "bg-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-2xl font-medium text-foreground mt-4">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedAnswer === answer.id
                        ? showResult && answer.correct
                          ? "border-primary bg-primary/10 scale-105"
                          : showResult && !answer.correct
                            ? "border-error bg-error/10"
                            : "border-primary bg-primary/10"
                        : showResult && answer.correct
                          ? "border-primary bg-primary/10"
                          : "border-foreground/10 bg-background/80 hover:bg-background/90 hover:scale-102"
                    }`}
                    onClick={() => !showResult && handleAnswerSelect(answer.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          selectedAnswer === answer.id
                            ? showResult && answer.correct
                              ? "border-primary bg-primary"
                              : showResult && !answer.correct
                                ? "border-error bg-error"
                                : "border-primary bg-primary"
                            : showResult && answer.correct
                              ? "border-primary bg-primary"
                              : "border-foreground/30"
                        }`}
                      >
                        {showResult && answer.correct && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <span className="text-foreground">{answer.text}</span>
                    </div>
                  </div>
                ))}

                {showResult && (
                  <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20 animate-slide-up">
                    <h4 className="font-semibold text-foreground mb-2">Explanation:</h4>
                    <p className="text-foreground/80">{currentQuestion.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 bg-background/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats.questions.toLocaleString()}+</div>
              <div className="text-foreground/70">Practice Questions</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">{stats.improvement}%</div>
              <div className="text-foreground/70">Score Improvement</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stats.subjects}+</div>
              <div className="text-foreground/70">AP Subjects</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats.students.toLocaleString()}+</div>
              <div className="text-foreground/70">Happy Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">What Students Say</h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Join thousands of students who have improved their scores with AceAI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-background/50 border-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-foreground/70 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-background/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
            <p className="text-xl text-foreground/70">Everything you need to know about AceAI.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background/50 border border-foreground/10 rounded-lg px-6"
              >
                <AccordionTrigger className="text-foreground hover:text-primary text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to Ace Your Exams?</h2>
            <p className="text-xl text-foreground/70 mb-8">
              Join thousands of students who have improved their AP and SAT scores with AceAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="text-foreground/60 text-sm">No credit card required • 14-day free trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-background/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Get in Touch</h2>
            <p className="text-xl text-foreground/70">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">Email</div>
                  <div className="text-foreground/70">support@aceai.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">Phone</div>
                  <div className="text-foreground/70">1-800-ACE-PREP</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">Address</div>
                  <div className="text-foreground/70">123 Education St, Learning City, LC 12345</div>
                </div>
              </div>
            </div>

            <Card className="bg-background/50 border-foreground/10">
              <CardHeader>
                <CardTitle className="text-foreground">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder="Your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/30 border-foreground/20 text-foreground"
                    required
                  />
                  <Textarea
                    placeholder="Your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-background/30 border-foreground/20 text-foreground min-h-[120px]"
                    required
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                    Send Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-foreground/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-primary">Ace</span>
                <span className="text-2xl font-bold text-foreground">AI</span>
              </div>
              <p className="text-foreground/70">AI-powered test preparation for AP courses and SAT exams.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <div className="space-y-2 text-foreground/70">
                <div>Features</div>
                <div>Pricing</div>
                <div>Demo</div>
                <div>API</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <div className="space-y-2 text-foreground/70">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2 text-foreground/70">
                <div>Help Center</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Status</div>
              </div>
            </div>
          </div>
          <div className="border-t border-foreground/10 mt-8 pt-8 text-center text-foreground/70">
            <p>&copy; 2024 AceAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 