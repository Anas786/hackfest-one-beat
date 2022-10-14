import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import ApiResponse from 'App/Traits/ApiResponse'

export default class AuthController extends ApiResponse {

    public async login(ctx: HttpContextContract) {
        const username = ctx.request.input('username')
        const password = ctx.request.input('password')

        try {

            if( username == '' || password == '' ) {
                this.error(ctx, 'Username and password are required')
            }

            const user = await User
                .query()
                .where('user_name', username)
                .where('is_active', true)
                .firstOrFail()

            // Verify password
            if ( !(await Hash.verify(user.password, password)) ) {
                this.error(ctx, 'Invalid password')
            }

            // Generate token
            const token = await ctx.auth.use('api').generate(user, {
                expiresIn: Env.get('USER_TOKEN_EXPIRY')
            })

            await user.load('role')
            await user.load('category')

            this.success(ctx, {
                user: user,
                token: token
            })

        } catch(error) {
            console.log(error)
            this.error(ctx, 'No account found or account is inactive')
        }
    }

}
