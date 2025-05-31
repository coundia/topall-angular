import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import {toDatetimeLocalString} from '../../../shared/hooks/Parsing';
import {EntityPickerComponent} from '../../../shared/picker/app-entity-picker';



@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule,
   EntityPickerComponent,
    EntityToolbarActionComponent,
   ReactiveFormsModule,
 
    ],
  templateUrl: './account-form.component.html',
})
export class AccountFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(AccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly isEdit = signal(!!this.id);
  readonly isLoading = signal(false);


 hasFiles = false;

  readonly form = this.fb.group({
    id: [ ""  ],
    name: [ "" , Validators.required ],
    details: [ ""  ],
    currency: [ "XOF" , Validators.required ],
    currentBalance: [ 0.0 , Validators.required ],
    previousBalance: [ 0.0 , Validators.required ],
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
      displayName: 'Nom',
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
    { name: 'currency',
      displayName: 'Devise',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'currentBalance',
      displayName: 'Solde de départ',
      type: 'number',
      entityType: 'Double' ,
      inputType: 'Double',
      relation: ''
      },
    { name: 'previousBalance',
      displayName: '',
      type: 'number',
      entityType: 'Double' ,
      inputType: 'Double',
      relation: ''
      },
    { name: 'isActive',
      displayName: 'Est active',
      type: 'boolean',
      entityType: 'Boolean' ,
      inputType: 'Boolean',
      relation: ''
      },
  ];

  ngOnInit() {
    if (this.isEdit()) {
      let existing = this.service.accounts().find(e => e.id === this.id);
      if (existing) {
        this.form.patchValue({
                id: existing.id,
                name: existing.name,
                details: existing.details,
                currency: existing.currency,
                currentBalance: existing.currentBalance,
                previousBalance: existing.previousBalance,
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
                    details: e.details,
                    currency: e.currency,
                    currentBalance: e.currentBalance,
                    previousBalance: e.previousBalance,
                    isActive: e.isActive,
              });
            }
            this.isLoading.set(false);
          },
          error: _ => {
            this.isLoading.set(false);
            this.alert.show('Account introuvable', 'error');
          }
        });
      }
    }

    this.fetchDeps();

  }

  save() {
    if (this.form.invalid) return;

    const now = new Date().toISOString();

    const data: Partial<Account> = {
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
           this.fetchDeps();
            if(!this.isEdit()){
                this.form.reset();
          }
        }, 1000)

      },
      error: (err) => {
        this.isLoading.set(false);
        this.alert.show('An error occurred while saving the account. Please try again.', 'error');
      }
    });
  }

   onDelete() {
        //todo
      }
  fetchDeps() {
  }
    getEntities(name: string) {
    return [];
    }


}
