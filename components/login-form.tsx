"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({
          title: "Sign up successful",
          description: "Welcome to AceAI!",
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast({
          title: "Login successful",
          description: "Welcome back to AceAI!",
        })
      }
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      await signInAnonymously(auth)
      toast({
        title: "Guest login successful",
        description: "Welcome to AceAI!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Guest login failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full animate-fade-in bg-background/50 backdrop-blur-sm border-secondary/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center text-foreground">AceAI</CardTitle>
        <CardDescription className="text-center text-foreground/70">
          {isSignUp ? "Create an account to get started" : "Login to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 bg-background/30 border-secondary/30 text-foreground"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/90">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 bg-background/30 border-secondary/30 text-foreground"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white h-[50px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Signing up..." : "Logging in..."}
              </>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <Button
          variant="link"
          className="w-full text-foreground/70"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={isLoading}
        >
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </Button>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full border-accent/50 text-accent hover:bg-accent/10 h-[50px]"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Continue as Guest"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
