import { MascotaEntity } from "src/mascota/entities/mascota.entity";
import { VeterinarioEntity } from "src/veterinario/entities/vet.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'citas_medicas'})
export class CitaMedicaEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date',{
        nullable: false
    })
    fecha_cita: string;

    @Column('text',{
        nullable: false
    })
    motivo_consulta: string;

    @ManyToOne(
        () => MascotaEntity,
        (mascota) => mascota.id,
        {
            onUpdate: 'CASCADE'
        }
    )
    @JoinColumn({name: 'fk_mascota'})
    mascota: MascotaEntity;

    @ManyToOne(
        ()=> VeterinarioEntity,
        (veterinario) => veterinario.id,
        {
            onUpdate: 'CASCADE'
        }
    )
    @JoinColumn({name: 'fk_veterinario'})
    veterinario: VeterinarioEntity;
}