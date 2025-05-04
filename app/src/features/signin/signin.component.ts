import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    getAuth,
    inMemoryPersistence,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { app } from '../../app/firebase/client';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule],
    templateUrl: './signin.component.html',
})
export class SigninComponent {
    signinForm = new FormGroup({
        email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
    });
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    constructor() {}

    private async handleAuthentication(idToken: string) {
        const response = await fetch('/api/auth/signin', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (response.redirected) {
            window.location.assign(response.url);
        }
    }

    async signInWithGoogle() {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        try {
            const auth = getAuth(app);
            auth.setPersistence(inMemoryPersistence);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            await this.handleAuthentication(idToken);
        } catch (error) {
            this.errorMessage.set('Google sign-in failed. Please try again.');
        } finally {
            this.isLoading.set(false);
        }
    }

    async onSubmit() {
        if (this.signinForm.invalid) {
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        try {
            const auth = getAuth(app);
            auth.setPersistence(inMemoryPersistence);
            const { email, password } = this.signinForm.value;
            if (!email || !password) {
                this.errorMessage.set('Email and password are required');
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            await this.handleAuthentication(idToken);
        } catch (error) {
            this.errorMessage.set('Invalid email or password');
        } finally {
            this.isLoading.set(false);
        }
    }
}
