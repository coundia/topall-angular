import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldDefinition } from '../models/field-definition';
import {EntityPickerComponent} from '../../picker/app-entity-picker';
import {RouterLink} from '@angular/router';
import {MultiFileInputComponent} from '../files/multi-file-input.component';
import {FileViewerComponent} from '../files/file-viewer.component';

@Component({
  selector: 'app-global-drawer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EntityPickerComponent, RouterLink, MultiFileInputComponent, FileViewerComponent],
  templateUrl: './app-global-drawer-form.html',
})
export class GlobalDrawerFormComponent {
  @Input() form!: FormGroup;
  @Input() title!: string;
  @Input() fields!: FieldDefinition[];
  @Input() submitLabel = 'Enregistrer';
  @Input() addLink?: string = '/';
  @Input() editLink?: string = '/';
  @Input() viewLink?: string = '/';
  @Input() editMode = false;
  @Input() itemId?: string;
  @Input() key = 0;
  @Input() getEntities!: (name: string) => any[];

  @Input() files: File[] = [];
  @Output() filesChange = new EventEmitter<File[]>();

  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  @Input() hasFiles = false;

  readonly visible = signal(true);
  readonly isVisible = computed(() => this.visible());


  @Input() fileManagers!: any[];
  @Input() isFileManager = false;

  close(): void {
    this.visible.set(false);
    this.closed.emit();
  }

  submit(): void {
    if (this.form.valid) {
      this.save.emit({
        ...this.form.getRawValue(),
        files: this.files
      });
    } else {
      this.form.markAllAsTouched();
    }
  }


  trackByKey(index: number, field: FieldDefinition): string {
    return field.name;
  }

}
