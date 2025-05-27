import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountUserService } from '../services/accountUser.service';
import { AccountUser } from '../models/accountUser.model';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import { AlertService } from '../../../shared/components/alert/alert.service';

import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';

@Component({
  selector: 'app-accountUser-view',
  standalone: true,
  imports: [CommonModule, EntityToolbarActionComponent],
  templateUrl: './accountUser-view.component.html',
})
export class AccountUserViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AccountUserService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly item = signal<AccountUser | null>(this.service.accountUsers().find(e => e.id === this.id) ?? null);
  readonly isLoading = signal(false);

private readonly  accountService = inject(AccountService);
  account  =   signal<Account | null>(null);

  readonly fields: FieldDefinition[] = [
    { name: 'id',
     displayName: '', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'name',
     displayName: 'Message', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'account',
     displayName: 'Compte', type: 'string',
    entityType: 'Account',
    relation: ''
     },
    { name: 'username',
     displayName: 'Partager avec (Nom identifiant)', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'details',
     displayName: 'Description', type: 'string',
    entityType: 'String',
    relation: ''
     },
    { name: 'isActive',
     displayName: '', type: 'boolean',
    entityType: 'Boolean',
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
            this.alert.show('AccountUser introuvable', 'error');
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

   getFieldValue(item: AccountUser, field: string): any {
    return (item as Record<string, any>)[field];
  }

  onDelete() {
    const id = this.item()?.id ?? this.id ?? null;
    if (!id) {
      this.alert.show(`AccountUser "${this.id}" introuvable`, 'error');
      return;
    }
    const confirmed = window.confirm(`Supprimer "${id}" ?`);
    if (!confirmed) return;
    this.service.delete?.(id).subscribe?.({
      next: () => {
        this.alert.show(`AccountUser "${id}" supprimé(e)`, 'success');
        setTimeout(() => {
          this.router.navigate(['/accountUser']);
        }, 600);
      },
      error: err => {
        this.alert.show(`Erreur suppression "AccountUser ${id}"`, 'error');
      }
    });
  }


}
