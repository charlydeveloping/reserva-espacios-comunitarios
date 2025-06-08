import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { CancelReservationUseCase } from '../../application/use-cases/cancel-reservation.use-case';
import { GetAllReservationsUseCase } from '../../application/use-cases/get-all-reservations.use-case';
import { CreateReservationDto } from '../../application/dtos/create-reservation.dto';
import { ReservationResponseDto } from '../../application/dtos/reservation-response.dto';

/**
 * Controlador REST para reservas
 * Orquesta los casos de uso relacionados con reservas
 */
@ApiTags('reservas')
@Controller('api/reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    private readonly getAllReservationsUseCase: GetAllReservationsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o espacio no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de horario con otra reserva',
  })
  async createReservation(@Body() createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    return this.createReservationUseCase.execute(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas obtenida exitosamente',
    type: [ReservationResponseDto],
  })
  async getAllReservations(): Promise<ReservationResponseDto[]> {
    return this.getAllReservationsUseCase.execute();
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una reserva' })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID del usuario que cancela la reserva',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada exitosamente',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado para cancelar esta reserva',
  })
  @ApiResponse({
    status: 409,
    description: 'La reserva no puede ser cancelada en su estado actual',
  })
  async cancelReservation(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<ReservationResponseDto> {
    return this.cancelReservationUseCase.execute(id, userId);
  }
}
