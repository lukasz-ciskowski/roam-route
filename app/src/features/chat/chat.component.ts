import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { actions } from 'astro:actions';

@Component({
    selector: 'chat-component',
    standalone: true,
    templateUrl: './chat.component.html',
    imports: [
        MatCardModule,
        MatFormField,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
})
export class ChatComponent {
    messages = signal([
        {
            sender: 'ai',
            text: 'Welcome! \nIm your ZippyJourney Assistant 🏝️. I will ask you some questions to help you plan your next amazing journey!',
        },
    ]);
    userInput = '';
    isLoading = signal(false);

    ngOnInit() {
        if (!import.meta.env.SSR) {
            this._fillInAssistantData('');
        }
    }

    sendMessage(event: Event) {
        event.preventDefault();
        if (!this.userInput.trim()) return;

        this._fillInAssistantData(this.userInput);
        this.messages.update((msgs) => [...msgs, { sender: 'user', text: this.userInput }]);
        this.userInput = '';
    }

    private _fillInAssistantData(newMessage: string) {
        const oldMessages = this.messages()
            .filter((msg) => msg.sender === 'user')
            .map((msg) => `<answer>${msg.text}</answer>`);
        const prompt = oldMessages + `<answer>${newMessage}</answer>`;

        this.isLoading.set(true);
        return actions.fillInAssistantData({ prompt: prompt }).then((response) => {
            console.log('🚀 ~ ChatComponent ~ returnactions.fillInAssistantData ~ response:', response);
            this.isLoading.set(false);
            if (response) {
                this.messages.update((msgs) => [
                    ...msgs,
                    { sender: 'ai', text: response.data?.nextQuestion || 'No response' },
                ]);
            } else {
                this.messages.update((msgs) => [
                    ...msgs,
                    { sender: 'ai', text: 'Sorry, I could not process your request.' },
                ]);
            }
        });
    }
}
