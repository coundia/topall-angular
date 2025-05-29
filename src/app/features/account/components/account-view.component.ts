import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import { AlertService } from '../../../shared/components/alert/alert.service';


@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [CommonModule, RouterLink, EntityToolbarActionComponent],
  templateUrl: './account-view.component.html',
})
export class AccountViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AccountService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly item = signal<Account | null>(this.service.accounts().find(e => e.id === this.id) ?? null);
  readonly isLoading = signal(false);


  readonly fields: FieldDefinition[] = [
        { name: 'name',
        displayName: 'Nom', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'details',
        displayName: 'Description', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'currency',
        displayName: 'Devise', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'currentBalance',
        displayName: 'Solde de départ', type: 'number',
        entityType: 'Double',
        relation: ''
        },
        { name: 'previousBalance',
        displayName: '', type: 'number',
        entityType: 'Double',
        relation: ''
        },
        { name: 'isActive',
        displayName: 'Est active', type: 'boolean',
        entityType: 'Boolean',
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
            this.alert.show('Account introuvable', 'error');
            this.isLoading.set(false);
          }
        });
      }
    });
  }

   getFieldValue(item: Account, field: string): any {
    return (item as Record<string, any>)[field];
  }

  onDelete() {
    const id = this.item()?.id ?? this.id ?? null;
    if (!id) {
      this.alert.show(`Account "${this.id}" introuvable`, 'error');
      return;
    }
    const confirmed = window.confirm(`Supprimer "${id}" ?`);
    if (!confirmed) return;
    this.service.delete?.(id).subscribe?.({
      next: () => {
        this.alert.show(`Account "${id}" supprimé(e)`, 'success');
        setTimeout(() => {
          this.router.navigate(['/account']);
        }, 600);
      },
      error: err => {
        this.alert.show(`Erreur suppression "Account ${id}"`, 'error');
      }
    });
  }


   getRelatedModel(item: any, fieldName: string) {
     return (item as any)[fieldName + 'Model'];
  }

}
