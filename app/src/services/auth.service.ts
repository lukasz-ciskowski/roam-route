import { getAuth } from 'firebase-admin/auth';
import { app } from '../app/firebase/server';

export class AuthService {
    private auth = getAuth(app);

    async isAuthorized(cookie: string): Promise<boolean> {
        const decodedCookie = await this.auth.verifySessionCookie(cookie);
        const user = await this.auth.getUser(decodedCookie.uid);

        return !!user;
    }

    async getAuthUser(cookie: string) {
        const decodedCookie = await this.auth.verifySessionCookie(cookie);
        const user = await this.auth.getUser(decodedCookie.uid);

        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName ?? user.email,
        };
    }
}

export const authService = new AuthService();
