import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../models/transaction.model';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import { AlertService } from '../../../shared/components/alert/alert.service';

import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';
import { Category } from '../../category/models/category.model';
import  { CategoryService } from '../../category/services/category.service';


@Component({
  selector: 'app-transaction-view',
  standalone: true,
  imports: [CommonModule, RouterLink, EntityToolbarActionComponent,

],
  templateUrl: './transaction-view.component.html',
})
export class TransactionViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TransactionService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly item = signal<Transaction | null>(this.service.transactions().find(e => e.id === this.id) ?? null);
  readonly isLoading = signal(false);
    hasFiles = false;

    private readonly  accountService = inject(AccountService);
    account  =   signal<Account | null>(null);
    private readonly  categoryService = inject(CategoryService);
    category  =   signal<Category | null>(null);


  readonly fields: FieldDefinition[] = [
        { name: 'amount',
        displayName: 'Montant', type: 'number',
        entityType: 'Double',
        relation: ''
        },
        { name: 'name',
        displayName: 'Motif', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'details',
        displayName: 'Description', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'isActive',
        displayName: 'Activé', type: 'boolean',
        entityType: 'Boolean',
        relation: ''
        },
        { name: 'account',
        displayName: 'Compte', type: 'string',
        entityType: 'Account',
        relation: 'manyToOne'
        },
        { name: 'category',
        displayName: 'Category', type: 'string',
        entityType: 'Category',
        relation: 'manyToOne'
        },
        { name: 'typeTransactionRaw',
        displayName: 'Type', type: 'string',
        entityType: 'enum',
        relation: ''
        },
        { name: 'dateTransaction',
        displayName: 'Date transaction', type: 'string',
        entityType: 'Date',
        relation: ''
        },
  ];

  constructor() {
    effect(() => {
    this.fetchDeps();
      if (!this.item()) {
        this.isLoading.set(true);
        this.service.getById?.(this.id!).subscribe?.({
          next: e => {
            this.item.set(e);
            this.isLoading.set(false);
          },
          error: _ => {
            this.alert.show('Transaction introuvable', 'error');
            this.isLoading.set(false);
          }
        });
      }
        if (this.item() && !this.item()!.accountModel) {
            this.accountService.getById(this.item()!.account!).subscribe({
              next: account => {
                this.account.set(account);

                this.item.set({
                  ...this.item()!,
                  accountModel: account
                })

              },
              error: _ => {
                this.alert.show('Erreur lors de la récupération account', 'error');
              }
            });
          }
        if (this.item() && !this.item()!.categoryModel) {
            this.categoryService.getById(this.item()!.category!).subscribe({
              next: category => {
                this.category.set(category);

                this.item.set({
                  ...this.item()!,
                  categoryModel: category
                })

              },
              error: _ => {
                this.alert.show('Erreur lors de la récupération category', 'error');
              }
            });
          }
    });
  }

   getFieldValue(item: Transaction, field: string): any {
    return (item as Record<string, any>)[field];
  }

  onDelete() {
    const id = this.item()?.id ?? this.id ?? null;
    if (!id) {
      this.alert.show(`Transaction "${this.id}" introuvable`, 'error');
      return;
    }
    const confirmed = window.confirm(`Supprimer "${id}" ?`);
    if (!confirmed) return;
    this.service.delete?.(id).subscribe?.({
      next: () => {
        this.alert.show(`suppression de Transaction "${id}" en cours... `, 'success');
        setTimeout(() => {
          this.router.navigate(['/transaction']);
        }, 600);
      },
      error: err => {
        this.alert.show(`Erreur suppression "Transaction ${id}"`, 'error');
      }
    });
  }


   getRelatedModel(item: any, fieldName: string) {
     return (item as any)[fieldName + 'Model'];
  }

   fetchDeps() {
    }

}
