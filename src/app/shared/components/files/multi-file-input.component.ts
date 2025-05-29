import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-file-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-file-input.component.html',
})
export class MultiFileInputComponent {
  @Output() filesChange = new EventEmitter<File[]>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private readonly _files = signal<File[]>([]);
  readonly dragActive = signal(false);

  @Input()
  set files(value: File[]) {
    if (value && value !== this._files()) {
      this._files.set(value ?? []);
    }
  }
  get files(): File[] {
    return this._files();
  }

  triggerInput(event?: Event) {
    if (event && (event.target as HTMLElement).closest('.btn-remove')) return;
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files).filter(f =>
        !this._files().some(existing => existing.name === f.name && existing.size === f.size)
      );
      this._files.set([...this._files(), ...newFiles]);
      this.filesChange.emit(this._files());
    }
    input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragActive.set(false);
    if (event.dataTransfer?.files?.length) {
      const droppedFiles = Array.from(event.dataTransfer.files).filter(f =>
        !this._files().some(existing => existing.name === f.name && existing.size === f.size)
      );
      this._files.set([...this._files(), ...droppedFiles]);
      this.filesChange.emit(this._files());
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive.set(false);
  }

  removeFile(file: File, event: Event) {
    event.stopPropagation();
    this._files.set(this._files().filter(f => f !== file));
    this.filesChange.emit(this._files());
  }

  trackByName(_: number, file: File) {
    return file.name + file.size;
  }
}
