import { Injectable } from "@nestjs/common";
import { ReservationsRepository } from "./reservations.repository";
import { ReservationsDTO } from "./reservationsDTO";
import { TableDTO } from "src/restaurants/tableDTO";

@Injectable()
export class ReservationsService{
    constructor(public resevationsRepository: ReservationsRepository){};
    createReservation(newReservation: ReservationsDTO){
       return this.resevationsRepository.createReservation(newReservation);
    }
    cofirmReservation(restaurant_id:string, tables:string[], reservation_id:string){
       return this.resevationsRepository.confirmReservation(restaurant_id, tables, reservation_id);
    }
   async getRestaurantReservations(restaurant_id:string): Promise<ReservationsDTO[]>{
        return await this.resevationsRepository.getRestaurantReservations(restaurant_id);
    }
}