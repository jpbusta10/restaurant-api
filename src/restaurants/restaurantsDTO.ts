import { UserDTO } from "src/users/usersDTO";
import { TableDTO } from "./tableDTO";

export class RestaurantsDTO{
     _id: string | null;
     _name: string;
     _adress: string;
     _managerId: String;
     _tables?: Array<TableDTO>;
     _categories?: Array<String>;

     constructor(id:string | null, name: string, adress: string, managerId?: String, tables?: Array<TableDTO>, categories?:Array<string>){
        this._id = id;
        this._name = name;
        this._adress = adress;
        this._managerId = managerId;
        this._tables = tables;
        this._categories = categories;

     }
}