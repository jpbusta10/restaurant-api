import { UserDTO } from "src/users/usersDTO";
import { TableDTO } from "./tableDTO";

export class RestaurantsDTO{
     _id: string;
     _name: string;
     _adress: string;
     _manager?: UserDTO;
     _tables?: Array<TableDTO>;

     constructor(id:string, name: string, adress: string, manager?: UserDTO, tables?: Array<TableDTO>){
        this._id = id;
        this._name = name;
        this._adress = adress;
        this._manager = manager;
        this._tables = tables;

     }
}