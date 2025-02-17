import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private http: HttpClient) {}
  addMensaje(mensaje: any) {
    return this.http.post<Response<any>>('message', mensaje);
  }
}
