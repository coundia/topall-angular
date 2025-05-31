import {Component, computed, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import { AccountUserService } from '../services/accountUser.service';
import { AccountUser } from '../models/accountUser.model';
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
import { Account } from '../../account/models/account.model';
import  { AccountService } from '../../account/services/account.service';


@Component({
  selector: 'app-accountUser-list',
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
  templateUrl: './accountUser-list.component.html',
})
export class AccountUserListComponent implements OnInit {
  readonly accountUserService = inject(AccountUserService);
  readonly alert = inject(AlertService);
  readonly sortService = inject(SortService);

  readonly list = this.accountUserService.accountUsers;
  readonly totalPages = this.accountUserService.totalPages;
  readonly isLoading = signal(false);
  readonly page = signal(0);
  readonly size = signal(10);
  files: File[] = [];

  hasFiles = false;

  searchField = 'name';
  searchTerm = '';

  @Output() searchFieldChange = new EventEmitter<string>();
  @Output() searchTermChange = new EventEmitter<string>();


    private readonly  accountService = inject(AccountService);
    account  =   signal<Account | null>(null);
    accounts  =   signal<Account[]>([]);

  readonly selectedItem = signal<AccountUser | null>(null);
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
    displayName: 'Message',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'String',
    relation: ''
    },
    { name: 'account' ,
    displayName: 'Compte',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'Account',
    relation: 'manyToOne'
    },
    { name: 'username' ,
    displayName: 'Partager avec (Nom identifiant)',
    type: 'string',
    defaultValue: '&quot;&quot;' ,
    inputType: 'String',
    entityType: 'String',
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
    displayName: 'Message',
    type: 'string' ,
    entityType: 'String' ,
    inputType: 'String',
    relation: ''
    },
    { name: 'username',
    displayName: 'Partager avec (Nom identifiant)',
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
    this.accountUserService.fetch(this.page(), this.size()).subscribe({
      next: () => this.isLoading.set(false),
      error: err => {
        this.alert.show('Erreur lors de la récupération des accountUsers.', 'error');
        this.isLoading.set(false);
      }
    });
  }

  deleteById(id: string): void {
    const item = this.list().find(e => e.id === id);
    if (!item) return;

    const confirmed = window.confirm(`Supprimer "${item.id}" ?`);
    if (!confirmed) return;

    this.accountUserService.delete(id).subscribe({
      next: () => {
        this.alert.show(`Suppression de "AccountUser" "${item.id}" en cours...`, 'success');
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

    this.fetchDeps(item);

    this.selectedItem.set(null);
     if (item.account) {
        this.accountService.getById(item.account).subscribe({
          next: account => {
             item.accountModel = account;
              this.selectedItem.set({
              ...item,
              accountModel: account
            });
          },
          error: err => {
            this.alert.show('Erreur lors de la récupération .', 'error');

          }
        });
    }


  }

  onSearch({ field, value }: { field: string; value: string }): void {
    this.searchField = field;
    this.searchTerm = value;
    if (!value) return this.refresh();
    this.isLoading.set(true);
    this.accountUserService.search(field, value).subscribe({
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

  getFieldValue(item: AccountUser, field: string): any {
    return (item as Record<string, any>)[field];
  }

  handleSave(data: any) {
    const now = new Date().toISOString();

    if (this.editMode && this.itemId) {


      this.accountUserService.update(this.itemId, data).subscribe({
        next: () => {
          this.alert.show('Mis(e) à jour "AccountUser" en cours.', 'success');
          this.closeDrawer();
          this.refresh();
        },
        error: () => {
          this.alert.show('Erreur lors de la mise à jour', 'error');
        }
      });
    } else {


      this.accountUserService.create(data).subscribe({
        next: () => {
          this.alert.show('Création "AccountUser" en cours.  ', 'success');
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
    const confirmed = window.confirm('Supprimer cet(te) accountUser ?');
    if (!confirmed) return;
    this.accountUserService.delete(id).subscribe({
      next: () => {
        this.alert.show('Suppression de "AccountUser" en cours... ', 'success');
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
      this.title = 'Nouveau accountUser';
      this.submitLabel = 'Sauvegarder';
      this.editMode = false;
      this.itemId = undefined;
      this.form = this.buildForm(this.allFields);
      this.addLink = '/accountUser/new';
    });
  }

  openDrawerForEdit(item: AccountUser) {
    this.drawerVisible = false;
    this.fetchDeps(item);
    setTimeout(() => {
      this.drawerVisible = true;
      this.formKey.update(k => k + 1);
      this.title = 'Modifier accountUser';
      this.submitLabel = 'Mettre à jour';
      this.editMode = true;
      this.itemId = item.id;
      this.form = this.buildForm(this.allFields, item);
      this.editLink = `/accountUser/${item.id}/edit`;
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

    fetchDeps(item?: AccountUser): void {

        this.accountService.fetch(0,1000).subscribe(data => this.accounts.set(data.content));

        this.getFileManager(item);
    }

    getEntities(name: string) {
        if (name === 'account') return this.accounts();
    return [];
    }

    getFileManager(item?: AccountUser): void {

      }

}
