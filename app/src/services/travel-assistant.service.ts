import { gemini15Flash, googleAI, gemini25ProExp0325 } from '@genkit-ai/googleai';
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
    // model: gemini25ProExp0325,
    model: gemini15Flash,
});

const TravelAssistResultSchema = z.object({
    nextQuestion: z.string(),
    readyToShowMarkers: z.boolean(),
    markersSuggestions: z
        .array(
            z.object({
                lat: z.number(),
                lng: z.number(),
                name: z.string(),
            }),
        )
        .optional(),
});

export class TravelAssistantService {
    async fillInAssistantData({ questions, answers }: { questions: string[]; answers: string[] }) {
        const travelAssistantPrompt = fs.readFileSync(
            path.join(__dirname, 'src/contexts/travel-assist.context.txt'),
            'utf-8',
        );

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
            console.log('🚀 ~ TravelAssistantService ~ fillInAssistantData ~ output:', output);
            return output;
        } catch (err) {
            throw new Error('Internal error: unable to process travel assistant data');
        }
    }
}
export const travelAssistantService = new TravelAssistantService();
