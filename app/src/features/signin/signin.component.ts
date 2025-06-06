import { Component, signal, Output, EventEmitter, effect } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthClientService } from '../../services/auth-client.service';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule],
    templateUrl: './signin.component.html',
})
export class SigninComponent {
    @Output() onAuthorized = new EventEmitter<boolean>();

    signinForm = new FormGroup({
        email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
    });
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    constructor(private authService: AuthClientService) {}

    async signInWithGoogle() {
        if (this.isLoading()) return;

        this.isLoading.set(true);
        this.errorMessage.set(null);

        try {
            const idToken = await this.authService.signInWithGoogle();
            await this.authService.handleAuthentication(idToken);
            this.onAuthorized.emit(true);
        } catch (error) {
            this.errorMessage.set('Google sign-in failed. Please try again.');
        } finally {
            this.isLoading.set(false);
        }
    }

    async onSubmit() {
        if (this.signinForm.invalid || this.isLoading()) {
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        try {
            const { email, password } = this.signinForm.value;
            if (!email || !password) {
                this.errorMessage.set('Email and password are required');
                return;
            }

            const idToken = await this.authService.signInWithEmailAndPassword(email, password);
            await this.authService.handleAuthentication(idToken);
            this.onAuthorized.emit(true);
        } catch (error) {
            this.errorMessage.set('Invalid email or password');
        } finally {
            this.isLoading.set(false);
        }
    }
}
