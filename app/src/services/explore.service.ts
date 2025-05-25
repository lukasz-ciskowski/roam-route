import type { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import {
    or,
    query,
    where,
    collection,
    getFirestore,
    getDocs,
    limit,
    orderBy,
    getCountFromServer,
    updateDoc,
} from 'firebase/firestore';
import { app } from '../app/firebase/client';

export interface SharedRoute {
    id: string;
    title: string;
    titleLower: string;
    description: string;
    country: string;
    countryLower: string;
    city: string;
    cityLower: string;
    imageUrl?: string;
    createdAt: Date;
    createdBy: {
        uid: string;
        email: string;
        displayName: string;
    };
    places: Array<{
        name: string;
        lat: number;
        lng: number;
    }>;
}

export class ExploreService {
    private db = getFirestore(app);
    private readonly ROUTES_PER_PAGE = 48; // 6x8 grid

    async getSharedRoutes(page: number = 1, search?: string) {
        try {
            const routesRef = collection(this.db, 'shared-routes');
            let baseQuery = query(routesRef, where('createdAt', '!=', null), orderBy('createdAt', 'desc'));

            if (search) {
                const searchLower = search.toLowerCase();
                const endSearchLower = searchLower + '\uf8ff';

                baseQuery = query(
                    routesRef,
                    or(
                        where('titleLower', '>=', searchLower),
                        where('titleLower', '<=', endSearchLower),
                        where('countryLower', '>=', searchLower),
                        where('countryLower', '<=', endSearchLower),
                        where('cityLower', '>=', searchLower),
                        where('cityLower', '<=', endSearchLower),
                    ),
                    orderBy('createdAt', 'desc'),
                );
            }

            // Calculate skip based on page number
            const skip = (page - 1) * this.ROUTES_PER_PAGE;
            const paginatedQuery = query(baseQuery, limit(this.ROUTES_PER_PAGE));

            const snapshot = await getDocs(paginatedQuery);
            const routes = snapshot.docs.slice(skip, skip + this.ROUTES_PER_PAGE).map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data()?.createdAt.toDate(),
            })) as SharedRoute[];

            const countSnapshot = await getCountFromServer(baseQuery);
            const total = countSnapshot.data().count;

            return {
                routes,
                total,
                pageSize: this.ROUTES_PER_PAGE,
            };
        } catch (err) {
            console.error('Error fetching shared routes:', err);
            throw new Error('Failed to fetch shared routes');
        }
    }
}

export const exploreService = new ExploreService();
