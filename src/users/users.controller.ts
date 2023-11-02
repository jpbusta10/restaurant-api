import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { UserService } from './users.services';
import { UserDTO } from './usersDTO';
import * as argon2 from "argon2";
import { Response } from 'express'; 




@Controller('users')
export class UsersController {
    constructor(public userService: UserService){
    };
    @Get()
    async listUsers(@Res() res: Response){
        const users: UserDTO[] = await this.userService.getAll();
         const transformedUsers = users.map(user => ({
            id: user._id,
            userName: user._userName,
            firstName: user._firstName,
            lastName: user._lastName,
            email: user._email,
            dni: user._dni,
            reservations: user._reservations,
            favourites: user._favourites,
            role: user._role,
          }));
        res.setHeader('Content-Type', 'application/json');
        res.send(transformedUsers);
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
    @Get("/email")
    async getByEmail(@Body() JsonData: any){
        const password = JsonData.password;
        const hashed_pass = await this.userService.getHashedPass(JsonData.email);
        console.log(hashed_pass);
        if(await argon2.verify(hashed_pass, password)){
        console.log('verifica!!!');
        const user: UserDTO | any = await this.userService.getByEmail(JsonData.email);
        if(user){
            return user;
        }
        else{
            return {
                message: "No user found with that email" 
            }
        }
    }
    else{
        return{
            message: "wrong password"
        }
    }
    }
    
}