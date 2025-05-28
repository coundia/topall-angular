import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from './chat-message.model';
import { ChatMessageListComponent } from './chat-message-list.component';
import { ChatInputComponent } from './chat-input.component';

@Component({
  selector: 'app-shared-chatbot',
  standalone: true,
  imports: [CommonModule, ChatMessageListComponent, ChatInputComponent, ChatMessageListComponent],
  templateUrl: './chatbot.component.html',
})
export class ChatbotComponent {
  @Input({ required: true }) messages!: () => ChatMessage[];
  @Output() send = new EventEmitter<{ message: string, files: File[] }>();
  @Output() clear = new EventEmitter<void>();
  @Output() ocr = new EventEmitter<File>();

  handleSend(event: { message: string, files: File[] }) {
    this.send.emit(event);
  }
  handleClear() {
    this.clear.emit();
  }

  handleSpeech($event: string) {

  }

  handleCamera($event: File) {

  }

  handleOCR($event: File) {

  }
}
