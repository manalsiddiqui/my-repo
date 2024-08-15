import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines to create the flashcards:

1.create clear and concise questions that are easy to understand.
2.provide accurate and informative answers for the back of the flashcard.
3.ensure that the questions and answers are relevant to the topic.
4.use simple language and avoid jargon.
5.Include a variety of question types, such as definitions, examples, comparisions, and applications.
6.Avoid overly complex or ambiguous pharsing in both questions and answers.
7.When appropriate, use mnemonics or other memory aids to help students remember the information.
8.Tailor the difficulty level of the flashcards to the intended audience.
9.If given a body of text, ecxtract the most important and relevant information for the flashcards.
10.Aim to creat a balenced set of flashcards that covers the topic comprehensively.
11. only generate 10 flashcards at a time to maintain focus and quality.
Remember , the goal is to facilitate effective learning and retention of information through these flashcards.
Return in the folowing JSON format
{
  "flashcards":[
        {
            "front": str,
            "back": str
        }
    ]
}
`
export async function POST(req) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY)
    const data = await req.text()
    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data },
        ],
        model: "gpt-4o",
        response_format: { type: 'json_object' },
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(flashcards.flashcards)
}