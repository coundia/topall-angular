import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SettingService } from '../services/setting.service';
import { Setting } from '../models/setting.model';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import { AlertService } from '../../../shared/components/alert/alert.service';



@Component({
  selector: 'app-setting-view',
  standalone: true,
  imports: [CommonModule, RouterLink, EntityToolbarActionComponent,

],
  templateUrl: './setting-view.component.html',
})
export class SettingViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(SettingService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly item = signal<Setting | null>(this.service.settings().find(e => e.id === this.id) ?? null);
  readonly isLoading = signal(false);
    hasFiles = false;



  readonly fields: FieldDefinition[] = [
        { name: 'name',
        displayName: 'Clé', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'value',
        displayName: 'Valeur', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'locale',
        displayName: 'Langue', type: 'string',
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
            this.alert.show('Setting introuvable', 'error');
            this.isLoading.set(false);
          }
        });
      }
    });
  }

   getFieldValue(item: Setting, field: string): any {
    return (item as Record<string, any>)[field];
  }

  onDelete() {
    const id = this.item()?.id ?? this.id ?? null;
    if (!id) {
      this.alert.show(`Setting "${this.id}" introuvable`, 'error');
      return;
    }
    const confirmed = window.confirm(`Supprimer "${id}" ?`);
    if (!confirmed) return;
    this.service.delete?.(id).subscribe?.({
      next: () => {
        this.alert.show(`suppression de Setting "${id}" en cours... `, 'success');
        setTimeout(() => {
          this.router.navigate(['/setting']);
        }, 600);
      },
      error: err => {
        this.alert.show(`Erreur suppression "Setting ${id}"`, 'error');
      }
    });
  }


   getRelatedModel(item: any, fieldName: string) {
     return (item as any)[fieldName + 'Model'];
  }

   fetchDeps() {
    }

}
