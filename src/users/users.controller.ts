import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './users.services';
import { UserDTO } from './usersDTO';
import * as argon2 from "argon2";



@Controller('users')
export class UsersController {
    constructor(public userService: UserService){
    };
    @Get()
    async listUsers(){
        const users: UserDTO[] = await this.userService.getAll();
        const jsonArray = JSON.stringify(users);
        return jsonArray;
    }
    @Post()
    async createUser(@Body() jsonData: any){
        const hashedPass = await argon2.hash(jsonData.password);
        const newUser = new UserDTO(null, jsonData.userName, jsonData.firstName, jsonData.lastName, jsonData.email,
            jsonData.dni, null, null, jsonData.role, hashedPass);
        const res = await this.userService.create(newUser);
        return {
            "message": "created",
            "id": res.id
        }
    }
    
    
}
