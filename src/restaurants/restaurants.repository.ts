import { Injectable } from "@nestjs/common";
import { pool } from "src/db/db-connection";
import { RestaurantsDTO } from "./restaurantsDTO";
import { TableDTO } from "./tableDTO";

@Injectable()
export class RestaurantRepository{
    async getAll(): Promise<RestaurantsDTO[]> {
        const queryText = 'select restaurant_id, res_name, adress, manager_id from restaurants';
        const categorieQuery = 'select c.categorie_name from categories c inner join restaurant_categorie rc on c.id_categories = rc.categorie_id where rc.restaurant_id = $1';
    
        try {
            const result = await pool.query(queryText);
            const restos: RestaurantsDTO[] = result.rows.map((row) => new RestaurantsDTO(row.restaurant_id, row.res_name, row.adress, row.manager_id));
            await Promise.all(restos.map(async (resto) => {
                const resultcat = await pool.query(categorieQuery, [resto._id]);
                resto._categories = resultcat.rows.map((row) => row.categorie_name);
            }));
    
            return restos;
        } catch (error) {
            throw new Error(`Unable to get restaurants: ${error.message}`);
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
        const categorieQuery = 'select c.categorie_name from categories c inner join restaurant_categorie rc on c.id_categories = rc.categorie_id where rc.restaurant_id = $1';
        
        try{
            const response = await pool.query(queryText, [id]);
            const row = response.rows[0];
            const resto =  new RestaurantsDTO(id, row.res_name, row.adress, row.manager_id)
            const responseCat = await pool.query(categorieQuery, [resto._id]);
            resto._categories = responseCat.rows.map((row)=> row.categorie_name);
            return resto;
        }catch(error){
            throw new Error(`Error getting resto: ${error.message}`)
        }
    }
    async getByName(name:string):Promise<RestaurantsDTO>{
        const queryText = 'select restaurant_id, adress, manager_id from restaurants where res_name = $1';
        const categorieQuery = 'select c.categorie_name from categories c inner join restaurant_categorie rc on c.id_categories = rc.categorie_id where rc.restaurant_id = $1';
        try{
            const response = await pool.query(queryText, [name]);
            const row = response.rows[0];
            const resto = new RestaurantsDTO(row.restaurant_id, name, row.adress, row.manager_id);
            const responseCat = await pool.query(categorieQuery, [resto._id]);
            resto._categories = responseCat.rows.map((row)=> row.categorie_name);
            return resto;

        }catch(error){
            throw new Error(`Error getting resto: ${error.message}`)
        }   
    }
    async createTable(newTable: TableDTO):Promise<TableDTO>{
        const queryText = 'insert into tables (table_number, restaurant_id, capacity) values ($1, $2, $3) returning table_id';
        const values = [
            newTable._number,
            newTable._restaurant_id,
            newTable._capacity
        ];
        try{
            const response = await pool.query(queryText, values);
            newTable._id = response.rows[0].table_id;
            return newTable;
        }catch(error){
            throw new Error(`Error creating table: ${error.message}`);
        }
    }
    async getTableByResto(restaurant_id: string): Promise<TableDTO[]>{
        const queryText = 'select table_id, table_number, isReserved, capacity from tables where restaurant_id = $1';
        try{
            const result = await pool.query(queryText, [restaurant_id]);
            return result.rows.map((row)=> new TableDTO(row.table_id, row.table_number, row.capacity, restaurant_id))
        }catch(error){
            throw new Error(`Error getting tables ${error.message}`);
        }
    }
    async getCategoriesbyResto(restaurantId:string):Promise<string[]>{
        const queryText = 'select categorie_name from categories c inner join restaurant_categorie rc on c.id_categories = rc.categorie_id where rc.restaurant_id = $1';
        try{
            const result = await pool.query(queryText, [restaurantId]);
            const categories = result.rows.map((row)=> row.categorie_name);
            return categories;
        }catch(error){
            throw new Error(`error getting categories: ${error.message}`);
        }
    }
    async addCategorie(restaurantId:string, categorie: string){
        const queryCategorie = 'select id_categories from categories where categorie_name = $1';
        const queryResCat = 'insert into restaurant_categorie (restaurant_id, categorie_id) values ($1, $2)';
        try{
           const resultCat = await pool.query(queryCategorie, [categorie]);
           if(resultCat.rowCount === 0){
            throw new Error(`Categorie doesn't exist: ${categorie}`);
           }
           const categorieId = resultCat.rows[0].id_categories;
           const addCat = await pool.query(queryResCat, [restaurantId, categorieId]);
        }catch(error){
            if(error.constraint === 'unq_cat_per_res'){
                throw new Error(`categorie already added: ${categorie}`);
            }
            else{
                throw new Error(`Error adding categorie: ${error.message}`);
            }
        }

    }
    async addMultipleCategories(restaurant_id, categories) {
        const queryOneCat = 'INSERT INTO restaurant_categorie (restaurant_id, categorie_id) VALUES ($1, $2)';
        const queryCatId = 'SELECT id_categories FROM categories WHERE categorie_name = $1';
        const client = await pool.connect();
      
        try {
          await client.query('BEGIN');
      
          for (const category of categories) {
            const resultId = await client.query(queryCatId, [category]);
      
            if (resultId.rowCount === 0) {
              throw new Error(`Category doesn't exist: ${category}`);
            }
      
            const categoryId = resultId.rows[0].id_categories;
            await client.query(queryOneCat, [restaurant_id, categoryId]);
          }
      
          await client.query('COMMIT');
        } catch (error) {
          await client.query('ROLLBACK');
          console.error('Error in addMultipleCategories:', error.message);
        } finally {
          client.release();
        }
      }
    
   
    
}