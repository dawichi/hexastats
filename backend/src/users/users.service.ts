import { Injectable } from '@nestjs/common'
import { User } from 'src/interfaces'

const url = 'https://jsonplaceholder.typicode.com/users'

@Injectable()
export class UsersService {
    // GET all users
    getUsers(): Promise<any> {
        return fetch(url).then(res => res.json())
    }

    // GET user by id
    getUser(id: number): Promise<any> {
        return fetch(`${url}/${id}`).then(res => res.json())
    }
}
