import { Component } from '@angular/core';
import { Inventory } from '../Model/Inventory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryServiceService } from '../service/inventory-service.service';
import { User } from '../Model/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.css'
})
export class InventoryFormComponent {

  inventory: Inventory = {
    productName: '',
    quantity: 0,
    entryDate: new Date(),
    userId: 0,
  };

  inventories: Inventory[] = [];
  users: User[] = [];

  constructor(private inventoryService: InventoryServiceService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.inventoryService.getUsers().subscribe(
      (data) => {
        this.users = data; // Almacena la lista de usuarios
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  saveInventory(): void {

    const today = new Date(); // Obtener la fecha actual en formato 'yyyy-MM-dd'
    const filterDateObj = new Date(this.inventory.entryDate);
    // Verificar si la fecha es válida
    if (filterDateObj > today) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "La fecha de ingreso no puede ser mayor a la fecha actual.",
        showConfirmButton: true,
      });
      return; // Detener la búsqueda si la fecha es inválida
    }

    this.inventoryService.addInventory(this.inventory).subscribe(
      (response) => {
        console.log('Inventory added:', response);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registro creado con exito!!",
          showConfirmButton: true,
        });
        this.cleanObject();
      },
      (error) => {
        console.error('Error al agregar inventario:', error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.error.message,
          showConfirmButton: true,
        });
      }
    );
  }

  cleanObject() {
    this.inventory.productName = '';
    this.inventory.quantity = 0;
    this.inventory.entryDate = new Date();
    this.inventory.userId = 0;
  }

}
