import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MensajesService } from '../../../services/mensajes/mensajes.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent {
  constructor(
    private fb: FormBuilder,
    private messageService: MensajesService,
    private message: NzMessageService
  ) {}

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.contactForm.valid) {
      this.messageService
        .addMensaje(this.contactForm.value)
        .subscribe((api) => {
          this.message.success('Mensaje enviado correctamente');
          this.contactForm.reset();
        });
    } else {
      this.message.error('Por favor, rellene todos los campos');
    }
  }
}
