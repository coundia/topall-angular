import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private resources: string[]) {}

  getTranslation(lang: string): Observable<any> {
    const requests = this.resources.map(path =>
      this.http.get(`/assets/i18n/${lang}/${path}.json`)
    );
    return forkJoin(requests).pipe(
      map(responseArr =>
        responseArr.reduce((acc, obj) => ({ ...acc, ...obj }), {})
      )
    );
  }
}
