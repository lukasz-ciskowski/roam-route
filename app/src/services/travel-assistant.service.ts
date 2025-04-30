import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

const ai = genkit({
    plugins: [
        googleAI({
            apiKey: import.meta.env.GOOGLE_GENAI_API_KEY,
        }),
    ],
    model: gemini15Flash,
});

const TravelAssistResultSchema = z.object({
    nextQuestion: z.string(),
    ready: z.boolean(),
    summary: z
        .object({
            questions: z.array(z.string()).optional(),
            correctAnswers: z.array(z.string()).optional(),
        })
        .optional(),
});

const travelAssistantPrompt = fs.readFileSync(path.join(__dirname, 'src/contexts/travel-assist.context.txt'), 'utf-8');

export class TravelAssistantService {
    async fillInAssistantData({ questions, answers }: { questions: string[]; answers: string[] }) {
        if (!Array.isArray(questions) || !Array.isArray(answers)) {
            console.error('Invalid input: questions and answers must be arrays');
            throw new Error('Invalid input');
        }
        let contextString = `
            <questions>
                ${questions.join('\n')}
            </questions>
            <answers>
                ${answers.join('\n')}
            </answers>
        `;

        try {
            const { output } = await ai.generate({
                prompt: contextString || 'start',
                system: travelAssistantPrompt,
                output: { schema: TravelAssistResultSchema },
                config: {
                    temperature: 0,
                    topP: 0,
                    topK: 1,
                },
            });
            console.log('🚀 ~ TravelAssistantService ~ questions:', output);
            return output;
        } catch (err) {
            console.error('Failed to process travel assistant data:', err);
            throw new Error('Internal error: unable to process travel assistant data');
        }
    }
}
export const travelAssistantService = new TravelAssistantService();
