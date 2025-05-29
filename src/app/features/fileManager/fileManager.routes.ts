import { Routes } from '@angular/router';
import { authGuard } from '../../shared/security/guard/auth.guard';

export const fileManagerRoutes: Routes = [
  {
    path: 'fileManager',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/fileManager-list.component').then(m => m.FileManagerListComponent),
  },
  {
    path: 'fileManager/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/fileManager-form.component').then(m => m.FileManagerFormComponent),
  },
  {
    path: 'fileManager/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/fileManager-form.component').then(m => m.FileManagerFormComponent),
  },
    {
    path: 'fileManager/:id/view',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/fileManager-view.component').then(m => m.FileManagerViewComponent),
  }
];
