import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'new', loadComponent: () => import('./inventory-form/inventory-form.component').then(m => m.InventoryFormComponent) },
    { path: 'inventory', loadComponent: () => import('./inventory-list/inventory-list.component').then(m => m.InventoryListComponent)},
    { path: '', redirectTo: '/inventory', pathMatch: 'full' },
    { path: '**', redirectTo: '/inventory' }
];
