
import {Component, Input, OnChanges, signal, inject, TemplateRef} from '@angular/core';
import { Observable } from 'rxjs';
import {DatePipe, JsonPipe, NgIf, NgTemplateOutlet} from '@angular/common';

export interface SearchByDateService<T> {
  search(field: string, value: string): Observable<T[]>;
}


@Component({
  selector: 'app-entity-list-by-date',
  standalone: true,
  templateUrl: './entity-list-by-date.component.html',
  imports: [
    DatePipe,
    JsonPipe,
    NgTemplateOutlet
  ]
})
export class EntityListByDateComponent<T> implements OnChanges {
  @Input() date: string | null = null;
  @Input() searchField: string = 'date';
  @Input() service!: { search(field: string, value: string): Observable<T[]> };
  @Input() renderItem!: (item: T) => string | any; // custom render function if needed

  readonly items = signal<T[]>([]);
  readonly loading = signal(false);
  @Input() itemTemplate?: TemplateRef<any>;

  ngOnChanges() {
    if (this.date && this.service) {
      this.loading.set(true);
      this.service.search(this.searchField, this.date).subscribe({
        next: items => {
          this.items.set(items ?? []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.items.set([]);
    }
  }
}
