import { Injectable } from "@nestjs/common";
import { pool } from "src/db/db-connection";
import { ReservationsDTO } from "./reservationsDTO";
import { TableDTO } from "src/restaurants/tableDTO";

@Injectable()
export class ReservationsRepository{
    async createReservation(newReservation: ReservationsDTO):Promise<ReservationsDTO>{
        const stateQueryText = 'select state_id from states where state_name = $1';
        const insertQuery = 'insert into reservations (user_id, restaurant_id, state_id, res_size, due_date, comment) \
        values ($1, $2, $3, $4, $5,$6) returning reservation_id'
        try{
           const resultState = await pool.query(stateQueryText, [newReservation._state]);
           const state_id = resultState.rows[0].state_id;
           const values = [
            newReservation._user_id,
            newReservation._restaurant_id,
            state_id,
            newReservation._res_size,
            newReservation._due_date,
            newReservation._comment
        ]
        const insertResult = await pool.query(insertQuery, values);
        newReservation._id = insertResult.rows[0].reservation_id;
        return newReservation;
        }catch(error){
            throw new Error(`error creatig reservation ${error.message}`)
        }
        
        
    }
    async confirmReservation(restaurant_id:string, tables: string[], reservation_id:string){
       const addTableToReservation:string = 'insert into reservation_table (table_id, reservation_id) values ($1, $2) '
    const tablesReserved = [];

    try {
        for (const table of tables) {
            const resultTable = await pool.query(addTableToReservation, [table])
        }

    }
        catch(error){
            throw new Error(`Error confirmaing reservation: ${error.message}`)
        }


    }

    async getRestaurantReservations(restaurant_id: string): Promise<ReservationsDTO[]>{
        const queryText:string = 'select r.reservation_id, r.user_id, r.restaurant_id, s.state_name, r.res_size, r.due_date, r.res_date, r.comment\
        from reservations r inner join states s on r.state_id = s.state_id where r.restaurant_id = $1'
        const tablesQueryText = 'select t.table_id, t.table_number, t.capacity, r.restaurant_id from tables t inner join reservation_table rt on t.table_id = rt.table_id where rt.reservation_id = $1';
        try{
            const result = await pool.query(queryText, [restaurant_id]);
            console.log(result);
            let reservations: ReservationsDTO[]  = result.rows.map(row =>{ new ReservationsDTO(row.reservation_id, row.user_id, row.restaurant_id, row.state_name, row.res_size, 
                    row.due_date, row.res_date, row.comment) 
                })
           await reservations.forEach(reservation =>{
                const queryTable =  pool.query(tablesQueryText, [reservation._id]);
                const tables: TableDTO[] = queryTable.rows.map(row =>{new TableDTO(row.table_id, row.table_number, row.capacity, row.restaurant_id)})
                for(let i=0; i< tables.length; i++){
                    reservation._tables.push(tables[i]);
                }
            })
            return reservations;
        }catch(error){
            throw new Error(`error getting reservations ${error.message}`);
        }

    }


}