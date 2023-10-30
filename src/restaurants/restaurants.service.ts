import { Injectable } from "@nestjs/common";
import { RestaurantRepository } from "./restaurants.repository";
import { RestaurantsDTO } from "./restaurantsDTO";

@Injectable()
export class RestaurantService{
    constructor(public restaurantRepository: RestaurantRepository){
    }
    getAll():Promise<RestaurantsDTO[]>{
        return this.restaurantRepository.getAll();
    }
    create(newResto: RestaurantsDTO){
        return this.restaurantRepository.create(newResto);
    }
    getById(id: string){
        return this.restaurantRepository.getById(id);
    }
    getByName(name:string){
        return this.restaurantRepository.getByName(name);
    }
}