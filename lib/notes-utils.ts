import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore"
import { auth, db } from "./firebase"

export type Note = {
  id: string
  title: string
  content: string
  topic: string
  tags: string[]
  keyPoints: string[]
  createdAt: string
  updatedAt: string
  sourceType?: "manual" | "video" | "import"
  sourceUrl?: string
  userId?: string
}

export type Flashcard = {
  id: string
  front: string
  back: string
  noteId: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  lastReviewed?: string
  nextReview?: string
  repetitions: number
  userId?: string
}

export type QuizResult = {
  id: string
  topic: string
  score: number
  date: string
  questionsCount: number
  userId?: string
}

export type EssayResult = {
  id: string
  topic: string
  score: number
  letterGrade?: string
  date: string
  userId?: string
}

const getCurrentUserId = () => {
  return auth.currentUser?.uid
}

// Save notes to Firestore
export const saveNotes = async (notes: Note[]) => {
  const userId = getCurrentUserId()
  if (!userId) return

  const batch = writeBatch(db)
  notes.forEach((note) => {
    const noteRef = doc(db, "users", userId, "notes", note.id)
    batch.set(noteRef, { ...note, userId })
  })
  await batch.commit()
}

// Load notes from Firestore
export const loadNotes = async (): Promise<Note[]> => {
  const userId = getCurrentUserId()
  if (!userId) return []

  const notesCollection = collection(db, "users", userId, "notes")
  const notesSnapshot = await getDocs(notesCollection)
  return notesSnapshot.docs.map((doc) => doc.data() as Note)
}

// Save flashcards to Firestore
export const saveFlashcards = async (flashcards: Flashcard[]) => {
  const userId = getCurrentUserId()
  if (!userId) return

  const batch = writeBatch(db)
  flashcards.forEach((flashcard) => {
    const flashcardRef = doc(db, "users", userId, "flashcards", flashcard.id)
    batch.set(flashcardRef, { ...flashcard, userId })
  })
  await batch.commit()
}

// Load flashcards from Firestore
export const loadFlashcards = async (): Promise<Flashcard[]> => {
  const userId = getCurrentUserId()
  if (!userId) return []

  const flashcardsCollection = collection(db, "users", userId, "flashcards")
  const flashcardsSnapshot = await getDocs(flashcardsCollection)
  return flashcardsSnapshot.docs.map((doc) => doc.data() as Flashcard)
}

// Generate quiz questions from notes
export const generateQuestionsFromNotes = async (notes: Note[], count = 5) => {
  const content = notes.map((n) => n.content).join('\n');
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'questions', content, count }),
  });
  const data = await res.json();
  // You may need to parse data.result.candidates[0].content.parts[0].text
  // For now, return the raw result for further handling in the UI
  return data.result;
}

// Generate quiz questions from a topic
export const generateQuestionsFromTopic = async (topic: string, count = 5) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'topic-questions', topic, count }),
  });
  if (!res.ok) throw new Error('Failed to generate questions from topic');
  const data = await res.json();
  return data.result;
}

// Extract key points from note content
export const extractKeyPoints = async (content: string): Promise<string[] | string> => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'keypoints', content }),
  });
  const data = await res.json();
  // Parse the result as needed
  return data.result;
}

// Generate flashcards from notes
export const generateFlashcardsFromNote = async (note: Note): Promise<Flashcard[]> => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'flashcards', content: note.content }),
  });
  const data = await res.json();
  // Parse the result as needed
  return data.result;
}

// Process video content
export const processVideoContent = async (
  videoUrl: string,
  topic: string,
): Promise<{
  title: string
  content: string
  keyPoints: string[]
}> => {
  // For now, just send the topic as transcript (in a real app, you'd send the transcript)
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'video-notes', transcript: topic }),
  });
  const data = await res.json();
  // Parse the result as needed
  return data.result;
}

export const saveQuizResult = async (result: QuizResult) => {
  const userId = getCurrentUserId()
  if (!userId) return
  const ref = doc(db, "users", userId, "quizResults", result.id)
  await setDoc(ref, { ...result, userId })
}

export const loadQuizResults = async (): Promise<QuizResult[]> => {
  const userId = getCurrentUserId()
  if (!userId) return []
  const colRef = collection(db, "users", userId, "quizResults")
  const snap = await getDocs(colRef)
  return snap.docs.map((doc) => doc.data() as QuizResult)
}

export const saveEssayResult = async (result: EssayResult) => {
  const userId = getCurrentUserId()
  if (!userId) return
  const ref = doc(db, "users", userId, "essayResults", result.id)
  await setDoc(ref, { ...result, userId })
}

export const loadEssayResults = async (): Promise<EssayResult[]> => {
  const userId = getCurrentUserId()
  if (!userId) return []
  const colRef = collection(db, "users", userId, "essayResults")
  const snap = await getDocs(colRef)
  return snap.docs.map((doc) => doc.data() as EssayResult)
}
