import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { UserService } from './users.services';
import { UserDTO } from './usersDTO';
import * as argon2 from "argon2";
import { Response} from 'express';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { RestaurantsDTO } from 'src/restaurants/restaurantsDTO';



@Controller('users')
export class UsersController {
    constructor(public userService: UserService) {
    };
    @Get()
    async listUsers(@Res() res: Response) {
        const users: UserDTO[] = await this.userService.getAll();
        const transformedUsers = users.map(user => ({
            id: user._id,
            userName: user._userName,
            firstName: user._firstName,
            lastName: user._lastName,
            email: user._email,
            dni: user._dni,
            reservations: user._reservations,
            favourites: user._favourites.map(favorite => ({
                id: favorite._id,
                name: favorite._name,
                adress: favorite._adress,
            })),
            role: user._role,
        }));
        res.setHeader('Content-Type', 'application/json');
        res.send(transformedUsers);
    }
    @Post()
    async createUser(@Body() jsonData: any) {
        const hashedPass = await argon2.hash(jsonData.password);
        const newUser = new UserDTO(null, jsonData.userName, jsonData.firstName, jsonData.lastName, jsonData.email,
            jsonData.dni, null, null, jsonData.role, hashedPass);
        const res = await this.userService.create(newUser);
        return {
            "message": "created",
            "id": res.id
        }
    }
  
    @Post("/email")
    async getByEmail(@Body() jsonData: any, @Res() res: Response) {
        const password = jsonData.password;
        try {
            const hashedPass = await this.userService.getHashedPass(jsonData.email);
    
            if (await argon2.verify(hashedPass, password)) {
                const user: UserDTO | any = await this.userService.getByEmail(jsonData.email);
                if (user) {
                    // Autenticación exitosa
                    return res.status(HttpStatus.OK).json({ 
                        message: 'Login successful',
                        id: user._id
                    });
                }
            } else {
                throw new UnauthorizedException('Wrong password');
            }
        } catch (error) {
            // Manejo de errores
            if (error instanceof UnauthorizedException) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: Wrong password' });
            } else {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `${error.message}` });
            }
        }
    }
@Post("/favorites")
async addToFavourites(@Body() data: any){
    try {
        const idFav = await this.userService.addFauvorites(data.user_id, data.restaurant_id);
        return {
            "message": "created",
            "id": idFav
        }
    } catch (error) {
        return {
            "message": "error adding fav",
            "error": error.message
        }
    }
}
@Get("/favorites/get/:id")
async getfavbyId(@Param('id') id: string) {
    try {
        const result: RestaurantsDTO[] | undefined = await this.userService.getFavouritsById(id);

        if (!result) {
            throw new Error('Favourites not found');  // Lanzar un error si no se encuentran favoritos
        }

        let transformedResto = result.map(restaurant => ({
            restaurant_id: restaurant._id,
            name: restaurant._name,
            address: restaurant._adress
        }));
        
        return transformedResto;
    } catch (error) {
        return {
            message: `Error getting favourites: ${error.message}`
        };
    }
}
@Post('fav/delete')
async deleteFavorites(@Body() data:any){
    try{
        const result = await this.userService.deleteFavourite(data.user_id, data.restaurant_id);
        return {
            message: result
        }
    }catch(error){
        return{
        message: `Error deleting ${error.message}`
        }
    }
}

}
