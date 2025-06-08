import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateSpaceUseCase } from '../../application/use-cases/create-space.use-case';
import { GetAllSpacesUseCase } from '../../application/use-cases/get-all-spaces.use-case';
import { GetAvailableSpacesUseCase } from '../../application/use-cases/get-available-spaces.use-case';
import { GetSpaceByIdUseCase } from '../../application/use-cases/get-space-by-id.use-case';
import { CreateSpaceDto } from '../../application/dtos/create-space.dto';
import { SpaceResponseDto } from '../../application/dtos/space-response.dto';

/**
 * Controlador REST para espacios
 */
@ApiTags('espacios')
@Controller('api/spaces')
export class SpacesController {
  constructor(
    private readonly createSpaceUseCase: CreateSpaceUseCase,
    private readonly getAllSpacesUseCase: GetAllSpacesUseCase,
    private readonly getAvailableSpacesUseCase: GetAvailableSpacesUseCase,
    private readonly getSpaceByIdUseCase: GetSpaceByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo espacio' })
  @ApiResponse({
    status: 201,
    description: 'Espacio creado exitosamente',
    type: SpaceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async createSpace(@Body() createSpaceDto: CreateSpaceDto): Promise<SpaceResponseDto> {
    return this.createSpaceUseCase.execute(createSpaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los espacios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de espacios obtenida exitosamente',
    type: [SpaceResponseDto],
  })
  async getAllSpaces(): Promise<SpaceResponseDto[]> {
    return this.getAllSpacesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un espacio por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del espacio',
    example: '660e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'Espacio obtenido exitosamente',
    type: SpaceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio no encontrado',
  })
  async getSpaceById(@Param('id') id: string): Promise<SpaceResponseDto> {
    return this.getSpaceByIdUseCase.execute(id);
  }

  @Get('available')
  @ApiOperation({ summary: 'Obtener espacios disponibles para una fecha y horario específicos' })
  @ApiQuery({
    name: 'date',
    description: 'Fecha de la reserva (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'startTime',
    description: 'Hora de inicio (HH:MM)',
    example: '09:00',
  })
  @ApiQuery({
    name: 'endTime',
    description: 'Hora de fin (HH:MM)',
    example: '11:00',
  })
  @ApiQuery({
    name: 'minCapacity',
    description: 'Capacidad mínima requerida',
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de espacios disponibles',
    type: [SpaceResponseDto],
  })
  async getAvailableSpaces(
    @Query('date') dateStr: string,
    @Query('startTime') startTimeStr: string,
    @Query('endTime') endTimeStr: string,
    @Query('minCapacity') minCapacity?: number,
  ): Promise<SpaceResponseDto[]> {
    // Construir fechas completas
    const date = new Date(dateStr);
    const startTime = new Date(`${dateStr}T${startTimeStr}:00`);
    const endTime = new Date(`${dateStr}T${endTimeStr}:00`);

    return this.getAvailableSpacesUseCase.execute(
      date,
      startTime,
      endTime,
      minCapacity,
    );
  }
}
