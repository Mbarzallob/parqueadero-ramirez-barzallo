import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { TimestampToDatePipe } from '../../../pipes/timestamp-to-date.pipe';
import { ActualizarUsuarioComponent } from '../../../modals/actualizar-usuario/actualizar-usuario.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TimestampToDatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  constructor(private userService: UsersService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.getUsers();
  }
  async getUsers() {
    this.users = await this.userService.getUsers();
    console.log(this.users);
  }
  openDialog(user: any) {
    const dialog = this.dialog.open(ActualizarUsuarioComponent, {
      data: user,
      height: '400px',
      width: '600px',
    });
    dialog.afterClosed().subscribe((result) => {
      this.getUsers();
    });
  }
}
