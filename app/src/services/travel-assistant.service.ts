import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { z } from 'genkit';
import { promises as fs } from 'fs';
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
    allAnswers: z.string().optional(),
});

export class TravelAssistantService {
    async fillInAssistantData(prompt: string) {
        try {
            const systemPrompt = await fs.readFile(__dirname + '/src/contexts/travel-assist.context.txt', 'utf-8');
            const { output } = await ai.generate({
                prompt,
                system: systemPrompt,
                output: { schema: TravelAssistResultSchema },
                config: {
                    temperature: 0,
                    topP: 0,
                    topK: 1,
                },
            });
            return output;
        } catch (err) {
            console.error('Failed to read system prompt:', err);
            throw new Error('Internal error: unable to load system prompt');
        }
    }
}
export const travelAssistantService = new TravelAssistantService();
