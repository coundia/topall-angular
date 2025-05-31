import {Component, Input, Output, EventEmitter, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FieldDefinition} from '../models/field-definition';
import {FileViewerComponent} from '../files/file-viewer.component';

@Component({
  selector: 'app-global-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, FileViewerComponent],
  templateUrl: './global-drawer.component.html',
})
export class GlobalDrawerComponent {
  @Input({required: true}) item!: Record<string, any>;
  @Input({required: true}) title!: string;
  @Input({required: true}) fields!: FieldDefinition[];
  @Input() addLink?: string = '/';
  @Input() editLink?: string = '/';
  @Input() viewLink?: string = '/';
  @Output() remove = new EventEmitter<string>();

  visible = signal(true);
  @Input() hasFiles = false;
  @Input() fileManagers!: any[];
  @Input() isFileManager = true;

  close() {
    this.visible.set(false);
  }

  onDelete() {
    this.remove.emit(this.item['id']);
  }

  trackByKey(index: number, field: FieldDefinition) {
    return field.name;
  }
}
