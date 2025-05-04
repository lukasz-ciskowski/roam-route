import { Component, computed, effect, signal, Output, EventEmitter } from '@angular/core';
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
import { MapComponent } from '../map/map.component';
import type { MarkersResponse } from '../map/types';

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
        MapComponent,
    ],
})
export class ChatComponent {
    @Output() markersUpdate = new EventEmitter<MarkersResponse>();

    welcomeMessages: ChatMessage[] = [
        {
            sender: 'ai',
            text: 'Welcome! \nIm your RoamRoute Assistant 🏝️.\n\n I will ask you some questions to help you plan your next amazing journey!',
        },
    ];
    messages = signal<Array<ChatMessage>>([]);
    userInput = '';
    isLoading = signal(false);

    allMessages = computed(() => {
        return [...this.welcomeMessages, ...this.messages()];
    });

    constructor() {
        effect(() => {
            // Trigger the scroll when messages signal changes
            this.messages();
            // Use setTimeout to ensure DOM is updated before scrolling, included map display
            setTimeout(() => this._scrollToBottom(), 5);
        });
    }

    ngOnInit() {
        this._fillInAssistantData();
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
                    const { nextQuestion, readyToShowMarkers, markersSuggestions } = response.data;
                    if (nextQuestion) {
                        this.messages.update((msgs) => [...msgs, { sender: 'ai', text: nextQuestion }]);
                    }
                    if (readyToShowMarkers && markersSuggestions) {
                        this.markersUpdate.emit({ markers: markersSuggestions });
                    }
                } else {
                    this.messages.update((msgs) => [
                        ...msgs,
                        { sender: 'ai', text: 'Sorry, I could not process your request.' },
                    ]);
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
