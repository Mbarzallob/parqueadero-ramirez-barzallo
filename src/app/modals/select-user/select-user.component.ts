import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { User } from '../../models/person/user/user';
import { UsersService } from '../../services/users/users.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiclesComponent } from '../vehicles/vehicles.component';

@Component({
  selector: 'app-select-user',
  imports: [
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './select-user.component.html',
  styleUrl: './select-user.component.scss',
})
export class SelectUserComponent implements OnInit {
  users: User[] = [];
  searchQuery: string = '';
  filteredUsers: User[] = [];
  constructor(
    private modal: NzModalRef,
    private userService: UsersService,
    private modalService: NzModalService
  ) {}
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((api) => {
      this.users = api.data;
      this.filteredUsers = this.users;
    });
  }

  selectUser(user: User) {
    this.modalService
      .create({
        nzContent: VehiclesComponent,
        nzData: {
          user,
          canSelect: true,
        },
        nzFooter: null,
        nzTitle: 'Vehículos: ' + user.firstName + ' ' + user.lastName,
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.modal.close(result);
        }
      });
  }

  close() {
    this.modal.destroy();
  }
  filterUsers() {
    this.filteredUsers = this.users.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }
}
