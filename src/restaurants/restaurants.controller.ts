import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { RestaurantService } from './restaurants.service';
import { RestaurantsDTO } from './restaurantsDTO';
import { Response } from 'express'
@Controller('restaurants')
export class RestaurantsController {
    constructor(public restaurantService: RestaurantService) {
    };
    @Get()
    async listRestaurants(@Res() res: Response) {
        const restaurants: RestaurantsDTO[] = await this.restaurantService.getAll();
        const transformRestaurants = restaurants.map(restaurant => ({
            id: restaurant._id,
            name: restaurant._name,
            adress: restaurant._adress,
            manager_id: restaurant._managerId
        }));
        res.setHeader('Content-Type', 'application/json');
        res.send(transformRestaurants);
    };
    @Post()
    async createResto(@Body() data: any) {
        const newResto = new RestaurantsDTO(null, data.name, data.adress, data.manager_id);
        const res = await this.restaurantService.create(newResto);
        return {
            "message": "created",
            "id": res._id
        }
    }
    @Get("/id")
    async getById(@Body() data: any) {
        const id = data.id;
        try {
            const res: RestaurantsDTO = await this.restaurantService.getById(id);
            const transformRes = {
                id: res._id,
                name: res._name,
                adress: res._adress,
                manager_id: res._managerId
            }
            return transformRes;
        } catch (error) {
            return {
                "message": `Error: ${error.message}`
            }
        }
    }
    @Get("/:name")
    async getByName(@Param('name') name: string) {
        try {
            const res: RestaurantsDTO = await this.restaurantService.getByName(name);
            const transformRes = {
                id: res._id,
                name: res._name,
                adress: res._adress,
                manager_id: res._managerId
            }
            return transformRes;
        }catch(error){
            return {
                "message": `Error: ${error.message}`
            }
        }
    }
}
