import { CitaMedicaEntity } from "src/cita-medica/entities/cita-medica.entity";
import { UsuarioEntity } from "src/usuario/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'veterinarios'})
export class VeterinarioEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        nullable: false
    })
    especialidad_medica: string;

    @OneToOne(()=> UsuarioEntity)
    @JoinColumn({name: 'fk_usuario'})
    usuario: UsuarioEntity;

    @OneToMany(
        () => CitaMedicaEntity,
        (cita) => cita.id
    )
    citas: CitaMedicaEntity[]
}