import { DueñoEntity } from "src/dueño/entities/dueño.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'mascotas'})
export class MascotaEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable: false
    })
    nombre:string;

    @Column('text',{
        nullable:false
    })
    especie:string;

    @Column('text',{
        nullable: false
    })
    raza: string;

    @ManyToOne(
        () => DueñoEntity,
        (dueño) => dueño.id,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({name: 'fk_duenio'})
    dueño: DueñoEntity;
}