import type { APIRoute } from 'astro';
import { z } from 'genkit';

import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
    plugins: [
        googleAI({
            apiKey: import.meta.env.GOOGLE_GENAI_API_KEY,
        }),
    ],
    model: gemini15Flash,
});

const ResultSchema = z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    ok: z.boolean(),
});

const helloFlow = ai.defineFlow('helloFlow', async (city) => {
    const { output } = await ai.generate({
        prompt: city,
        system: 'You are a travel assistant, expect that user gives the correct city name. If city is wrong return ok: false, otherwise return ok: true with city and country name. The prompt of the user should contain the city name. You should ignore the rest of the prompt.',
        output: { schema: ResultSchema },
        config: {
            temperature: 0,
            topP: 0,
            topK: 1,
        },
    });
    return output;
});

export const GET: APIRoute = async () => {
    const result = await helloFlow('Wenecja');
    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
