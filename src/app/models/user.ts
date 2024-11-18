export interface User {
  email: string | undefined | null;
  password: string | null;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  genero: string | null;
  fechaNacimiento: Date | undefined | null;
  fechaRegistro: Date | undefined;
  activo: boolean;
  rol: string;
  id: string | null;
  actualizarPerfil: boolean | null;
}
