export class TableDTO{
    _id: string | null
    _number: number;
    _capacity: number;
    _restaurant_id: string;
    constructor(id: string|null,number: number, capacity: number, restaurant_id: string){
        this._id = id;
        this._number = number;
        this._capacity = capacity;
        this._restaurant_id = restaurant_id;
    }
}