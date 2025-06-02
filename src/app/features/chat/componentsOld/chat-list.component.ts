import { Component, computed, inject, OnInit, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/chat.model';
import { ChatMessage } from '../../../shared/chatbot/chat-message.model';
import { ChatbotComponent } from '../../../shared/chatbot/chatbot.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [ChatbotComponent],
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit, AfterViewInit {
  readonly chatService = inject(ChatService);
  page = signal(0);
  size = signal(20);
  readonly totalPages = this.chatService.totalPages;
  readonly list = signal<Chat[]>([]);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.loadMessages(this.page());
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  loadMessages(pageNumber: number) {
    this.chatService.fetch(pageNumber, this.size()).subscribe(res => {
      const items = (res as any).content  ;
      if (pageNumber > 0) {
        this.list.update(curr => [...curr, ...items]);
      } else {
        this.list.set(items);
      }
    });
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop === 0 && this.page() < this.totalPages() - 1) {
      this.page.update(p => p + 1);
      this.loadMessages(this.page());
    }
  }

  readonly convertToChatMessage = computed<ChatMessage[]>(() => {
    return this.list().map(chat => ({
      id: chat.id,
      user: 'me',
      content: chat.messages,
      createdAt: new Date(Date.now()),
      files: [],
    }));
  });

  handleSend($event: { message: string; files: File[] }) {
    const data: Partial<Chat> = {
      messages: $event.message,
      responses: '',
      responsesJson: '',
      state: 'new',
      account: '',
      files: [],
    };
    this.chatService.create(data).subscribe(() => this.refresh());
  }

  refresh() {
    this.page.set(0);
    this.loadMessages(0);
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
