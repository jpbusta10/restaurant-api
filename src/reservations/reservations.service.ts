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
    async cofirmReservation(restaurant_id:string, tables:string[], reservation_id:string, state:string){
       return await this.resevationsRepository.confirmReservation(restaurant_id, tables, reservation_id, state);
    }
   async getRestaurantReservations(restaurant_id:string): Promise<ReservationsDTO[]>{
        return await this.resevationsRepository.getRestaurantReservations(restaurant_id);
    }
    async getReservationsbyUser(user_id:string): Promise<ReservationsDTO[]>{
      return await this.resevationsRepository.getReservationsByUser(user_id);
    }
}