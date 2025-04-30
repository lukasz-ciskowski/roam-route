import { defineAction } from 'astro:actions';
import { z as astroZ } from 'astro:schema';

import { travelAssistantService } from '../services/travel-assistant.service';

export const server = {
    fillInAssistantData: defineAction({
        input: astroZ.object({
            prompt: astroZ.string(),
        }),
        handler: async (input) => {
            return await travelAssistantService.fillInAssistantData(input.prompt);
        },
    }),
};
