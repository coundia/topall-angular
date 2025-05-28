import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  @Output() send = new EventEmitter<{ message: string, files: File[] }>();
  @Output() record = new EventEmitter<string>();
  @Output() camera = new EventEmitter<File>();
  @Output() ocr = new EventEmitter<File>();

  message = '';
  files: File[] = [];
  isRecording = false;

  showCamera = false;
  stream: MediaStream | null = null;

  photoDataUrl: string | null = null;

  onSend() {
    if (!this.message.trim() && this.files.length === 0) return;
    this.send.emit({ message: this.message, files: this.files });
    this.message = '';
    this.files = [];
  }

  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.files = [...this.files, ...Array.from(input.files)];
      input.value = '';
    }
  }

  removeFile(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  toggleRecording() {
    if (this.isRecording) {
      this.isRecording = false;
    } else {
      this.isRecording = true;
      this.speechToText();
    }
  }

  async speechToText() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.message += (this.message ? ' ' : '') + transcript;
      };
      recognition.onend = () => {
        this.isRecording = false;
      };
      recognition.start();
    } else {
      alert('Speech recognition not supported on this browser');
      this.isRecording = false;
    }
  }

  // Nouvelle méthode : Ouvre le modal et démarre la webcam
  async onOpenCamera() {
    this.showCamera = true;
    this.photoDataUrl = null;
    setTimeout(async () => {
      const video: HTMLVideoElement | null = document.getElementById('webcam') as HTMLVideoElement;
      if (video) {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = this.stream;
          video.play();
        } catch {
          alert('Webcam non accessible');
          this.showCamera = false;
        }
      }
    }, 100);
  }


  // Capture l’image et l’envoie comme File
  onTakePhoto() {
    const video: HTMLVideoElement | null = document.getElementById('webcam') as HTMLVideoElement;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.photoDataUrl = canvas.toDataURL('image/png');
  }

  onValidatePhoto() {
    if (!this.photoDataUrl) return;
    fetch(this.photoDataUrl)
      .then(res => res.arrayBuffer())
      .then(buf => {
        const file = new File([buf], `photo-${Date.now()}.png`, { type: 'image/png' });
        this.camera.emit(file);
        this.files = [...this.files, file];
        this.closeCamera();
      });
  }


  async onRetakePhoto() {
    this.photoDataUrl = null;
    // Redémarre la webcam
    setTimeout(async () => {
      const video: HTMLVideoElement | null = document.getElementById('webcam') as HTMLVideoElement;
      if (video) {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = this.stream;
          video.play();
        } catch {
          alert('Webcam non accessible');
          this.showCamera = false;
        }
      }
    }, 100);
  }

  // Ferme le modal et stoppe le flux webcam
  closeCamera() {
    this.showCamera = false;
    this.photoDataUrl = null;
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  onOpenOCR() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files && input.files[0]) {
        this.ocr.emit(input.files[0]);
      }
    };
    input.click();
  }
}
