import { App } from 'firebase-admin/app';
import { initFirebase } from '../external/firebase';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

export class ExploreTestService {
    private app: App;
    private db: Firestore;

    constructor() {
        this.app = initFirebase();
        this.db = getFirestore(this.app);
    }

    async clearSharedRoutes() {
        const snapshot = await this.db.collection('shared-routes').get();
        const batch = this.db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }

    async createTestSharedRoutes() {
        await this.db.collection('shared-routes').add({
            title: 'Paris Adventure',
            titleLower: 'paris adventure',
            description: 'A beautiful day in Paris',
            country: 'France',
            countryLower: 'france',
            city: 'Paris',
            cityLower: 'paris',
            createdAt: new Date(),
            createdBy: {
                uid: 'test-user-1',
                email: 'test1@example.com',
                displayName: 'Test User 1',
            },
            places: [{ name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945 }],
        });

        await this.db.collection('shared-routes').add({
            title: 'London Experience',
            titleLower: 'london experience',
            description: 'Exploring London landmarks',
            country: 'United Kingdom',
            countryLower: 'united kingdom',
            city: 'London',
            cityLower: 'london',
            createdAt: new Date(),
            createdBy: {
                uid: 'test-user-2',
                email: 'test2@example.com',
                displayName: 'Test User 2',
            },
            places: [{ name: 'Big Ben', lat: 51.5007, lng: -0.1246 }],
        });
    }

    async cleanupSharedRoutes() {
        await this.clearSharedRoutes();
    }
}

export const exploreTestService = new ExploreTestService();
