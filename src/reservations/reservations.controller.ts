import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsDTO } from './reservationsDTO';
import { Response } from 'express'
import { transcode } from 'buffer';

@Controller('reservations')
export class ReservationsController {
    constructor(public reservationsService: ReservationsService){}

    @Post("/create")
     async createReservarion(@Body() data:any){
        const newRservation = new ReservationsDTO(null, data.user_id, data.restaurant_id, data.state, data.res_size, data.due_date, 
            data.res_date, data.comment)
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
    @Get("/get/:id")
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
}
