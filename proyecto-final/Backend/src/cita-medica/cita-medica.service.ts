import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CitaMedicaEntity } from './entities/cita-medica.entity';
import { Repository } from 'typeorm';
import { MascotaService } from 'src/mascota/mascota.service';
import { CitaMedicaDTO } from './dtos/cita-medica.dto';
import { VeterinarioService } from 'src/veterinario/veterinario.service';
import { UpdateCitaMedicaDTO } from './dtos/update.cita-medica.dto';

@Injectable()
export class CitaMedicaService {

    constructor(
        @InjectRepository(CitaMedicaEntity)
        private readonly citaMedicaRepository: Repository<CitaMedicaEntity>,
        private readonly mascotaService: MascotaService,
        private readonly veterinarioService: VeterinarioService
    ){}

    async registrarCita(citaMedicaDTO: CitaMedicaDTO){
        try{
            const {fecha_cita, motivo_consulta, mascota, veterinario} = citaMedicaDTO;

            const pet = this.mascotaService.obtenerMascotaId(mascota);
            if(!pet){
                return{
                    message: 'No se encontró la mascota con id: '+mascota
                }
            }

            const vet = this.veterinarioService.obtenerVeterinarioId(veterinario);

            if(!vet){
                return{
                    message: 'No se encontró el veterinario con id: '+vet
                }
            }

            const cita = this.citaMedicaRepository.create({
                fecha_cita,
                motivo_consulta,
                mascota: {id: mascota},
                veterinario: {id: veterinario}
            })

            await this.citaMedicaRepository.save(cita);
            return {
                message: 'Cita Medica creada exitosamente'
            }
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async obtenerCitas(){
        try{
            const citas = await this.citaMedicaRepository.find({relations: ['mascota', 'mascota.dueño.usuario', 'veterinario.usuario']});

            if(citas.length === 0 ){
                return{
                    message: 'No se encontraron citas'
                }
            }

            return citas;
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async obtenerCitaId(id:string){
        try{
            const cita = this.citaMedicaRepository.findOne({
                where: {id},
                relations: ['mascota', 'mascota.dueño.usuario', 'veterinario.usuario']
            })

            if(!cita){
                return{
                    message: 'No se encontró la cita medica con id: '+id
                }
            }

            return cita;
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async modificarCita(id: string, updateCitaDto: UpdateCitaMedicaDTO){
        try{
            const {mascota, veterinario, ...datosRestantes} = updateCitaDto;

            const cita = await this.citaMedicaRepository.preload({
                id,
                ...datosRestantes,
                mascota: mascota ? { id: mascota } as any : undefined,
                veterinario: veterinario ? { id: veterinario } as any : undefined
            })

            if(cita){
                await this.citaMedicaRepository.save(cita);
                return{
                    message: 'Cita actualizada exitosamente'
                }
            }else{
                return{
                    message: 'No se encontró la cita con id: '+id
                }
            }
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }

    async eliminarCita(id:string){
        try{
            const cita = await this.citaMedicaRepository.findOne({
                where: {id}
            })

            if(!cita){
                return{
                    message: 'No se encontró la cita con id: '+id
                }
            }

            await this.citaMedicaRepository.delete(id);
            return{
                message: 'Cita eliminada exitosamente'
            }
        }catch(error){
            const message = (error as Error).message;
            throw new BadRequestException(message);
        }
    }
}
