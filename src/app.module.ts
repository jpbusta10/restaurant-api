import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [UsersModule, RestaurantsModule], // Importa ambos módulos
})
export class AppModule {}