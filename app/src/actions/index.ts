import { defineAction } from 'astro:actions';
import { z as astroZ } from 'astro:schema';

import { travelAssistantService } from '../services/travel-assistant.service';
import { shareRouteService } from '../services/share-route.service';
import { exploreService } from '../services/explore.service';
import { authService } from '../services/auth.service';

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
    generateRouteDescription: defineAction({
        input: astroZ.object({
            city: astroZ.string(),
            country: astroZ.string(),
            places: astroZ.array(astroZ.string()),
        }),
        handler: async (input) => {
            return await travelAssistantService.generateRouteDescription({
                city: input.city,
                country: input.country,
                places: input.places,
            });
        },
    }),
    shareRoute: defineAction({
        input: astroZ.object({
            title: astroZ.string(),
            description: astroZ.string(),
            city: astroZ.string(),
            country: astroZ.string(),
            places: astroZ.array(
                astroZ.object({
                    name: astroZ.string(),
                    lat: astroZ.number(),
                    lng: astroZ.number(),
                }),
            ),
            imageUrl: astroZ.string().url().optional(),
        }),
        handler: async (input, context) => {
            const sessionCookie = context.cookies.get('__session')?.value;
            if (!sessionCookie) {
                throw new Error('Unauthorized');
            }

            const isAuthorized = await authService.isAuthorized(sessionCookie);
            if (!isAuthorized) {
                throw new Error('Unauthorized');
            }

            return await shareRouteService.shareRoute({
                ...input,
                sessionCookie,
            });
        },
    }),
    getSharedRoutes: defineAction({
        input: astroZ.object({
            page: astroZ.number().min(1).default(1),
            search: astroZ.string().optional(),
        }),
        handler: async ({ page, search }) => {
            return await exploreService.getSharedRoutes(page, search);
        },
    }),
};
