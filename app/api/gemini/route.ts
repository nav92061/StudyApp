import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = 'AIzaSyBJR4AdTrGMrpn1wO7GtTXWFt3Ee2D0fQc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    let prompt = '';
    switch (type) {
      case 'questions':
        prompt = `Generate ${data.count || 5} multiple choice questions on the notes provided. The output should be a valid JSON array of objects, where each object has the following format: { "id": "string", "text": "string", "answers": [{ "id": "string", "text": "string", "isCorrect": boolean }], "explanation": "string" }. Ensure only one answer is correct. Notes: ${data.content}`;
        break;
      case 'topic-questions':
        prompt = `Generate ${data.count || 5} multiple choice questions on the topic of "${data.topic}". The output should be a valid JSON array of objects, where each object has the following format: { "id": "string", "text": "string", "answers": [{ "id": "string", "text": "string", "isCorrect": boolean }], "explanation": "string" }. Ensure only one answer is correct.`;
        break;
      case 'keypoints':
        prompt = `Extract the key points from the following text as a list:\n${data.content}`;
        break;
      case 'flashcards':
        prompt = `Generate flashcards (front: question, back: answer) from these notes:\n${data.content}`;
        break;
      case 'video-notes':
        prompt = `Summarize the following video transcript and extract key points:\n${data.transcript}`;
        break;
      case 'essay-grading':
        prompt = `Please grade the following essay based on the provided prompt. Provide a score from 1 to 10, detailed feedback, and a list of suggestions for improvement. The output should be a valid JSON object with the format: { "score": number, "feedback": "string", "suggestions": ["string"] }. \n\nEssay Prompt: "${data.prompt}"\n\nEssay Content: "${data.essayContent}"`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const geminiRes = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini API Error:", errorText);
      return NextResponse.json({ error: "Failed to fetch from Gemini API", details: errorText }, { status: geminiRes.status });
    }

    const geminiData = await geminiRes.json();
    return NextResponse.json({ result: geminiData });
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json({ error: error?.toString() || 'Unknown error' }, { status: 500 });
  }
} 