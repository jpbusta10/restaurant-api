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
    async confirmReservation(restaurant_id: string, tables: number[], reservation_id: string, state: string) {
        const getTableIdQuery = 'select table_id from tables where table_number = $1'
        const addTableToReservation:string = 'insert into reservation_table (table_id, reservation_id) values ($1, $2)';
        const queryState = 'select state_id from states where state_name = $1';
        const reservationStateChange = 'update reservations set state_id = $1 where reservation_id = $2';
    
        const client = await pool.connect(); 
    
        try {
            await client.query('BEGIN'); 
    
            const stateQuery = await client.query(queryState, [state]);
            if(stateQuery.rowCount=== 0){
              throw new Error(`invalid state: ${state}` )
            }
            const state_id = stateQuery.rows[0].state_id;
    
            await client.query(reservationStateChange, [state_id, reservation_id]);
    
            for (const table of tables) {
                let tableIdResult = await client.query(getTableIdQuery, [table]);
                if(tableIdResult.rowCount === 0){
                  throw new Error(`invalid table: ${table}`)
                }
                let tableId = tableIdResult.rows[0].table_id;
                await client.query(addTableToReservation, [tableId, reservation_id]);
            }
    
            await client.query('COMMIT'); 
        } catch (error) {
            await client.query('ROLLBACK'); 
            throw new Error(`Error confirming reservation: ${error.message}`);
        } finally {
            client.release(); 
        }
    }
    

    async getRestaurantReservations(restaurant_id: string): Promise<ReservationsDTO[]> {
        const queryText: string =
          'select r.reservation_id, r.user_id, r.restaurant_id, s.state_name, r.res_size, r.due_date, r.res_date, r.comment \
          from reservations r inner join states s on r.state_id = s.state_id where r.restaurant_id = $1';
        const tablesQueryText =
          'select t.table_id, t.table_number, t.capacity, t.restaurant_id from tables t inner join reservation_table r on t.table_id = r.table_id where r.reservation_id = $1';
        try {
          const result = await pool.query(queryText, [restaurant_id]);
          let reservations: ReservationsDTO[] = result.rows.map((row) => {
            return new ReservationsDTO(
              row.reservation_id,
              row.user_id,
              row.restaurant_id,
              row.state_name,
              row.res_size,
              row.due_date,
              row.res_date,
              row.comment
            );
          });
      
          for (const reservation of reservations) {
            const queryTable = await pool.query(tablesQueryText, [reservation._id]);
            const tables: TableDTO[] = queryTable.rows.map((row) => {
              return new TableDTO(row.table_id, row.table_number, row.capacity, row.restaurant_id);
            });
      
            reservation._tables.push(...tables);
          }
      
          return reservations;
        } catch (error) {
          throw new Error(`error getting reservations ${error.message}`);
        }
      }

      async getReservationsByUser(user_id: string): Promise<ReservationsDTO[]> {
        const queryText = 'SELECT r.reservation_id, r.restaurant_id, s.state_name, r.res_size, r.due_date, r.res_date, r.comment \
                           FROM reservations r \
                           INNER JOIN states s ON r.state_id = s.state_id \
                           WHERE r.user_id = $1';
    
        try {
            const result = await pool.query(queryText, [user_id]);
            const reservations = result.rows.map(row =>
                new ReservationsDTO(
                    row.reservation_id,
                    user_id,
                    row.restaurant_id,
                    row.state_name,
                    row.res_size,
                    row.due_date,
                    row.res_date,
                    row.comment
                )
            );
            return reservations;
        } catch (error) {
            throw new Error(`Error getting reservations: ${error.message}`);
        }
    }
    async getbyId(reservation_id: string): Promise<ReservationsDTO> {
      const queryText = 'SELECT r.user_id, r.restaurant_id, r.res_size, s.state_name, r.due_date, r.res_date, r.comment \
                        FROM reservations r \
                        INNER JOIN states s ON r.state_id = s.state_id \
                        WHERE r.reservation_id = $1';
      const tablesQueryText = 'select t.table_id, t.table_number, t.capacity, t.restaurant_id from tables t \
                        inner join reservation_table r on t.table_id = r.table_id where r.reservation_id = $1';
  
      try {
          const resultReservation = await pool.query(queryText, [reservation_id]);
          
  
          if (resultReservation.rows.length === 0) {
              throw new Error('Reservation not found');
          }
          
          const reservation = resultReservation.rows[0];
          const reservations = new ReservationsDTO(
              reservation.reservation_id,
              reservation.user_id,
              reservation.restaurant_id,
              reservation.state_name,
              reservation.res_size,
              reservation.due_date,
              reservation.res_date,
              reservation.comment
          );
          const resultTables = await pool.query(tablesQueryText, [reservation_id]);
          const tables = resultTables.rows.map(row=>(new TableDTO(row.table_id, row.table_number, row.capacity)));
          reservations._tables = tables;
  
          return reservations;
      } catch (error) {
          throw new Error(`Error getting reservation by ID: ${error.message}`);
      }
  }
  async getTablesReservedByDate(restaurant_id:string, due_date: string){
    const queryText = "SELECT t.table_number, t.table_id, t.capacity\
    FROM reservations r\
    INNER JOIN reservation_table rt ON r.reservation_id = rt.reservation_id\
    INNER JOIN tables t ON rt.table_id = t.table_id\
    INNER JOIN states s ON r.state_id = s.state_id\
    WHERE r.restaurant_id = $1 AND s.state_name = 'confirmed' AND r.due_date = $2;"
    try{
      const result = await pool.query(queryText, [restaurant_id, due_date]);
      if(result.rowCount === 0 ){
        throw new Error('no tables reserved');
      }
      const tables = result.rows.map(row=>new TableDTO(row.table_id, row.table_number, row.capacity));
      return tables;
    }catch(error){
      throw new Error(error.message)
    }

  }

}