import { TableDTO } from "src/restaurants/tableDTO";

export class ReservationsDTO{
    _id: string | null;
    _user_id: string;
    _restaurant_id: string;
    _state: string;
    _res_size: number;
    _due_date: string;
    _res_date: string;
    _comment: string;
    _tables?: TableDTO[];
    constructor(id: string | null, user_id: string, restaurant_id:string, state:string, res_size:number, due_date:string, res_date:string, comment: string,tables?:TableDTO[]){
        this._id=id;
        this._user_id = user_id;
        this._restaurant_id = restaurant_id;
        this._state = state;
        this._res_size = res_size;
        this._due_date = due_date;
        this._res_date = res_date;
        this._comment = comment
        this._tables = tables || [];
    }
}