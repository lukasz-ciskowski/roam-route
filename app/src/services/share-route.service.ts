import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../app/firebase/server';
import { getAuth } from 'firebase-admin/auth';
import type { SharedRoute } from './explore.service';

type ShareRouteRequest = Omit<SharedRoute, 'id' | 'createdAt' | 'createdBy'> & {
    sessionCookie: string;
};

export class ShareRouteService {
    private db = getFirestore(app);
    private auth = getAuth(app);

    async shareRoute({ title, description, country, city, places, sessionCookie, imageUrl }: ShareRouteRequest) {
        try {
            const decodedCookie = await this.auth.verifySessionCookie(sessionCookie);
            const user = await this.auth.getUser(decodedCookie.uid);
            const routesCollection = this.db.collection('shared-routes');

            // Prepare the route data with lowercase fields for search
            const route = {
                title,
                titleLower: title.toLowerCase(),
                description,
                country,
                countryLower: country.toLowerCase(),
                city,
                cityLower: city.toLowerCase(),
                places,
                imageUrl,
                createdAt: new Date(),
                createdBy: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
            };

            const docRef = await routesCollection.add(route);

            return {
                id: docRef.id,
                ...route,
            } as SharedRoute;
        } catch (err) {
            console.error('Error sharing route:', err);
            throw new Error('Internal error: unable to share route');
        }
    }
}

export const shareRouteService = new ShareRouteService();
