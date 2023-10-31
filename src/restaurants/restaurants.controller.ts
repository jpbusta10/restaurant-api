import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { RestaurantService } from './restaurants.service';
import { RestaurantsDTO } from './restaurantsDTO';
import { Response } from 'express'
import { TableDTO } from './tableDTO';
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
    @Get("/name/:name")
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
    @Post("/table")
    async createTable(@Body() data:any){
       try{ const newTable = new TableDTO(null, data.tableNumber, data.capacity, data.isReserved, data.restaurant_id);
        const res = await this.restaurantService.createTable(newTable);
        return {
            "message": "created",
            "id": res._id
        }
        }catch(error){
            return{
                "meesage": `${error.message}`
            }
        }
    }
    @Get("/tables")
    async getTablesByResto(@Body() data: any, @Res()res:Response){
        try{
            const tables:TableDTO[] = await this.restaurantService.getTableByResto(data.restaurant_id);
            const transformedTables = tables.map(table=>({
                id: table._id,
                number: table._number,
                capacity: table._capacity,
                isReserved: table._isReserved
            }))
            res.setHeader('Content-Type', 'application/json');
            res.send(transformedTables);
        }catch(error){
            res.send({
                "message": "error getting tables"
            })
        }
    }
}
