import {Component, computed, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import {NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { EntityActionsComponent } from '../../../shared/components/actions/entity-actions.component';
import { SearchBoxComponent } from '../../../shared/components/search/search-box.component';
import { EntityToolbarComponent } from '../../../shared/components/toolbar/entity-toolbar.component';
import { EmptyStateComponent } from '../../../shared/components/empty/empty-state.component';
import { PaginationControlsComponent } from '../../../shared/components/pagination/pagination-controls.component';
import { PaginationJoinComponent } from '../../../shared/components/pagination/pagination-join.component';
import { GlobalDrawerComponent } from '../../../shared/components/drawer/global-drawer.component';
import {FieldDefinition, isValidUUID} from '../../../shared/components/models/field-definition';
import {GlobalDrawerFormComponent} from '../../../shared/components/drawer/app-global-drawer-form';
import {SortHeaderComponent} from '../../../shared/components/tri/sort-header.component';
import {SortService} from '../../../shared/components/tri/sort.service';
import {SHARED_IMPORTS} from '../../../shared/constantes/shared-imports';
import {getDefaultValue, toDatetimeLocalString} from '../../../shared/hooks/Parsing';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    FormsModule,
    SpinnerComponent,
    EntityActionsComponent,
    SearchBoxComponent,
    EntityToolbarComponent,
    EmptyStateComponent,
    PaginationControlsComponent,
    PaginationJoinComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    GlobalDrawerFormComponent,
    GlobalDrawerComponent,
    NgIf,
    SortHeaderComponent
  ],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  readonly service = inject(CategoryService);
  readonly alert = inject(AlertService);
  readonly sortService = inject(SortService);

  readonly list = this.service.categorys;
  readonly totalPages = this.service.totalPages;
  readonly isLoading = signal(false);
  readonly page = signal(0);
  readonly size = signal(10);
  files: File[] = [];

  searchField = 'name';
  searchTerm = '';

  @Output() searchFieldChange = new EventEmitter<string>();
  @Output() searchTermChange = new EventEmitter<string>();


  readonly selectedItem = signal<Category | null>(null);
  readonly allFields: FieldDefinition[] = [
    { name: 'id' ,
    displayName: '',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'String',
    relation: ''
    },
    { name: 'name' ,
    displayName: 'Nom',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'String',
    relation: ''
    },
    { name: 'typeCategoryRaw' ,
    displayName: '',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'enum',
    relation: ''
    },
    { name: 'details' ,
    displayName: 'Description',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'String',
    relation: ''
    },
    { name: 'isActive' ,
    displayName: '',
    type: 'boolean',
    defaultValue: 'true' ,
    inputType: 'Boolean',
    entityType: 'Boolean',
    relation: ''
    },
  ];

  readonly fieldsToDisplay: FieldDefinition[] = [
    { name: 'name',
    displayName: 'Nom',
    type: 'string' ,
    entityType: 'String' ,
    inputType: 'String',
    relation: ''
    },
    { name: 'details',
    displayName: 'Description',
    type: 'string' ,
    entityType: 'String' ,
    inputType: 'String',
    relation: ''
    },
  ];

  drawerVisible = false;
  title = '';
  submitLabel = '';
  editMode = false;
  itemId?: string;

  readonly fb = inject(FormBuilder);
  form!: FormGroup;
  formKey = signal(0);
  addLink?: string;
  editLink?: string;

  buildForm(fields: FieldDefinition[], data: Record<string, any> = {}): FormGroup {
    const group: Record<string, any> = {};
    for (const field of fields) {
      const defaultValue = data[field.name] ?? getDefaultValue(field) ?? null;
      const isRequired = field.nullable === false;

      if (field.entityType === 'Date' || field.type === 'date') {
        group[field.name] = [toDatetimeLocalString(defaultValue), isRequired ? Validators.required : []];
        continue;
      }

      group[field.name] = [defaultValue, isRequired ? Validators.required : []];
    }
    return this.fb.group(group);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.isLoading.set(true);
    this.service.fetch(this.page(), this.size()).subscribe({
      next: () => this.isLoading.set(false),
      error: err => {
        this.alert.show('Erreur lors de la récupération des categorys.', 'error');
        this.isLoading.set(false);
      }
    });
  }

  deleteById(id: string): void {
    const item = this.list().find(e => e.id === id);
    if (!item) return;

    const confirmed = window.confirm(`Supprimer "${item.id}" ?`);
    if (!confirmed) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.alert.show(`Category "${item.id}" supprimé(e)`, 'success');
        setTimeout(() => this.refresh(), 1500);
      },
      error: err => {
        this.alert.show(`Erreur suppression "${item.id}"`, 'error');
      }
    });
  }

  showDetails(id: string): void {
    const item = this.list().find(e => e.id === id);
    if (!item) return;
    this.selectedItem.set(null);

     setTimeout(() => this.selectedItem.set(item), 0);

  }

  onSearch({ field, value }: { field: string; value: string }): void {
    this.searchField = field;
    this.searchTerm = value;
    if (!value) return this.refresh();
    this.isLoading.set(true);
    this.service.search(field, value).subscribe({
      next: items => {
        this.list.set(items);
        this.isLoading.set(false);
      },
      error: err => {
        this.alert.show('Erreur lors de la recherche.', 'error');
        this.isLoading.set(false);
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.refresh();
  }

  next(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update(p => p + 1);
      this.refresh();
    }
  }

  prev(): void {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.refresh();
    }
  }

  getFieldValue(item: Category, field: string): any {
    return (item as Record<string, any>)[field];
  }

  handleSave(data: any) {
    const now = new Date().toISOString();

    if (this.editMode && this.itemId) {


      this.service.update(this.itemId, data).subscribe({
        next: () => {
          this.alert.show('Mis(e) à jour "Category" en cours.', 'success');
          this.closeDrawer();
          this.refresh();
        },
        error: () => {
          this.alert.show('Erreur lors de la mise à jour', 'error');
        }
      });
    } else {


      this.service.create(data).subscribe({
        next: () => {
          this.alert.show('Création "Category" en cours.  ', 'success');
          this.closeDrawer();
          this.refresh();
        },
        error: () => {
          this.alert.show('Erreur lors de la création', 'error');
        }
      });
    }
  }

  handleDelete(id: string) {
    const confirmed = window.confirm('Supprimer cet(te) category ?');
    if (!confirmed) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.alert.show('Category supprimé(e)', 'success');
        this.closeDrawer();
        this.refresh();
      },
      error: () => {
        this.alert.show('Erreur lors de la suppression', 'error');
      }
    });
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.form.reset();
    this.itemId = undefined;
  }

  openDrawerForCreate() {
    this.drawerVisible = false;
    this.fetchDeps();
    setTimeout(() => {
      this.drawerVisible = true;
      this.formKey.update(k => k + 1);
      this.title = 'Nouveau category';
      this.submitLabel = 'Sauvegarder';
      this.editMode = false;
      this.itemId = undefined;
      this.form = this.buildForm(this.allFields);
      this.addLink = '/category/new';
    });
  }

  openDrawerForEdit(item: Category) {
    this.drawerVisible = false;
    this.fetchDeps();
    setTimeout(() => {
      this.drawerVisible = true;
      this.formKey.update(k => k + 1);
      this.title = 'Modifier category';
      this.submitLabel = 'Mettre à jour';
      this.editMode = true;
      this.itemId = item.id;
      this.form = this.buildForm(this.allFields, item);
      this.editLink = `/category/${item.id}/edit`;
    });
  }

  private normalizeForCompare(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? '1' : '0';
    return String(value).toLowerCase();
  }

  readonly sortedList = computed(() => {
    const { active, direction } = this.sortService.state();
    const data = this.list();
    if (!active || !direction) return data;
    return [...data].sort((a, b) => {
      const aValue = this.normalizeForCompare(this.getFieldValue(a, active));
      const bValue = this.normalizeForCompare(this.getFieldValue(b, active));
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  });

  selectedFieldType(): string {
    return this.fieldsToDisplay.find(f => f.name === this.searchField)?.type ?? 'text';
  }


    fetchDeps() {
        }


    getEntities(name: string) {
    return [];
    }

}
