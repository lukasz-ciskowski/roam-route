import { gemini15Flash, googleAI, gemini25FlashPreview0417 } from '@genkit-ai/googleai';
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
    model: gemini25FlashPreview0417,
    // model: gemini15Flash,
});

const travelAssistantPrompt = fs.readFileSync(path.join(__dirname, 'src/contexts/travel-assist.context.txt'), 'utf-8');
const shareRoutePrompt = fs.readFileSync(path.join(__dirname, 'src/contexts/share-route.context.txt'), 'utf-8');

const TravelAssistResultSchema = z.object({
    nextQuestion: z.string(),
    readyToShowMarkers: z.boolean(),
    city: z.string().optional(),
    country: z.string().optional(),
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
            return output;
        } catch (err) {
            console.log('🚀 ~ TravelAssistantService ~ fillInAssistantData ~ err:', err);
            throw new Error('Internal error: unable to process travel assistant data');
        }
    }

    async generateRouteDescription({ city, country, places }: { city: string; country: string; places: string[] }) {
        const contextString = `
            <city>${city}</city>
            <country>${country}</country>
            <places>${places.join(', ')}</places>
        `;

        try {
            const { output } = await ai.generate({
                prompt: contextString,
                system: shareRoutePrompt,
                config: {
                    temperature: 0,
                    topP: 0,
                    topK: 1,
                },
                output: {
                    schema: z.object({
                        description: z.string(),
                    }),
                },
            });
            return output?.description;
        } catch (err) {
            console.error('Error generating route description:', err);
            throw new Error('Internal error: unable to generate route description');
        }
    }
}
export const travelAssistantService = new TravelAssistantService();
