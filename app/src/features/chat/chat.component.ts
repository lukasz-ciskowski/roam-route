import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { actions } from 'astro:actions';
import { MatIconModule } from '@angular/material/icon';

type ChatMessage = {
    sender: 'user' | 'ai';
    text: string;
};

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
        MatIconModule,
    ],
})
export class ChatComponent {
    welcomeMessages: ChatMessage[] = [
        {
            sender: 'ai',
            text: 'Welcome! \nIm your ZippyJourney Assistant 🏝️.\n\n I will ask you some questions to help you plan your next amazing journey!',
        },
        // {
        //     sender: 'user',
        //     text: 'Hi! I am ready to start planning my trip.',
        // },
    ];
    messages = signal<Array<ChatMessage>>([]);
    userInput = '';
    isLoading = signal(false);

    allMessages = computed(() => {
        return [...this.welcomeMessages, ...this.messages()];
    });

    ngOnInit() {
        if (!import.meta.env.SSR) {
            this._fillInAssistantData();
        }
    }

    sendMessage(event: Event) {
        event.preventDefault();
        if (!this.userInput.trim()) return;

        this.messages.update((msgs) => [...msgs, { sender: 'user', text: this.userInput }]);
        this._fillInAssistantData();
        this.userInput = '';
    }

    private _fillInAssistantData() {
        const questions = this.messages()
            .filter((msg) => msg.sender === 'ai')
            .map((msg) => msg.text);
        const answers = this.messages()
            .filter((msg) => msg.sender === 'user')
            .map((msg) => msg.text);

        this.isLoading.set(true);
        return actions
            .fillInAssistantData({
                questions,
                answers,
            })
            .then((response) => {
                this.isLoading.set(false);
                if (response && response.data) {
                    const { nextQuestion, ready, summary } = response.data;
                    if (nextQuestion && !ready) {
                        this.messages.update((msgs) => [...msgs, { sender: 'ai', text: nextQuestion }]);
                    }
                    console.log('🚀 ~ TravelAssistantService ~ questions:', summary);
                } else {
                    this.messages.update((msgs) => [
                        ...msgs,
                        { sender: 'ai', text: 'Sorry, I could not process your request.' },
                    ]);
                }
            });
    }
}
