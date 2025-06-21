import { Suspense } from "react"
import { NotesPage } from "@/components/notes-page"

export default function Notes() {
  return (
    <main className="min-h-screen bg-[#13111A]">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
        <NotesPage />
      </Suspense>
    </main>
  )
}
