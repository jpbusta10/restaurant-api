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
            manager_id: restaurant._managerId,
            categories: restaurant._categories
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
    @Get("id/:id")
    async getById(@Param('id') id: string) {
        try {
            const res: RestaurantsDTO = await this.restaurantService.getById(id);
            const transformRes = {
                id: res._id,
                name: res._name,
                adress: res._adress,
                manager_id: res._managerId,
                categories: res._categories
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
                manager_id: res._managerId,
                categories: res._categories

            }
            return transformRes;
        } catch (error) {
            return {
                "message": `Error: ${error.message}`
            }
        }
    }
    @Post("/table")
    async createTable(@Body() data: any) {
        try {
            const newTable = new TableDTO(null, data.tableNumber, data.capacity, data.restaurant_id);
            const res = await this.restaurantService.createTable(newTable);
            return {
                "message": "created",
                "id": res._id
            }
        } catch (error) {
            return {
                "meesage": `Error: ${error.message}`
            }
        }
    }
    @Get("/tables")
    async getTablesByResto(@Body() data: any, @Res() res: Response) {
        try {
            const tables: TableDTO[] = await this.restaurantService.getTableByResto(data.restaurant_id);
            const transformedTables = tables.map(table => ({
                id: table._id,
                number: table._number,
                capacity: table._capacity
            }))
            res.setHeader('Content-Type', 'application/json');
            res.send(transformedTables);
        } catch (error) {
            res.send({
                "message": "error getting tables"
            })
        }
    }
    @Post("/create/categorie")
    async addCategorie(@Body() data: any, @Res() res: Response) {
        try {
            await this.restaurantService.addCategorie(data.restaurant_id, data.categorie);
            return res.status(200).json({
                message: "added"
            });
        } catch (error) {
            let statusCode = 500;
    
            if (error.message.includes("Categorie doesn't exist")) {
                statusCode = 404; // Not Found
            } else if (error.message.includes('categorie already added')) {
                statusCode = 409; // Conflict  
            }
    
            return res.status(statusCode).json({
                message: error.message
            });
        }
    }

    @Get("categories/:id")
    async getCategories(@Param('id') id: string, @Res() res: Response) {
      try {
        const categories = await this.restaurantService.getCategorie(id);
        return res.status(200).json(categories);
      } catch (error) {
        res.send({
            "error": `${error.message}`
        })
      }
    }
}
