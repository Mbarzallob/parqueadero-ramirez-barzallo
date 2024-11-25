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

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent {
  constructor(
    private fb: FormBuilder,
    private messageService: MensajesService
  ) {}

  contactForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.contactForm.valid) {
      await this.messageService.addMensaje(this.contactForm.value);
      alert('Mensaje enviado correctamente');
      this.contactForm.reset();
    } else {
      console.log('Form not valid');
    }
  }
}
