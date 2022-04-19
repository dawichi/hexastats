import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { User } from 'src/interfaces'

const url = 'https://jsonplaceholder.typicode.com/users'

@Injectable()
export class UsersService {
    constructor(private httpService: HttpService) {}

    // GET all users
    getUsers(): Observable<AxiosResponse<User[]>> {
        return this.httpService.get(url)
    }

    // GET user by id
    getUserbyId(id: number): Observable<AxiosResponse<User>> {
        return this.httpService.get(`${url}/${id}`)
    }
}
