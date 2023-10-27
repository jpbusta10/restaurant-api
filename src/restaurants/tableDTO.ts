export class TableDTO{
    _number: number;
    _capacity: number;
    _isReserved: boolean;
    constructor(number: number, capacity: number, isReserved: boolean){
        this._number = number;
        this._isReserved = isReserved;
        this._capacity = capacity;
    }
}