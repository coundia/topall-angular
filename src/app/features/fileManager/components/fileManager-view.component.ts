import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FileManagerService } from '../services/fileManager.service';
import { FileManager } from '../models/fileManager.model';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import { AlertService } from '../../../shared/components/alert/alert.service';
import {FileViewerComponent} from "../../../shared/components/files/file-viewer.component";


@Component({
  selector: 'app-fileManager-view',
  standalone: true,
	imports: [CommonModule, RouterLink, EntityToolbarActionComponent, FileViewerComponent],
  templateUrl: './fileManager-view.component.html',
})
export class FileManagerViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(FileManagerService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly item = signal<FileManager | null>(this.service.fileManagers().find(e => e.id === this.id) ?? null);
  readonly isLoading = signal(false);


  readonly fields: FieldDefinition[] = [
        { name: 'name',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'details',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'objectId',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'objectName',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'originalName',
        displayName: 'Nom', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'mimeType',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'size',
        displayName: '', type: 'number',
        entityType: 'Long',
        relation: ''
        },
        { name: 'path',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'uri',
        displayName: '', type: 'string',
        entityType: 'String',
        relation: ''
        },
        { name: 'isPublic',
        displayName: '', type: 'boolean',
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
            this.alert.show('FileManager introuvable', 'error');
            this.isLoading.set(false);
          }
        });
      }
    });
  }

   getFieldValue(item: FileManager, field: string): any {
    return (item as Record<string, any>)[field];
  }

  onDelete() {
    const id = this.item()?.id ?? this.id ?? null;
    if (!id) {
      this.alert.show(`FileManager "${this.id}" introuvable`, 'error');
      return;
    }
    const confirmed = window.confirm(`Supprimer "${id}" ?`);
    if (!confirmed) return;
    this.service.delete?.(id).subscribe?.({
      next: () => {
        this.alert.show(`FileManager "${id}" supprimé(e)`, 'success');
        setTimeout(() => {
          this.router.navigate(['/fileManager']);
        }, 600);
      },
      error: err => {
        this.alert.show(`Erreur suppression "FileManager ${id}"`, 'error');
      }
    });
  }


   getRelatedModel(item: any, fieldName: string) {
     return (item as any)[fieldName + 'Model'];
  }

}
