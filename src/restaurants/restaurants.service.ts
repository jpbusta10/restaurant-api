import { Injectable } from "@nestjs/common";
import { RestaurantRepository } from "./restaurants.repository";
import { RestaurantsDTO } from "./restaurantsDTO";
import { TableDTO } from "./tableDTO";

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
    createTable(newTable: TableDTO){
        return this.restaurantRepository.createTable(newTable);
    }
    getTableByResto(restaurant_id:string){
        return this.restaurantRepository.getTableByResto(restaurant_id);
    }
}