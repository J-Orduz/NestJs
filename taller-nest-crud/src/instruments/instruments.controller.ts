import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentDto } from './dtos/instruments.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  getAllInstruments(){
    return this.instrumentsService.getAllInstruments();
  }

  @Get(':id')
  getById(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.instrumentsService.getById(id);
  }

  @Post()
  createInstrument(
    @Body() instrumentDto: InstrumentDto
  ){
    return this.instrumentsService.createInstrument(instrumentDto);
  }

  @Patch(':id')
  updateInstrument(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() instrumentDto: InstrumentDto
  ){
    return this.instrumentsService.updateInstrument(id, instrumentDto);
  }

  @Delete(':id')
  deleteInstrument(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.instrumentsService.deleteInstrument(id);
  }
}
