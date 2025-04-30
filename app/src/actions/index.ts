import { defineAction } from 'astro:actions';
import { z as astroZ } from 'astro:schema';

import { travelAssistantService } from '../services/travel-assistant.service';

export const server = {
    fillInAssistantData: defineAction({
        input: astroZ.object({
            questions: astroZ.array(astroZ.string()),
            answers: astroZ.array(astroZ.string()),
        }),
        handler: async (input) => {
            return await travelAssistantService.fillInAssistantData({
                questions: input.questions,
                answers: input.answers,
            });
        },
    }),
};
