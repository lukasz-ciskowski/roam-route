import { Component, computed, effect, signal, Output, EventEmitter, input, output } from '@angular/core';
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
import type { MarkersResponse } from '../map/types';

export type ChatMessage = {
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
    onUpdateResponse = output<MarkersResponse>();

    messages = signal<Array<ChatMessage>>([]);
    welcomeMessages: ChatMessage[] = [
        {
            sender: 'ai',
            text: 'Welcome! \nIm your RoamRoute Assistant 🏝️.\n\n I will ask you some questions to help you plan your next amazing journey!',
        },
    ];

    userInput = '';
    isLoading = signal(false);

    allMessages = computed(() => {
        return [...this.welcomeMessages, ...this.messages()];
    });

    ngOnInit() {
        this._fillInAssistantData(this.messages());
    }

    constructor() {
        effect(() => {
            this.messages();
            // Use setTimeout to ensure DOM is updated before scrolling, included map display
            setTimeout(() => this._scrollToBottom(), 5);
        });
    }

    sendMessage(event: Event) {
        event.preventDefault();

        if (!this.userInput.trim()) return;

        const newMessages = [...this.messages(), { sender: 'user' as const, text: this.userInput }];
        this.messages.set(newMessages);
        this._fillInAssistantData(newMessages);
        this.userInput = '';
    }

    private _fillInAssistantData(messages: Array<ChatMessage>) {
        const questions = messages.filter((msg) => msg.sender === 'ai').map((msg) => msg.text);
        const answers = messages.filter((msg) => msg.sender === 'user').map((msg) => msg.text);

        this.isLoading.set(true);
        return actions
            .fillInAssistantData({
                questions,
                answers,
            })
            .then((response) => {
                this.isLoading.set(false);
                if (response && response.data) {
                    const { nextQuestion, readyToShowMarkers, markersSuggestions, city, country } = response.data;
                    if (nextQuestion) {
                        const newMessages = [...this.messages(), { sender: 'ai' as const, text: nextQuestion }];
                        this.messages.set(newMessages);
                    }
                    if (readyToShowMarkers && markersSuggestions) {
                        this.onUpdateResponse.emit({ markers: markersSuggestions, city, country });
                    }
                } else {
                    const newMessages = [
                        ...this.messages(),
                        { sender: 'ai' as const, text: 'Sorry, I could not process your request.' },
                    ];
                    this.messages.set(newMessages);
                }
            });
    }

    private _scrollToBottom() {
        const chatContainer = document.querySelector('#chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
}
