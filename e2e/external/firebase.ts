import { cert, initializeApp } from 'firebase-admin/app';

export function initFirebase() {
    // if (import.meta.env.PROD) {
    //     // Use default config in firebase functions. Should be already injected in the server by Firebase.
    //     return initializeApp();
    // }

    return initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}
