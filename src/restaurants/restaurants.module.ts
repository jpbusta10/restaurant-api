import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantRepository } from './restaurants.repository';
import { RestaurantService } from './restaurants.service';
@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantRepository, RestaurantService]
})
export class RestaurantsModule {}
