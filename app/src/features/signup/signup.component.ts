import { Component, signal, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthClientService } from '../../services/auth-client.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule],
    templateUrl: './signup.component.html',
})
export class SignupComponent {
    @Output() onAuthorized = new EventEmitter<boolean>();

    signupForm = new FormGroup(
        {
            email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
            password: new FormControl('', {
                validators: [Validators.required, Validators.minLength(6)],
                nonNullable: true,
            }),
            confirmPassword: new FormControl('', { validators: [Validators.required], nonNullable: true }),
        },
        { validators: this.passwordMatchValidator },
    );
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    constructor(private authService: AuthClientService) {}

    private passwordMatchValidator(control: AbstractControl) {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password?.value === confirmPassword?.value) {
            return null;
        }
        return { mismatch: true };
    }

    async signUpWithGoogle() {
        if (this.isLoading()) return;

        this.isLoading.set(true);
        this.errorMessage.set(null);

        try {
            const idToken = await this.authService.signInWithGoogle();
            await this.authService.handleAuthentication(idToken);
            this.onAuthorized.emit(true);
        } catch (error) {
            this.errorMessage.set('Google sign-up failed. Please try again.');
        } finally {
            this.isLoading.set(false);
        }
    }

    async onSubmit() {
        if (this.signupForm.invalid || this.isLoading()) {
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        try {
            const { email, password } = this.signupForm.value;
            if (!email || !password) {
                this.errorMessage.set('Email and password are required');
                return;
            }

            const idToken = await this.authService.signUpWithEmailAndPassword(email, password);
            await this.authService.handleAuthentication(idToken);
            this.onAuthorized.emit(true);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                this.errorMessage.set('Email already in use');
            } else {
                this.errorMessage.set('Failed to create account');
            }
        } finally {
            this.isLoading.set(false);
        }
    }
}
