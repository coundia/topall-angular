import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/chat.model';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import {toDatetimeLocalString} from '../../../shared/hooks/Parsing';

import {EntityPickerComponent} from '../../../shared/picker/app-entity-picker';


import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';


@Component({
  selector: 'app-chat-form',
  standalone: true,
  imports: [CommonModule,
   ReactiveFormsModule,
    EntityPickerComponent,
    EntityToolbarActionComponent
    ],
  templateUrl: './chat-form.component.html',
})
export class ChatFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly isEdit = signal(!!this.id);
  readonly isLoading = signal(false);

    private readonly  accountService = inject(AccountService);
    accounts  =   signal<Account[]>([]);

  readonly form = this.fb.group({
    id: [ ""  ],
    messages: [ "" , Validators.required ],
    responses: [ ""  ],
    responsesJson: [ ""  ],
    state: [ ""  ],
    account: [ ""  ],
    updatedAt: [ ""  ],
    reference: [ ""  ],
  });

  readonly fields: FieldDefinition[] = [
    { name: 'id',
    displayName: '',
     type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'messages',
    displayName: 'Message',
     type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'responses',
    displayName: 'Réponses',
     type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'responsesJson',
    displayName: '',
     type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'state',
    displayName: '',
     type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'account',
    displayName: '',
     type: 'string',
      entityType: 'Account' ,
      inputType: 'String',
      relation: 'manyToOne'
      },
    { name: 'updatedAt',
    displayName: '',
     type: 'string',
      entityType: 'Date' ,
      inputType: 'Date',
      relation: ''
      },
    { name: 'reference',
    displayName: '',
     type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
  ];

  ngOnInit() {
    if (this.isEdit()) {
      let existing = this.service.chats().find(e => e.id === this.id);
      if (existing) {
        this.form.patchValue({
                id: existing.id,
                messages: existing.messages,
                responses: existing.responses,
                responsesJson: existing.responsesJson,
                state: existing.state,
                account: existing.account,
                updatedAt: toDatetimeLocalString(existing.updatedAt) || '',
                reference: existing.reference,
        });
      } else {
        this.isLoading.set(true);
        this.service.getById?.(this.id!).subscribe?.({
          next: e => {
            if (e) {
              this.form.patchValue({
                    id: e.id,
                    messages: e.messages,
                    responses: e.responses,
                    responsesJson: e.responsesJson,
                    state: e.state,
                    account: e.account,
                    updatedAt: toDatetimeLocalString(e.updatedAt) || '',
                    reference: e.reference,
              });
            }
            this.isLoading.set(false);
          },
          error: _ => {
            this.isLoading.set(false);
            this.alert.show('Chat introuvable', 'error');
          }
        });
      }
    }

    this.fetchDeps();

  }

  save() {
    if (this.form.invalid) return;

    const now = new Date().toISOString();

    const data: Partial<Chat> = {
      ...this.form.getRawValue(),
      updatedAt: now
    };

    this.isLoading.set(true);

    data.updatedAt = new Date(data.updatedAt || now).toISOString();

    const request = this.isEdit()
      ? this.service.update(this.id!, data)
      : this.service.create(data);

    request.subscribe({
      next: async () => {
        this.isLoading.set(false);
        this.alert.show("Operation en cours...!", 'success');
        setTimeout(() => {
          this.alert.show("Opération réussie avec succès!", 'success');
        }, 1000)
        await this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.alert.show('An error occurred while saving the chat. Please try again.', 'error');
      }
    });
  }

   onDelete() {
        //todo
      }

    fetchDeps() {
         this.accountService.fetch(0,1000).subscribe(data => this.accounts.set(data.content));
    }

    getEntities(name: string) {
        if (name === 'account') return this.accounts();
    return [];
    }


}
