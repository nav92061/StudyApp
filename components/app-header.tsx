"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Notebook,
  BookMarked,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AppHeaderProps {
  username: string
}

export function AppHeader({ username }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const navItems = [
    { name: "Home", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Quiz", href: "/dashboard/quiz", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Essay", href: "/dashboard/essay", icon: <FileText className="h-5 w-5" /> },
    { name: "Notes", href: "/dashboard/notes", icon: <Notebook className="h-5 w-5" /> },
    { name: "Flashcards", href: "/dashboard/flashcards", icon: <BookMarked className="h-5 w-5" /> },
    { name: "Stats", href: "/dashboard/stats", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Classes", href: "/dashboard/class-setup", icon: <Users className="h-5 w-5" /> },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-foreground/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo - Left side */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Ace</span>
              <span className="text-2xl font-bold text-foreground">AI</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                    ${
                      isActive(item.href)
                        ? "bg-primary/20 text-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User menu - Right side */}
          <div className="flex items-center flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-foreground/20">
                <DropdownMenuLabel className="text-foreground">{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-foreground/80 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-foreground/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-primary/20 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-error hover:text-error hover:bg-error/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
