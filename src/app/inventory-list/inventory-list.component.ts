import { Component, OnInit } from '@angular/core';
import { Inventory } from '../Model/Inventory';
import { CommonModule } from '@angular/common';
import { InventoryServiceService } from '../service/inventory-service.service';
import { FormsModule } from '@angular/forms';
import { User } from '../Model/User';
import Swal from 'sweetalert2';

declare var window: any; // Necesario si usas Bootstrap JS para manejar los modales

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css'
})
export class InventoryListComponent implements OnInit {

  constructor(private inventoryService: InventoryServiceService) { }

  selectedInventory: Inventory = {
    id: 0,
    productName: '',
    quantity: 0,
    entryDate: new Date(),
    userId: 0,
  }; // Para almacenar el inventario seleccionado

  users: User[] = [];

  isEditModalOpen = false; // Controla la visibilidad del modal de edición
  isDeleteModalOpen = false; // Controla la visibilidad del modal de eliminación

  inventories: Inventory[] = []; // Lista completa de inventarios cargados
  filteredInventories: Inventory[] = []; // Lista filtrada de inventarios
  filterName: string = ''; // Filtro para el nombre
  filterDate: string = ''; // Filtro para la fecha
  filterUser: string = ''; // Filtro para el usuario

  ngOnInit(): void {
    this.loadInventories();
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

  loadInventories(): void {
    this.inventoryService.getInventories().subscribe((data: Inventory[]) => {
      this.inventories = data;
      this.filteredInventories = data;
    });
  }

  // Método para filtrar los inventarios según los filtros aplicados
  filterInventories(): void {
    this.filteredInventories = this.inventories.filter((inventory) => {
      // Aplicar los filtros uno por uno, sólo si los campos tienen valores
      const matchesName = this.filterName
        ? inventory.productName?.toLowerCase().includes(this.filterName.toLowerCase())
        : true;

      const matchesDate = this.filterDate
        ? new Date(inventory.entryDate).toISOString().slice(0, 10) === this.filterDate
        : true;

      const matchesUser = this.filterUser
        ? inventory.creatorUserName?.toLowerCase().includes(this.filterUser.toLowerCase())
        : true;

      // El inventario debe coincidir con todos los filtros que tengan valores
      return matchesName && matchesDate && matchesUser;
    });
  }

  // Método para limpiar los filtros y restablecer la lista completa
  clearFilters(): void {
    this.filterName = '';
    this.filterDate = '';
    this.filterUser = '';
    this.filteredInventories = [...this.inventories]; // Restablece la lista filtrada a la lista original
  }

  openEditModal(inventory: Inventory) {
    this.selectedInventory = { ...inventory }; // Copia el inventario seleccionado
    this.isEditModalOpen = true; // Muestra el modal de edición
  }

  closeEditModal() {
    this.isEditModalOpen = false; // Oculta el modal de edición
  }

  openDeleteModal(inventory: Inventory) {
    this.selectedInventory = inventory; // Almacena el inventario a eliminar
    this.isDeleteModalOpen = true; // Muestra el modal de confirmación de eliminación
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false; // Oculta el modal de eliminación
  }

  deleteInventory() {
    // Lógica para eliminar el inventario seleccionado
    if (this.selectedInventory) {
      // Lógica para eliminar el inventario en el servidor
      this.inventoryService.deleteInventory(this.selectedInventory.id, this.selectedInventory.userId)
        .subscribe(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registro eliminado con exito!!",
            showConfirmButton: true,
          });
          this.closeDeleteModal(); // Cierra el modal después de eliminar
          window.location.reload();
        },
          (error) => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: error.error.message,
              showConfirmButton: true,
            });
          });
    }
  }

  updateInventory() {

    const today = new Date(); // Obtener la fecha actual en formato 'yyyy-MM-dd'
    const filterDateObj = new Date(this.selectedInventory.entryDate);
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

    // Lógica para actualizar el inventario seleccionado
    if (this.selectedInventory) {
      // Lógica para actualizar el inventario en el servidor
      this.inventoryService.updateInventory(this.selectedInventory.id, this.selectedInventory)
        .subscribe(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registro actualizado con exito!!",
            showConfirmButton: true,
          });
          this.closeEditModal(); // Cierra el modal después de guardar los cambios
          window.location.reload();
        },
          (error) => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: error.error.message,
              showConfirmButton: true,
            });
          }
        );
    }
  }

}
