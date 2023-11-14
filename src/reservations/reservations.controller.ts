import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsDTO } from './reservationsDTO';
import { Response } from 'express'


@Controller('reservations')
export class ReservationsController {
    constructor(public reservationsService: ReservationsService){}

    @Post("/create")
     async createReservarion(@Body() data:any){
        const newRservation = new ReservationsDTO(null, data.user_id, data.restaurant_id, data.state, data.res_size, data.due_date, 
        null, data.comment)
        try{
        const responseRepo: ReservationsDTO = await this.reservationsService.createReservation(newRservation); 
        
        return{
            "message": "created",
            "id": responseRepo._id
        }
        }catch(error){
            return {
                "message": `${error.message}`
            }
        }
    }
    @Get("/restaurant/:id")
   async listReservationByResto(@Param('id')id:string){
        try{
        const reservations:ReservationsDTO[] = await this.reservationsService.getRestaurantReservations(id);
        let trasformdReservations = reservations.map(reservation=>({
            id: reservation._id,
            user_id: reservation._user_id,
            state: reservation._state,
            res_size: reservation._res_size,
            due_date: reservation._due_date,
            tables : reservation._tables,
            comment: reservation._comment
        }));
        return trasformdReservations;
    } catch(error){
        return{
            "error": error.message
        }
    }
   }
   @Post("/confirm")
   async confirReservation(@Body() data:any){
    try{
        const tables = data.tables;
        const response = await this.reservationsService.cofirmReservation(data.restaurant_id, tables, data.reservation_id, data.state);
        return{
            "message": "state change succesfull"
        }
    }catch(error){
        return{
            "message": error.message
        }
    }
   }
   @Get("/get/user/:id")
   async getbyUser(@Param('id') id: string) {
       try {
           const reservations = await this.reservationsService.getReservationsbyUser(id);
           let transformedReservations = reservations.map(reservation => ({
               id: reservation._id,
               user_id: reservation._user_id,
               state: reservation._state,
               res_size: reservation._res_size,
               due_date: reservation._due_date,
               tables: reservation._tables,
               comment: reservation._comment
           }));
           return transformedReservations;
       } catch (error) {
           return {
               message: `Error: ${error.message}`
           }
       }
   }
   @Get("/get/:id")
   async getReservationById(@Param('id') id:string ){
    try{
        const reservation = await this.reservationsService.getById(id);
        let transfortReservation = {
            id: reservation._id,
            user_id: reservation._user_id,
            state: reservation._state,
            res_size: reservation._res_size,
            due_date: reservation._due_date,
            tables: reservation._tables,
            comment: reservation._comment
        }
        return transfortReservation
    }
    catch(error){
        return {
            message: error.message
        }
    }
   }
}
