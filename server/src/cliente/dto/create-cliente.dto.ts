import { IsString } from "class-validator";

export class CreateClienteDto {
    @IsString()
    nombre:string;
    @IsString()
    apellido:string;
    @IsString()
    email:string;
    @IsString()
    contraseña:string;

    
}
