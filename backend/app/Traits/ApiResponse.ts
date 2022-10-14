import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ApiResponse {

    /**
     * Return a success JSON response.
     *
     * @param ctx @ioc:Adonis/Core/HttpContext
     * @param  data string
     * @param  message string
     * @param  code int
     */
	public success(ctx: HttpContextContract, data: any, message: string = '', code: number = 200)
	{
        return ctx.response
            .status(code)
            .send({
                status: true,
                message: message,
                data: data
            })
	}

	/**
     * Return an error JSON response.
     *
     * @param ctx @ioc:Adonis/Core/HttpContext
     * @param  data string
     * @param  message string
     * @param  code int
     */
	public error(ctx: HttpContextContract, message: string = '', code: number = 400, data: any = null)
	{
        return ctx.response
            .status(code)
            .send({
                status: false,
                message: message,
                data: data
            })
	}

}