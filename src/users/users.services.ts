import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UserDTO } from "./usersDTO";

@Injectable()
export class UserService{
    constructor(public userRepository: UsersRepository){
    }

    getAll(): Promise<UserDTO[]>{
        return this.userRepository.getAll();
    }

     create(newUser: UserDTO){
       return this.userRepository.createUser(newUser);
    }
    getByEmail(email:string){

        return this.userRepository.getUserByEmail(email);

    }
    getHashedPass(email: string){
        return this.userRepository.getHashedPassword(email);
    }
    addFauvorites(userId:string, )
    


}