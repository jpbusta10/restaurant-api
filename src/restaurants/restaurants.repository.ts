import { Injectable } from "@nestjs/common";
import { pool } from "src/db/db-connection";
import { RestaurantsDTO } from "./restaurantsDTO";

@Injectable()
export class RestaurantRepository{
    async getAll(): Promise<RestaurantsDTO[]>{
        const queryText = 'select restaurant_id, res_name, adress from restaurants';
        try{
            const result = await pool.query(queryText);
            return result.rows.map((row)=>new RestaurantsDTO(row.restaurant_id, row.res_name, row.adress));
        }
        catch(error){
            throw new Error(`unable to get restaurants: ${error.message}`)
        }
    }

    async create(newResto:RestaurantsDTO):Promise<RestaurantsDTO>{
        const queryText = 'insert into restaurants (res_name, adress, manager_id) values ($1, $2, $3) returning restaurant_id'
        const values = [
            newResto._name,
            newResto._adress,
            newResto._managerId
        ];
        try{
        const insertResto = await pool.query(queryText, values);
        newResto._id = insertResto.rows[0].restaurant_id;
        return newResto;
        }catch(error){
            throw new Error(`Error creating restaurant: ${error.message}`)
        }
    }
    async getById(id:string):Promise<RestaurantsDTO>{
        const queryText = 'select res_name, adress, manager_id from restaurants where restaurant_id = $1';
        try{
            const response = await pool.query(queryText, [id]);
            const row = response.rows[0];
            return new RestaurantsDTO(id, row.res_name, row.adress, row.manager_id)
        }catch(error){
            throw new Error(`Error getting resto: ${error.message}`)
        }
    }
    async getByName(name:string):Promise<RestaurantsDTO>{
        const queryText = 'select restaurant_id, adress, manager_id where res_name = $1';
        try{
            const response = await pool.query(queryText, [name]);
            const row = response.rows[0];
            return new RestaurantsDTO(row.restaurant_id, name, row.adress, row.manager_id);
        }catch(error){
            throw new Error(`Error getting resto: ${error.message}`)
        }
    }
}