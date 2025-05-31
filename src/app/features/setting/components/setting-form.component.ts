import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { Setting } from '../models/setting.model';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import {toDatetimeLocalString} from '../../../shared/hooks/Parsing';
import {EntityPickerComponent} from '../../../shared/picker/app-entity-picker';



@Component({
  selector: 'app-setting-form',
  standalone: true,
  imports: [CommonModule,
   EntityPickerComponent,
    EntityToolbarActionComponent,
   ReactiveFormsModule,
 
    ],
  templateUrl: './setting-form.component.html',
})
export class SettingFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(SettingService);
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
    value: [ "" , Validators.required ],
    locale: [ "" , Validators.required ],
    details: [ "NA"  ],
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
      displayName: 'Clé',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'value',
      displayName: 'Valeur',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'locale',
      displayName: 'Langue',
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
      let existing = this.service.settings().find(e => e.id === this.id);
      if (existing) {
        this.form.patchValue({
                id: existing.id,
                name: existing.name,
                value: existing.value,
                locale: existing.locale,
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
                    value: e.value,
                    locale: e.locale,
                    details: e.details,
                    isActive: e.isActive,
              });
            }
            this.isLoading.set(false);
          },
          error: _ => {
            this.isLoading.set(false);
            this.alert.show('Setting introuvable', 'error');
          }
        });
      }
    }

    this.fetchDeps();

  }

  save() {
    if (this.form.invalid) return;

    const now = new Date().toISOString();

    const data: Partial<Setting> = {
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
        this.alert.show('An error occurred while saving the setting. Please try again.', 'error');
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
