import { Suspense } from "react"
import { EssayGrading } from "@/components/essay-grading"

export default function EssayGradingPage() {
  return (
    <main className="min-h-screen bg-[#13111A]">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
        <EssayGrading />
      </Suspense>
    </main>
  )
}
