import { Controller, Get, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from 'src/interfaces'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers(@Query() Query): Promise<User[]> {
        const { limit, offset } = Query
        return this.usersService.getUsers()
    }
}
