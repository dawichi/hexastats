import { lastValueFrom, retry } from 'rxjs'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from 'src/interfaces'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers(@Query() Query): Promise<User[]> {
        const { limit, offset } = Query
        return (await lastValueFrom(this.usersService.getUsers())).data
    }

    @Get('/:id')
    async getUserbyId(@Param('id') id: number): Promise<User> {
        return (await lastValueFrom(this.usersService.getUserbyId(id))).data
    }
}
