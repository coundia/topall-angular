import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/chat.model';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import { AlertService } from '../../../shared/components/alert/alert.service';

import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, EntityToolbarActionComponent],
  templateUrl: './chat-view.component.html',
})
export class ChatViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ChatService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly item = signal<Chat | null>(this.service.chats().find(e => e.id === this.id) ?? null);
  readonly isLoading = signal(false);

private readonly  accountService = inject(AccountService);
  account  =   signal<Account | null>(null);

  readonly fields: FieldDefinition[] = [
    { name: 'id',
     displayName: '', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'messages',
     displayName: 'Message', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'responses',
     displayName: 'Réponses', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'responsesJson',
     displayName: '', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'state',
     displayName: '', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'account',
     displayName: '', type: 'string',
    entityType: 'Account',
    relation: ''
     },
    { name: 'updatedAt',
     displayName: '', type: 'string',
    entityType: 'Date',
    relation: ''
     },
    { name: 'reference',
     displayName: '', type: 'string',
    entityType: 'String',
    relation: ''
     },
  ];

  constructor() {
    effect(() => {
      if (!this.item()) {
        this.isLoading.set(true);
        this.service.getById?.(this.id!).subscribe?.({
          next: e => {
            this.item.set(e);
            this.isLoading.set(false);
          },
          error: _ => {
            this.alert.show('Chat introuvable', 'error');
            this.isLoading.set(false);
          }
        });
      }
        if (this.item()) {
            this.accountService.getById(this.item()!.account!).subscribe({
              next: account => {
                this.account.set(account);
              },
              error: _ => {
                this.alert.show('Erreur lors de la récupération account', 'error');
              }
            });
          }
    });
  }

   getFieldValue(item: Chat, field: string): any {
    return (item as Record<string, any>)[field];
  }

  onDelete() {
    const id = this.item()?.id ?? this.id ?? null;
    if (!id) {
      this.alert.show(`Chat "${this.id}" introuvable`, 'error');
      return;
    }
    const confirmed = window.confirm(`Supprimer "${id}" ?`);
    if (!confirmed) return;
    this.service.delete?.(id).subscribe?.({
      next: () => {
        this.alert.show(`Chat "${id}" supprimé(e)`, 'success');
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 600);
      },
      error: err => {
        this.alert.show(`Erreur suppression "Chat ${id}"`, 'error');
      }
    });
  }


}
