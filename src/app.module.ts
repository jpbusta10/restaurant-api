import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ReservationsModule } from './reservations/reservations.module';
@Module({
  imports: [UsersModule, RestaurantsModule, ReservationsModule], 
})
export class AppModule {}