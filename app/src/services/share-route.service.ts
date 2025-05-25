import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../app/firebase/server';
import { getAuth } from 'firebase-admin/auth';

export class ShareRouteService {
    private db = getFirestore(app);
    private auth = getAuth(app);

    async shareRoute({
        title,
        description,
        country,
        city,
        places,
        sessionCookie,
        imageUrl,
    }: {
        title: string;
        description: string;
        country: string;
        city: string;
        places: Array<{
            name: string;
            lat: number;
            lng: number;
        }>;
        sessionCookie: string;
        imageUrl?: string;
    }) {
        try {
            const decodedCookie = await this.auth.verifySessionCookie(sessionCookie);
            const user = await this.auth.getUser(decodedCookie.uid);
            const routesCollection = this.db.collection('shared-routes');

            const route = {
                title,
                description,
                country,
                city,
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
            };
        } catch (err) {
            console.error('Error sharing route:', err);
            throw new Error('Internal error: unable to share route');
        }
    }
}

export const shareRouteService = new ShareRouteService();
