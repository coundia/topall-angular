import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { FileManagerService } from '../services/fileManager.service';
import { FileManager } from '../models/fileManager.model';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import {toDatetimeLocalString} from '../../../shared/hooks/Parsing';
import {EntityPickerComponent} from '../../../shared/picker/app-entity-picker';



@Component({
  selector: 'app-fileManager-form',
  standalone: true,
  imports: [CommonModule,
   EntityPickerComponent,
    EntityToolbarActionComponent,
   ReactiveFormsModule,

    ],
  templateUrl: './fileManager-form.component.html',
})
export class FileManagerFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(FileManagerService);
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
    objectId: [ ""  ],
    objectName: [ ""  ],
    originalName: [ ""  ],
    mimeType: [ ""  ],
    size: [ 0  ],
    path: [ ""  ],
    uri: [ ""  ],
    isPublic: [ false  ],
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
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'details',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'objectId',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'objectName',
      displayName: 'Module',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'originalName',
      displayName: 'Nom',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'mimeType',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'size',
      displayName: '',
      type: 'number',
      entityType: 'Long' ,
      inputType: 'Long',
      relation: ''
      },
    { name: 'path',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'uri',
      displayName: '',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'isPublic',
      displayName: '',
      type: 'boolean',
      entityType: 'Boolean' ,
      inputType: 'Boolean',
      relation: ''
      },
  ];

  ngOnInit() {
    if (this.isEdit()) {
      let existing = this.service.fileManagers().find(e => e.id === this.id);
      if (existing) {
        this.form.patchValue({
                id: existing.id,
                name: existing.name,
                details: existing.details,
                objectId: existing.objectId,
                objectName: existing.objectName,
                originalName: existing.originalName,
                mimeType: existing.mimeType,
                size: existing.size,
                path: existing.path,
                uri: existing.uri,
                isPublic: existing.isPublic,
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
                    objectId: e.objectId,
                    objectName: e.objectName,
                    originalName: e.originalName,
                    mimeType: e.mimeType,
                    size: e.size,
                    path: e.path,
                    uri: e.uri,
                    isPublic: e.isPublic,
              });
            }
            this.isLoading.set(false);
          },
          error: _ => {
            this.isLoading.set(false);
            this.alert.show('FileManager introuvable', 'error');
          }
        });
      }
    }

    this.fetchDeps();

  }

  save() {
    if (this.form.invalid) return;

    const now = new Date().toISOString();

    const data: Partial<FileManager> = {
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
        this.alert.show('An error occurred while saving the fileManager. Please try again.', 'error');
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
