import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventory } from '../Model/Inventory';
import { HttpClient } from '@angular/common/http';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'  // Esto hace que el servicio sea inyectable globalmente
})
export class InventoryServiceService {

  constructor(private http: HttpClient) {
    console.log('****InventoryServiceService*****');
  } 

  private apiUrl = 'http://localhost:8080/service/v1';

  getInventories(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/inventory/active`);
  }

  addInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.apiUrl}/inventory`, inventory);
  }

  updateInventory(id?: number, inventory?: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/inventory/${id}`, inventory);
  }

  deleteInventory(id?: number, userId?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inventory/${id}?userId=${userId}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

}
