"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, Plus, X, FileText, Tag, Video, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  type Note,
  loadNotes,
  saveNotes,
  extractKeyPoints,
  generateFlashcardsFromNote,
  generateQuestionsFromNotes,
  loadFlashcards,
  saveFlashcards,
} from "@/lib/notes-utils"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface NotesSectionProps {
  currentTopic?: string
  compact?: boolean
  onlySaved?: boolean
  onCreateQuiz?: (notes: Note[]) => void
}

export function NotesSection({ currentTopic, compact = false, onlySaved = false, onCreateQuiz }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(auth.currentUser)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        fetchNotes()
      } else {
        setNotes([])
        setIsLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchNotes = async () => {
    setIsLoading(true)
    const savedNotes = await loadNotes()
    setNotes(savedNotes)
    setIsLoading(false)
  }

  // Filter notes by current topic if provided
  const filteredNotes = currentTopic ? notes.filter((note) => note.topic === currentTopic) : notes

  const handleCreateNote = async () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: currentTopic ? `Notes on ${currentTopic}` : "New Note",
      content: "",
      topic: currentTopic || "",
      tags: [],
      keyPoints: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceType: "manual",
    }

    const newNotes = [newNote, ...notes]
    setNotes(newNotes)
    setActiveNote(newNote)
    setIsEditing(true)

    await saveNotes(newNotes)
  }

  const handleUpdateNote = async () => {
    if (!activeNote) return
    let keyPoints = activeNote.keyPoints
    if (keyPoints.length === 0 || activeNote.content !== notes.find((n) => n.id === activeNote.id)?.content) {
      try {
        const aiResult = await extractKeyPoints(activeNote.content)
        if (Array.isArray(aiResult)) {
          keyPoints = aiResult
        } else if (typeof aiResult === "string") {
          keyPoints = aiResult
            .split(/\n|\r/)
            .map((s: string) => s.trim())
            .filter(Boolean)
        } else {
          keyPoints = []
        }
      } catch {
        keyPoints = []
      }
    }
    const updatedNote = {
      ...activeNote,
      keyPoints,
      updatedAt: new Date().toISOString(),
    }
    const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    setNotes(updatedNotes)
    setActiveNote(updatedNote)
    setIsEditing(false)
    await saveNotes(updatedNotes)
    toast({ title: "Note saved", description: "Your note has been saved successfully." })
  }

  const handleAddTag = () => {
    if (!activeNote || !newTag.trim()) return

    if (!activeNote.tags.includes(newTag.trim())) {
      const updatedNote = {
        ...activeNote,
        tags: [...activeNote.tags, newTag.trim()],
      }

      setActiveNote(updatedNote)
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (!activeNote) return

    const updatedNote = {
      ...activeNote,
      tags: activeNote.tags.filter((t) => t !== tag),
    }

    setActiveNote(updatedNote)
  }

  const handleCreateFlashcards = async () => {
    if (!activeNote) return
    let flashcards = []
    try {
      const aiResult = await generateFlashcardsFromNote(activeNote)
      if (Array.isArray(aiResult)) {
        flashcards = aiResult
      } else if (typeof aiResult === 'string') {
        // Try to parse as JSON or split lines
        try {
          flashcards = JSON.parse(aiResult)
        } catch {
          flashcards = []
        }
      }
    } catch {
      flashcards = []
    }
    const existingFlashcards = await loadFlashcards()
    const updatedFlashcards = [...flashcards, ...existingFlashcards]
    await saveFlashcards(updatedFlashcards)
    toast({
      title: "Flashcards created",
      description: `${flashcards.length} flashcards have been created from your note.`,
    })
  }

  const handleCreateQuiz = async () => {
    if (!activeNote) {
      toast({
        title: "No note selected",
        description: "Please select a note to create a quiz from.",
        variant: "destructive",
      })
      return
    }

    if (!activeNote.content.trim()) {
      toast({
        title: "Empty note",
        description: "Please add content to your note before creating a quiz.",
        variant: "destructive",
      })
      return
    }

    try {
      // If onCreateQuiz prop is provided, use it (for embedded notes sections)
      if (onCreateQuiz) {
        onCreateQuiz([activeNote])
        return
      }

      // Otherwise, navigate to quiz page with the note data
      // Store the note data in sessionStorage for the quiz page to access
      sessionStorage.setItem('quizFromNotes', JSON.stringify([activeNote]))
      router.push('/dashboard/quiz')
      
      toast({
        title: "Creating quiz",
        description: "Generating quiz questions from your note...",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-background/50 border-foreground/10 flex items-center justify-center p-8">
        <p>Loading notes...</p>
      </Card>
    )
  }

  // If we're in compact mode, show a simplified version
  if (compact) {
    return (
      <Card className="bg-background/50 border-foreground/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <FileText className="h-5 w-5 mr-2 text-secondary" />
            Notes
          </CardTitle>
          <CardDescription className="text-foreground/70">
            {currentTopic ? `Your notes for ${currentTopic}` : "Your recent notes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredNotes.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {filteredNotes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-md border border-foreground/10 bg-background/80 cursor-pointer hover:bg-background/90"
                  onClick={() => {
                    setActiveNote(note)
                    setIsEditing(false)
                  }}
                >
                  <h3 className="font-medium text-foreground truncate">{note.title}</h3>
                  <p className="text-foreground/70 text-sm mt-1 line-clamp-2">{note.content}</p>
                </div>
              ))}
              {filteredNotes.length > 3 && (
                <Button
                  variant="link"
                  className="text-secondary p-0 h-auto"
                  onClick={() => {
                    // In a real app, this would navigate to the notes page
                    toast({
                      title: "View all notes",
                      description: "This would navigate to the full notes page.",
                    })
                  }}
                >
                  View all {filteredNotes.length} notes
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-foreground/50 text-sm">No notes yet.</p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-dashed border-foreground/20 text-foreground/70 hover:bg-foreground/5"
            onClick={handleCreateNote}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Note
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Notes List */}
        <div className="w-full md:w-1/3 space-y-4">
          <Card className="bg-background/50 border-foreground/10">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-foreground flex items-center">
                <FileText className="h-5 w-5 mr-2 text-secondary" />
                Your Notes
              </CardTitle>
              <CardDescription className="text-foreground/70">
                {currentTopic ? `Notes for ${currentTopic}` : "All your saved notes"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredNotes.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-md border cursor-pointer
                        ${
                          activeNote?.id === note.id
                            ? "border-secondary bg-secondary/10"
                            : "border-foreground/10 bg-background/80 hover:bg-background/90"
                        }`}
                      onClick={() => {
                        setActiveNote(note)
                        setIsEditing(false)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground truncate">{note.title}</h3>
                        {note.sourceType === "video" && <Video className="h-4 w-4 text-secondary flex-shrink-0" />}
                      </div>
                      <p className="text-foreground/70 text-sm mt-1 line-clamp-2">{note.content}</p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20 text-xs py-0">
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <p className="text-foreground/50 text-xs mt-2">{new Date(note.updatedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-foreground/50">No notes yet.</p>
                </div>
              )}

              {!onlySaved && (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-foreground/20 text-foreground/70 hover:bg-foreground/5"
                  onClick={handleCreateNote}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Note Editor */}
        <div className="w-full md:w-2/3">
          {activeNote ? (
            <Card className="bg-background/50 border-foreground/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  {isEditing ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <Input
                        value={activeNote.title}
                        onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                        className="bg-background/30 border-foreground/20 text-foreground font-medium text-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground/70 hover:text-foreground"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={handleUpdateNote}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-xl font-medium text-foreground">{activeNote.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground/70 hover:text-foreground"
                        onClick={() => setIsEditing(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {activeNote.topic && (
                  <CardDescription className="text-foreground/70 mt-1">Topic: {activeNote.topic}</CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={activeNote.content}
                    onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                    className="min-h-[200px] bg-background/30 border-foreground/20 text-foreground resize-y"
                    placeholder="Write your notes here..."
                  />
                ) : (
                  <div className="p-3 rounded-md bg-background/30 min-h-[200px] whitespace-pre-line">
                    {activeNote.content || (
                      <span className="text-foreground/50 italic">
                        No content yet. Click the edit button to add content.
                      </span>
                    )}
                  </div>
                )}

                {/* Key Points Section */}
                {activeNote.keyPoints && activeNote.keyPoints.length > 0 && !isEditing && (
                  <div className="pt-2 border-t border-foreground/10">
                    <h3 className="text-sm font-medium text-foreground mb-2">Key Points</h3>
                    <div className="space-y-2">
                      {activeNote.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge className="bg-primary/20 text-primary flex-shrink-0 mt-0.5">{index + 1}</Badge>
                          <p className="text-foreground/90 text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Section */}
                <div className="pt-2 border-t border-foreground/10">
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-foreground/70" />
                    Tags
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {activeNote.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-secondary/20 text-secondary hover:bg-secondary/30 flex items-center gap-1"
                      >
                        {tag}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-3 w-3 text-secondary/70 hover:text-secondary p-0"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </Badge>
                    ))}

                    {activeNote.tags.length === 0 && !isEditing && (
                      <span className="text-foreground/50 text-sm">No tags yet.</span>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="bg-background/30 border-foreground/20 text-foreground"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        className="border-secondary/30 text-secondary hover:bg-secondary/10"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                {!isEditing && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-foreground/10">
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={handleCreateFlashcards}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Flashcards
                    </Button>
                    <Button
                      variant="outline"
                      className="border-secondary/30 text-secondary hover:bg-secondary/10"
                      onClick={handleCreateQuiz}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </div>
                )}
              </CardContent>

              <CardFooter className="text-xs text-foreground/50">
                Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-background/50 border-foreground/10 h-full flex flex-col justify-center items-center py-12">
              <FileText className="h-12 w-12 text-foreground/20 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Note Selected</h3>
              <p className="text-foreground/50 text-center max-w-md mb-6">
                Select a note from the list or create a new one to get started.
              </p>

              {!onlySaved && (
                <Button
                  variant="outline"
                  className="border-foreground/20 text-foreground/70 hover:bg-foreground/5"
                  onClick={handleCreateNote}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
