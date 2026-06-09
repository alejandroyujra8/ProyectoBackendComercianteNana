export class CreateUsuarioDto {
  nombre: string;
  apellido: string;
  correo: string;
  contrasenia: string;
  captchaToken?: string;
}
