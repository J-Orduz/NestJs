import { UsuarioEntity } from "src/usuario/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'dueños'})
export class DueñoEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        nullable: true
    })
    direccion_residencia: string;

    @OneToOne(()=> UsuarioEntity)
    @JoinColumn({name: 'fk_usuario'})
    usuario: UsuarioEntity;
}