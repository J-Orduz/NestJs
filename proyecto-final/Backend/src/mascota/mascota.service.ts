import { BadRequestException, Injectable } from '@nestjs/common';
import { MascotaDTO } from './dtos/mascota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MascotaEntity } from './entities/mascota.entity';
import { Repository } from 'typeorm';
import { DueñoService } from 'src/dueño/dueño.service';
import { DueñoEntity } from 'src/dueño/entities/dueño.entity';
import { UpdateMascotaDTO } from './dtos/update.mascota.dto';

@Injectable()
export class MascotaService {

    constructor(
        @InjectRepository(MascotaEntity)
        private readonly mascotaRepository: Repository<MascotaEntity>,
        private readonly dueñoService: DueñoService
    ){}

    async registrarMascota(mascotaDto: MascotaDTO){
        const {nombre, especie, raza, dueño} = mascotaDto;

        const duenio = await this.dueñoService.obtenerDueñoId(dueño);

        if(!duenio){
            return{
                message: 'Dueño no encontrado con el id :'+dueño
            }
        }

        const mascota = this.mascotaRepository.create({
            nombre,
            especie,
            raza,
            dueño: {id: dueño}
        });

        try{
            await this.mascotaRepository.save(mascota);
            return{
                message: 'Mascota registrada exitosamente'
            }
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async obtenerMascotas(){
        try{
            const mascotas = await this.mascotaRepository.find({relations: ['dueño', 'dueño.usuario']})
            if(mascotas.length === 0){
                return{
                    message: 'No hay mascotas registradas'
                }
            }
            return mascotas;
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async obtenerMascotaId(id:string){
        try{
            const mascota = await this.mascotaRepository.findOne({
                where: {id},
                relations: ['dueño', 'dueño.usuario']
            });

            if(!mascota){
                return{
                    message: 'No se encontró a la mascota con id: '+id
                }
            }

            return mascota;

        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async modificarMascota(id: string, updateMascota: UpdateMascotaDTO){
        try{
            const { dueño, ...datosRestantes } = updateMascota;

            const mascota = await this.mascotaRepository.preload({
                id,
                ...datosRestantes,
                dueño: dueño ? { id: dueño } as any : undefined
            })

            if(mascota){
                await this.mascotaRepository.save(mascota);
                return{
                    message: 'Mascota actualizada exitosamente '
                }
            }else{
                return{
                    message: 'No se encontro la mascota con id: '+id
                } 
            }
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async eliminarMascota(id:string){
        try{
            const mascota = this.mascotaRepository.findOne({
                where: {id}
            })

            if(!mascota){
                return{
                    message: 'No se encontró a la mascota con id: '+id
                }
            }

            await this.mascotaRepository.delete(id);
            return{
                message: 'Mascota eliminada exitosamente'
            }
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }
}
