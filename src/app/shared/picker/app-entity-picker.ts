import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

type Entity = Record<string, string | number>;

@Component({
  selector: 'app-entity-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app-entity-picker.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntityPickerComponent),
      multi: true,
    },
  ],
})
export class EntityPickerComponent implements ControlValueAccessor, OnInit {
  @Input() entities: any[] = [];
  @Input() label = '';
  @Input() placeholder = 'Sélectionner...';
  @Input() idKey = 'id';
  @Input() nameKey = 'name';
  @Input() loadData?: () => Observable<Entity[]>;

  value = '';
  disabled = false;
  onChange = (value: string) => {};
  onTouched = () => {};

  ngOnInit() {
    if (this.loadData) {
      this.loadData().subscribe((data: any) => {
        this.entities = Array.isArray(data) ? data : data.content ?? [];
      });
    }
  }

  writeValue(value: string | number): void {
    this.value = value != null ? value.toString() : '';
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
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
