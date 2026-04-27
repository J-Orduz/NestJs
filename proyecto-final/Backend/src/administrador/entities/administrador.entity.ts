import { UsuarioEntity } from "src/usuario/entities/user.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'administradores'})
export class AdministradorEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(()=> UsuarioEntity)
    @JoinColumn({name: 'fk_usuario'})
    usuario: UsuarioEntity;
    
}