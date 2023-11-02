export class TableDTO{
    _id: string | null
    _number: number;
    _capacity: number;
    _isReserved: boolean;
    _restaurant_id: string;
    constructor(id: string|null,number: number, capacity: number, isReserved: boolean, restaurant_id: string){
        this._id = id;
        this._number = number;
        this._isReserved = isReserved;
        this._capacity = capacity;
        this._restaurant_id = restaurant_id;
    }
}