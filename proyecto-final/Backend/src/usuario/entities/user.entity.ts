import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../enums/roles.enums";
import { VeterinarioEntity } from "src/veterinario/entities/vet.entity";

@Entity({name: 'usuarios'})
export class UsuarioEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
        nullable: false
    })
    nombre_completo: string;

    @Column('text',{
        unique: true,
        nullable: false
    })
    correo: string;

    @Column('text',{
        nullable: false,
        select: false
    })
    contrasenia: string;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.USUARIO
    })
    rol: string;

    @OneToOne(()=> VeterinarioEntity, (veterinario) => veterinario.usuario)
    veterinario: VeterinarioEntity;
}