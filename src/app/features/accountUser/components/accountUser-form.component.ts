import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AccountUserService } from '../services/accountUser.service';
import { AccountUser } from '../models/accountUser.model';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import {toDatetimeLocalString} from '../../../shared/hooks/Parsing';
import {EntityPickerComponent} from '../../../shared/picker/app-entity-picker';

import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';


@Component({
  selector: 'app-accountUser-form',
  standalone: true,
  imports: [CommonModule,
   ReactiveFormsModule,
    EntityPickerComponent,
    EntityToolbarActionComponent
    ],
  templateUrl: './accountUser-form.component.html',
})
export class AccountUserFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(AccountUserService);
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
    name: [ "" , Validators.required ],
    account: [ ""  ],
    username: [ "" , Validators.required ],
    details: [ ""  ],
    isActive: [ true , Validators.required ],
  });

  readonly fields: FieldDefinition[] = [
    { name: 'id',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'name',
      displayName: 'Message',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'account',
      displayName: 'Compte',
      type: 'string',
      entityType: 'Account' ,
      inputType: 'String',
      relation: 'manyToOne'
      },
    { name: 'username',
      displayName: 'Partager avec (Nom identifiant)',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'details',
      displayName: 'Description',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'isActive',
      displayName: '',
      type: 'boolean',
      entityType: 'Boolean' ,
      inputType: 'Boolean',
      relation: ''
      },
  ];

  ngOnInit() {
    if (this.isEdit()) {
      let existing = this.service.accountUsers().find(e => e.id === this.id);
      if (existing) {
        this.form.patchValue({
                id: existing.id,
                name: existing.name,
                account: existing.account,
                username: existing.username,
                details: existing.details,
                isActive: existing.isActive,
        });
      } else {
        this.isLoading.set(true);
        this.service.getById?.(this.id!).subscribe?.({
          next: e => {
            if (e) {
              this.form.patchValue({
                    id: e.id,
                    name: e.name,
                    account: e.account,
                    username: e.username,
                    details: e.details,
                    isActive: e.isActive,
              });
            }
            this.isLoading.set(false);
          },
          error: _ => {
            this.isLoading.set(false);
            this.alert.show('AccountUser introuvable', 'error');
          }
        });
      }
    }

    this.fetchDeps();

  }

  save() {
    if (this.form.invalid) return;

    const now = new Date().toISOString();

    const data: Partial<AccountUser> = {
      ...this.form.getRawValue()
    };

    this.isLoading.set(true);


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
        await this.router.navigate(['/accountUser']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.alert.show('An error occurred while saving the accountUser. Please try again.', 'error');
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
