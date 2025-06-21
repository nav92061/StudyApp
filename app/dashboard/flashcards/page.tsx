import { Suspense } from "react"
import { FlashcardsPage } from "@/components/flashcards-page"

export default function Flashcards() {
  return (
    <main className="min-h-screen bg-[#13111A]">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
        <FlashcardsPage />
      </Suspense>
    </main>
  )
}
