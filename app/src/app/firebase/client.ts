import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: 'AIzaSyCzOvtk222uZjzJs37Vh9jbr9yDNvOMoZk',
    authDomain: 'roam-route.firebaseapp.com',
    projectId: 'roam-route',
    storageBucket: 'roam-route.firebasestorage.app',
    messagingSenderId: '700419793770',
    appId: '1:700419793770:web:4163e9fda51ff1a5747b13',
    measurementId: 'G-WT37NQRWLW',
};

export const app = initializeApp(firebaseConfig);
