import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { FieldDefinition } from '../../../shared/components/models/field-definition';
import { EntityToolbarActionComponent } from '../../../shared/components/view-toolbar-actions/view-toolbar-actions';
import {toDatetimeLocalString} from '../../../shared/hooks/Parsing';
import {EntityPickerComponent} from '../../../shared/picker/app-entity-picker';



@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule,
   EntityPickerComponent,
    EntityToolbarActionComponent,
   ReactiveFormsModule,
 
    ],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(CategoryService);
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
    typeCategoryRaw: [ "" , Validators.required ],
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
      displayName: 'Nom',
      type: 'string',
      entityType: 'String' ,
      inputType: 'String',
      relation: ''
      },
    { name: 'typeCategoryRaw',
      displayName: '',
      type: 'string',
      entityType: 'enum' ,
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
      let existing = this.service.categorys().find(e => e.id === this.id);
      if (existing) {
        this.form.patchValue({
                id: existing.id,
                name: existing.name,
                typeCategoryRaw: existing.typeCategoryRaw,
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
                    typeCategoryRaw: e.typeCategoryRaw,
                    details: e.details,
                    isActive: e.isActive,
              });
            }
            this.isLoading.set(false);
          },
          error: _ => {
            this.isLoading.set(false);
            this.alert.show('Category introuvable', 'error');
          }
        });
      }
    }

    this.fetchDeps();

  }

  save() {
    if (this.form.invalid) return;

    const now = new Date().toISOString();

    const data: Partial<Category> = {
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
        this.alert.show('An error occurred while saving the category. Please try again.', 'error');
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
