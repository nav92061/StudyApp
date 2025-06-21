"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppHeader } from "@/components/app-header"
import { TopicEntryDialog } from "@/components/topic-entry-dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Save, Upload, Download, Users, BookOpen, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Class = {
  id: string
  name: string
  topics: string[]
}

export function ClassSetupView() {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "class-1",
      name: "AP Calculus BC",
      topics: ["Limits & Continuity", "Derivatives", "Integrals", "Series & Sequences", "Parametric & Polar Functions"],
    },
    {
      id: "class-2",
      name: "AP U.S. History",
      topics: [
        "Colonial America",
        "American Revolution",
        "Civil War & Reconstruction",
        "Progressive Era",
        "Great Depression",
        "Cold War",
        "Civil Rights Movement",
      ],
    },
    {
      id: "class-3",
      name: "SAT Preparation",
      topics: ["Reading Comprehension", "Writing & Language", "Math - No Calculator", "Math - Calculator"],
    },
  ])
  const [selectedClassId, setSelectedClassId] = useState<string | null>("class-1")
  const [newClassName, setNewClassName] = useState("")
  const [isAddingClass, setIsAddingClass] = useState(false)
  const [isEditingClass, setIsEditingClass] = useState(false)
  const [editingClassName, setEditingClassName] = useState("")
  const [showTopicDialog, setShowTopicDialog] = useState(false)
  const { toast } = useToast()

  const selectedClass = selectedClassId ? classes.find((c) => c.id === selectedClassId) : null

  const handleAddClass = () => {
    if (newClassName.trim()) {
      const newClass: Class = {
        id: `class-${Date.now()}`,
        name: newClassName,
        topics: [],
      }

      setClasses([...classes, newClass])
      setNewClassName("")
      setIsAddingClass(false)
      setSelectedClassId(newClass.id)

      toast({
        title: "Class Added",
        description: `${newClassName} has been added successfully.`,
      })
    }
  }

  const handleDeleteClass = (classId: string) => {
    const updatedClasses = classes.filter((c) => c.id !== classId)
    setClasses(updatedClasses)

    if (selectedClassId === classId) {
      setSelectedClassId(updatedClasses.length > 0 ? updatedClasses[0].id : null)
    }

    toast({
      title: "Class Deleted",
      description: "The class has been deleted successfully.",
    })
  }

  const handleStartEditClass = () => {
    if (selectedClass) {
      setEditingClassName(selectedClass.name)
      setIsEditingClass(true)
    }
  }

  const handleSaveEditClass = () => {
    if (selectedClassId && editingClassName.trim()) {
      const updatedClasses = classes.map((c) => (c.id === selectedClassId ? { ...c, name: editingClassName } : c))

      setClasses(updatedClasses)
      setIsEditingClass(false)

      toast({
        title: "Class Updated",
        description: "The class name has been updated successfully.",
      })
    }
  }

  const handleAddTopic = (topic: string) => {
    if (selectedClassId) {
      const updatedClasses = classes.map((c) => {
        if (c.id === selectedClassId) {
          return {
            ...c,
            topics: [...c.topics, topic],
          }
        }
        return c
      })

      setClasses(updatedClasses)

      toast({
        title: "Topic Added",
        description: `${topic} has been added to ${selectedClass?.name}.`,
      })
    }
  }

  const handleDeleteTopic = (topic: string) => {
    if (selectedClassId) {
      const updatedClasses = classes.map((c) => {
        if (c.id === selectedClassId) {
          return {
            ...c,
            topics: c.topics.filter((t) => t !== topic),
          }
        }
        return c
      })

      setClasses(updatedClasses)

      toast({
        title: "Topic Removed",
        description: `${topic} has been removed from ${selectedClass?.name}.`,
      })
    }
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(classes, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = "aceai-classes.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data Exported",
      description: "Your class data has been exported successfully.",
    })
  }

  const handleImportData = () => {
    // In a real app, this would open a file picker
    // For this demo, we'll just simulate importing data

    toast({
      title: "Data Imported",
      description: "Your class data has been imported successfully.",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader username="User" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Class Management</h1>
          <p className="text-foreground/70 mb-8">Manage your classes and topics</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class List */}
            <Card className="bg-background/50 border-foreground/10 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-foreground flex items-center">
                  <Users className="h-5 w-5 mr-2 text-foreground/70" />
                  Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-3 rounded-md border cursor-pointer flex justify-between items-center
                      ${
                        selectedClassId === cls.id
                          ? "border-primary bg-primary/10"
                          : "border-foreground/10 bg-background/80 hover:bg-background/90"
                      }`}
                    onClick={() => setSelectedClassId(cls.id)}
                  >
                    <div>
                      <p className="font-medium text-foreground">{cls.name}</p>
                      <p className="text-sm text-foreground/70">{cls.topics.length} topics</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error/70 hover:text-error hover:bg-error/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClass(cls.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {isAddingClass ? (
                  <div className="p-3 rounded-md border border-foreground/10 bg-background/80 space-y-3">
                    <Input
                      placeholder="Enter class name"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="bg-background/30 border-foreground/20 text-foreground"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground/70"
                        onClick={() => {
                          setIsAddingClass(false)
                          setNewClassName("")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={handleAddClass}
                        disabled={!newClassName.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-foreground/20 text-foreground/70 hover:bg-foreground/5"
                    onClick={() => setIsAddingClass(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Class
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground/70 border-foreground/20"
                  onClick={handleImportData}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground/70 border-foreground/20"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardFooter>
            </Card>

            {/* Class Details */}
            <Card className="bg-background/50 border-foreground/10 md:col-span-2">
              {selectedClass ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      {isEditingClass ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <Input
                            value={editingClassName}
                            onChange={(e) => setEditingClassName(e.target.value)}
                            className="bg-background/30 border-foreground/20 text-foreground"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-foreground/70 hover:text-foreground"
                            onClick={() => setIsEditingClass(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={handleSaveEditClass}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-xl font-medium text-foreground">{selectedClass.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-foreground/70 hover:text-foreground"
                            onClick={handleStartEditClass}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    <CardDescription className="text-foreground/70">Manage topics for this class</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedClass.topics.map((topic) => (
                        <Badge
                          key={topic}
                          className="bg-secondary/20 text-secondary hover:bg-secondary/30 px-3 py-1 text-sm flex items-center gap-1"
                        >
                          {topic}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 text-secondary/70 hover:text-secondary"
                            onClick={() => handleDeleteTopic(topic)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}

                      {selectedClass.topics.length === 0 && (
                        <p className="text-foreground/50 text-sm">No topics added yet. Add topics to get started.</p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="border-dashed border-foreground/20 text-foreground/70 hover:bg-foreground/5"
                      onClick={() => setShowTopicDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Topic
                    </Button>
                  </CardContent>
                </>
              ) : (
                <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                  <BookOpen className="h-12 w-12 text-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Class Selected</h3>
                  <p className="text-foreground/70 mb-4">
                    Select a class from the list or create a new one to get started.
                  </p>
                  <Button
                    variant="outline"
                    className="border-foreground/20 text-foreground/70 hover:bg-foreground/5"
                    onClick={() => setIsAddingClass(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Class
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>

          {showTopicDialog && (
            <TopicEntryDialog
              open={showTopicDialog}
              onClose={() => setShowTopicDialog(false)}
              onAddTopic={handleAddTopic}
            />
          )}
        </div>
      </main>
    </div>
  )
}
