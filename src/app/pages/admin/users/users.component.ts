import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users/users.service';
import { CommonModule } from '@angular/common';

import { User } from '../../../models/person/user/user';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActualizarUsuarioComponent } from '../../../modals/actualizar-usuario/actualizar-usuario.component';
@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  constructor(
    private userService: UsersService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data;
      },
      (error) => {
        this.message.error(error);
      }
    );
  }
  openModal(user: User) {
    this.modal
      .create({
        nzContent: ActualizarUsuarioComponent,
        nzData: {
          user,
        },
        nzFooter: null,
        nzTitle: 'Actualizar usuario: ' + user.firstName + ' ' + user.lastName,
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.getUsers();
        }
      });
  }
}
