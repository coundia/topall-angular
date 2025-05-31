import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {AlertService} from '../alert/alert.service';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-viewer.component.html'
})
export class FileViewerComponent implements OnInit {
  @Input({ required: true }) file!: {
    uri?: string;
    originalName?: string;
    size?: number;
    mimeType?: string;
    id?: string;
  };
  @Input() jwt = '';
  @Input() onDelete: (() => void) | undefined;

  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  readonly blobUrl = signal<SafeResourceUrl | null>(null);

  private readonly alert = inject(AlertService);

  ngOnInit() {
    if (this.file) this.fetchFile();
  }

  fetchFile() {
    if (!this.file.uri) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.jwt}` });
    this.http.get(this.file.uri, { headers, responseType: 'blob' }).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.blobUrl.set(safeUrl);
    });
  }

  fileUrl() {
    return this.blobUrl();
  }

  isImageFile(f: unknown) {
    const mime = (f as { mimeType?: string })?.mimeType ?? '';
    return mime.startsWith('image');
  }
  getFilePreviewUrl() {
    return this.fileUrl();
  }
  getFileSize(size?: number): string {
    if (!size) return '0 o';
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} Ko`;
    return `${(size / (1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 2 })} Mo`;
  }

  downloadFile() {
    if (!this.file.uri) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.jwt}` });
    this.http.get(this.file.uri, { headers, responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = this.file.originalName || 'file';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    });
  }

  confirmDelete() {
    if (!this.file.id) return;
    if (!window.confirm('Confirmer la suppression ?')) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.jwt}` });
    this.http.delete(`http://127.0.0.1:8095/api/v1/commands/fileManager/${this.file.id}`, { headers }).subscribe(() => {
      if (this.onDelete) this.onDelete();
      this.alert.show("Suppression en cours ...", "success");
    });
  }

  getFileExtension(originalName: string | undefined) {

  if (originalName) {
      const parts = originalName.split('.');
      return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
    }
    return "";
  }

  shareFile() {

  }
}
