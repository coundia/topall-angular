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
import {FileManager} from "../../fileManager/models/fileManager.model";
import {FileManagerService} from "../../fileManager/services/fileManager.service";
import {MultiFileInputComponent} from '../../../shared/components/files/multi-file-input.component';
import {FileViewerComponent} from "../../../shared/components/files/file-viewer.component";

import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';


@Component({
  selector: 'app-chat-form',
  standalone: true,
  imports: [CommonModule,
   EntityPickerComponent,
    EntityToolbarActionComponent,
   ReactiveFormsModule,
   MultiFileInputComponent,
    FileViewerComponent,FileViewerComponent 
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
    files: File[] = [];

fileManagers  =   signal<FileManager[]>([]);
fileManagerService = inject(FileManagerService);
 hasFiles = true;

  readonly form = this.fb.group({
    id: [ ""  ],
    messages: [ "" , Validators.required ],
    responses: [ ""  ],
    responsesJson: [ ""  ],
    state: [ ""  ],
    account: [ ""  ],
    files: [null],
  });

  readonly fields: FieldDefinition[] = [
    { name: 'id',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'hidden',
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
      ...this.form.getRawValue()
    };

    this.isLoading.set(true);

    data.files = this.files?.length ? this.files : undefined;

    const request = this.isEdit()
      ? this.service.update(this.id!, data)
      : this.service.create(data);

    request.subscribe({
      next: async () => {
        this.isLoading.set(false);
        this.alert.show("Operation en cours...!", 'success');
        setTimeout(() => {
           this.fetchDeps();
            if(!this.isEdit()){
                this.form.reset();
                this.files = [];
          }
        }, 1000)

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
         if(this.id){
           this.fileManagerService.search("objectId",this.id).subscribe(
               data => this.fileManagers.set(data)
           );
         }
  }
    getEntities(name: string) {
        if (name === 'account') return this.accounts();
    return [];
    }
     onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.files = Array.from(input.files);
        } else {
          this.files = [];
        }
      }


}
