import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { signal } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.css'
})
export class FileViewerComponent implements OnInit {
  @Input({ required: true }) file!: {
    uri?: string;
    originalName?: string;
    size?: number;
    mimeType?: string;
  };
  @Input() jwt = '';

  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  readonly blobUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    if (this.file) {
      this.fetchFile();
    }
  }

  fetchFile() {
    if(!this.file.uri) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.jwt}` });
    this.http.get(this.file.uri!, { headers, responseType: 'blob' }).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.blobUrl.set(safeUrl);
    });
  }

  fileUrl() {
    return this.blobUrl();
  }

  isImage() {
    return this.file?.mimeType?.startsWith('image');
  }
  isPdf() {
    return this.file?.mimeType === 'application/pdf';
  }

  downloadFile() {
    if(!this.file.uri) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.jwt}` });
    this.http.get(this.file.uri!, { headers, responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = this.file.originalName || 'file';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  }


  isImageFile(file: any) {
    return (file.mimeType ?? file.type ?? '').startsWith('image');
  }

  getFilePreviewUrl() {
     return this.fileUrl();
  }

  getFileSize(size: any): string {
    if (!size || isNaN(size)) return '0 o';
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) {
      return `${(size / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} Ko`;
    }
    return `${(size / (1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 2 })} Mo`;
  }


}
