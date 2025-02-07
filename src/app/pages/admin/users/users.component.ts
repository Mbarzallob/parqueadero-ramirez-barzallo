import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users/users.service';
import { CommonModule } from '@angular/common';

import { User } from '../../../models/person/user/user';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    private message: NzMessageService
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
}
