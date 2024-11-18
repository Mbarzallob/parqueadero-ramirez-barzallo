import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  constructor(private userService: UsersService) {}
  ngOnInit(): void {
    this.getUsers();
  }
  async getUsers() {
    this.users = await this.userService.getUsers();
    console.log(this.users);
  }
}
