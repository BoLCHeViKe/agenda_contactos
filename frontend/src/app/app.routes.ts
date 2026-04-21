import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/contact-list/contact-list.component').then(m => m.ContactListComponent)
  },
  {
    path: 'contacts/new',
    loadComponent: () => import('./pages/contact-form/contact-form.component').then(m => m.ContactFormComponent)
  },
  {
    path: 'contacts/:id',
    loadComponent: () => import('./pages/contact-detail/contact-detail.component').then(m => m.ContactDetailComponent)
  },
  {
    path: 'contacts/:id/edit',
    loadComponent: () => import('./pages/contact-form/contact-form.component').then(m => m.ContactFormComponent)
  },
  { path: '**', redirectTo: '' }
];
