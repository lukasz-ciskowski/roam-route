import { defineMiddleware } from 'astro:middleware';
import { getAuth } from 'firebase-admin/auth';
import { app } from './app/firebase/server';

const PUBLIC_PATHS = ['/signin', '/signup', '/api/auth/signin', '/api/auth/signup'];

export const onRequest = defineMiddleware(async (context, next) => {
    const auth = getAuth(app);

    const currentPath = context.request.url;

    const isPublicPath = PUBLIC_PATHS.some((path) => currentPath.includes(path));
    if (isPublicPath) {
        return next();
    }

    /* Check current session */
    if (!context.cookies.has('__session')) {
        return context.redirect('/signin');
    }
    const sessionCookie = context.cookies.get('__session')?.value;
    if (!sessionCookie) {
        return context.redirect('/signin');
    }
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    const user = await auth.getUser(decodedCookie.uid);

    if (!user) {
        return context.redirect('/signin');
    }

    return next();
});
