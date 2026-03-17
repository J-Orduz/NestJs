import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InstrumentsInterface } from './interfaces/instruments.interface';
import { InstrumentDto } from './dtos/instruments.dto';

@Injectable()
export class InstrumentsService {
    private instruments: InstrumentsInterface[] = [{
        id: '9fb870ac-a1b5-4e30-b905-6cd697a75559',
        nombre: 'Guitarra',
        tipo: 'Cuerda',
        precio: 500000,
        stock: 10,
        marca: 'Gibson'
    },{
        id: '952e3b69-8c97-45a7-9f38-d215f29283a6',
        nombre: 'Bateria',
        tipo: 'Percusion',
        precio: 800000,
        stock: 5,
        marca: 'Yamaha'
    },{
        id: 'd1c8e5b9-9f3a-4c8e-9b6a-2f1e5b6c7d8e',
        nombre: 'Piano',
        tipo: 'Teclado',
        precio: 1500000,
        stock: 3,
        marca: 'Roland'
    },{
        id: 'e2f9a7c8-6b4d-4e5f-9a7b-1c2d3e4f5g6h',
        nombre: 'Saxofon',
        tipo: 'Viento',
        precio: 600000,
        stock: 7,
        marca: 'Selmer'
    }]

    getAllInstruments(){
        return this.instruments;
    }

    getById(id: string){
        const instrument = this.instruments.find((ins)=>{
            if (ins.id === id){
                return ins;
            }
        })
        if(!instrument){
            return 'No se encontro el intrumento con el id: '+id;
        }
        return instrument;
    }

    createInstrument(ins: InstrumentDto){
        const id = uuidv4();
        this.instruments.push({
            id,
            nombre: ins.nombre,
            tipo: ins.tipo,
            precio: ins.precio,
            stock: ins.stock,
            marca: ins.marca
        })

        return this.getAllInstruments();
    }

    updateInstrument(id: string, ins: InstrumentDto){
        const instrument = this.instruments.find((ins)=>{
            return ins.id === id;
        })

        if(!instrument){
            return 'No se encontro el intrumento con el id: '+id;
        }

        this.instruments[instrument.id]={
            ...this.instruments[instrument.id],
            ...ins
        }
        return this.instruments[instrument.id];
    }

    deleteInstrument(id:string){
        const indice = this.instruments.findIndex((ins)=>{
            return ins.id === id;
        })
        if(indice === -1){
            return 'No se encontro el intrumento con el id: '+id;
        }
        this.instruments.splice(indice,1);
        return this.getAllInstruments();
    }
}
