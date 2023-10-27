import { Injectable } from "@nestjs/common";
import { pool }  from "src/db/db-connection";
import { UserDTO } from "./usersDTO";
import { RestaurantsDTO } from "src/restaurants/restaurantsDTO";

@Injectable()
export class UsersRepository {
   

    async getAll(): Promise<UserDTO[]> {
        const query = `
            SELECT
                u.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.user_name,
                u.dni,
                ur.rol_name AS role,
                f.restaurant_id AS favorite_restaurant_id,
                r.res_name AS favorite_restaurant_name,
                r.adress AS favorite_restaurant_address
            FROM
                users AS u
            INNER JOIN
                roles AS ur ON u.rol_id = ur.rol_id
            LEFT JOIN
                favorites AS f ON u.user_id = f.user_id
            LEFT JOIN
                restaurants AS r ON f.restaurant_id = r.restaurant_id;
        `;
    
        try {
            const { rows } = await pool.query(query);
    
            const usersMap = new Map<string, UserDTO>();
    
            for (const row of rows) {
                const {
                    user_id,
                    first_name,
                    last_name,
                    email,
                    user_name,
                    dni,
                    hashed_pass,
                    role,
                    favorite_restaurant_id,
                    favorite_restaurant_name,
                    favorite_restaurant_address,
                } = row;
    
                if (!usersMap.has(user_id)) {
                    const newUser = new UserDTO(
                        user_id,
                        user_name,
                        first_name,
                        last_name,
                        email,
                        dni,
                        [],
                        [],
                        role,
                        hashed_pass
                    );
                    if (favorite_restaurant_id && favorite_restaurant_name && favorite_restaurant_address) {
                        const favoriteRestaurant = new RestaurantsDTO(
                            favorite_restaurant_id,
                            favorite_restaurant_name,
                            favorite_restaurant_address
                        );
                        newUser.favourites.push(favoriteRestaurant);
                    }
                    usersMap.set(user_id, newUser);
                } else if (favorite_restaurant_id && favorite_restaurant_name && favorite_restaurant_address) {
                    const favoriteRestaurant = new RestaurantsDTO(
                        favorite_restaurant_id,
                        favorite_restaurant_name,
                        favorite_restaurant_address
                    );
                    usersMap.get(user_id).favourites.push(favoriteRestaurant);
                }
            }
    
            return Array.from(usersMap.values());
        } catch (error) {
            throw new Error(`Error retrieving users: ${error.message}`);
        }
    }
    

    async createUser(newUser: UserDTO){
        const rolQuery = 'SELECT rol_id FROM roles WHERE rol_name = $1';
        const queryInsert =
            'INSERT INTO users (first_name, last_name, email, hashed_pass, user_name, dni, rol_id) \
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id';
    
        try {
            const result = await pool.query(rolQuery, [newUser.role]);
            if (result.rows.length === 0) {
                throw new Error(`Role with name "${newUser.role}" not found.`);
            }
            
            const rolId: string = result.rows[0].rol_id;
            const values = [
                newUser.firstName,
                newUser.lastName,
                newUser.email,
                newUser.hashedPass,
                newUser.userName,
                newUser.dni,
                rolId
            ];
          
            const insertResult = await pool.query(queryInsert, values);
            newUser.id = insertResult.rows[0].user_id;
            return newUser;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }
}


