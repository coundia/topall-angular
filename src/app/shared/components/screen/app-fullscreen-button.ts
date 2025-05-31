import { Component, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-fullscreen-button',
  templateUrl: './app-fullscreen-button.html'
})
export class FullscreenButtonComponent {
  @Output() toggle = new EventEmitter<void>()
}
