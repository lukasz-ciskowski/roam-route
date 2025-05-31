import { Injectable, signal } from '@angular/core';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    inMemoryPersistence,
    type User,
} from 'firebase/auth';
import { auth } from '../app/firebase/client';

@Injectable({
    providedIn: 'root',
})
export class AuthClientService {
    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);
    isLoading = signal<boolean>(true);

    constructor() {
        this.initAuthState();
    }

    private initAuthState() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser.set(user);
            this.isAuthenticated.set(!!user);
            this.isLoading.set(false);
        });
    }

    isSignedIn(): boolean {
        return this.isAuthenticated();
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }

    async signInWithEmailAndPassword(email: string, password: string): Promise<string> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return await userCredential.user.getIdToken();
        } catch (error) {
            throw error;
        }
    }

    async signUpWithEmailAndPassword(email: string, password: string): Promise<string> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return await userCredential.user.getIdToken();
        } catch (error) {
            throw error;
        }
    }

    async signInWithGoogle(): Promise<string> {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            return await result.user.getIdToken();
        } catch (error) {
            throw error;
        }
    }

    async handleAuthentication(idToken: string): Promise<Response> {
        return fetch('/api/auth/signin', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
    }
}
