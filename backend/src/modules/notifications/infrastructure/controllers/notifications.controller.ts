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
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification.use-case';
import { GetAllNotificationsUseCase } from '../../application/use-cases/get-all-notifications.use-case';
import { GetNotificationsByUserUseCase } from '../../application/use-cases/get-notifications-by-user.use-case';
import { CreateNotificationDto } from '../../application/dtos/create-notification.dto';
import { NotificationResponseDto } from '../../application/dtos/notification-response.dto';

/**
 * Controlador REST para notificaciones
 */
@ApiTags('notificaciones')
@Controller('api/notifications')
export class NotificationsController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly getAllNotificationsUseCase: GetAllNotificationsUseCase,
    private readonly getNotificationsByUserUseCase: GetNotificationsByUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada exitosamente',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    return this.createNotificationUseCase.execute(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones obtenida exitosamente',
    type: [NotificationResponseDto],
  })
  async getAllNotifications(): Promise<NotificationResponseDto[]> {
    return this.getAllNotificationsUseCase.execute();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener notificaciones de un usuario específico' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones del usuario',
    type: [NotificationResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getNotificationsByUser(@Param('userId') userId: string): Promise<NotificationResponseDto[]> {
    return this.getNotificationsByUserUseCase.execute(userId);
  }
}
