import { ReservationsDTO } from "src/reservations/reservationsDTO";
import { RestaurantsDTO } from "src/restaurants/restaurantsDTO";

export class UserDTO{
     _id: string;
    
     _firstName: string;
     _lastName: string;
     _email: string;
     _dni: string;
     _hashedPass?: string;
     _reservations: Array<ReservationsDTO>;
     _favourites: Array<RestaurantsDTO>;
     _role: string; 

    constructor(id: string | null, firstName: string, lastName: string,
        email:string, dni: string, reservations: Array<ReservationsDTO> | null,
        favourites: Array<RestaurantsDTO> | null, role: string, hashedPass?: string 
        ){
            this._id = id;
            this._firstName = firstName;
            this._lastName = lastName;
            this._email = email;
            this._dni = dni;
            this._reservations = reservations;
            this._favourites = favourites;
            this._role = role;
            this._hashedPass = hashedPass;
    }
    get id():string | null {
        return this._id;
    }
    set id(id:string){
        this._id = id;
    }
    get firstName(): string{
        return this._firstName
    }
    set firstName(firstName: string){
        this._firstName = firstName;
    }
    get lastName(): string{
        return this._lastName;
    }
    set lastName(lastName: string ){
        this._lastName = lastName;
    }
    get email(): string{
        return this._email;
    }
    set email(email: string){
        this._email = email;
    }
    get dni(): string{
        return this._dni;
    }
    set dni(dni: string){
        this._dni = dni;
    }
    get hashedPass(): string | undefined {
        return this._hashedPass;
    }
    
    set hashedPass(hashedPass: string | undefined) {
        this._hashedPass = hashedPass;
    }
    
    // Getter and Setter for reservations
    get reservations(): Array<ReservationsDTO> {
        return this._reservations;
    }
    
    set reservations(reservations: Array<ReservationsDTO>) {
        this._reservations = reservations;
    }
    
    // Getter and Setter for favourites
    get favourites(): Array<RestaurantsDTO> {
        return this._favourites;
    }
    
    set favourites(favourites: Array<RestaurantsDTO>) {
        this._favourites = favourites;
    }
    
    // Getter and Setter for role
    get role(): string {
        return this._role;
    }
    
    set role(role: string) {
        this._role = role;
    }
}