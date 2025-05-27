import { Component, Input, forwardRef } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entity-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app-entity-picker.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntityPickerComponent),
      multi: true
    }
  ]
})
export class EntityPickerComponent implements ControlValueAccessor {
  @Input() entities: any[] = [];
  @Input() label = '';
  @Input() placeholder = 'Sélectionner...';
  @Input() idKey = 'id';
  @Input() nameKey = 'name';

  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  onValueChange(val: string) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {}
}
