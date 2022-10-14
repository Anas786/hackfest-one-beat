/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

/**
 * Open Routes
 */
 Route.group(() => {

	Route.post('/auth/login', 'AuthController.login')

}).namespace('App/Controllers/Http/V1').prefix('/api/v1')

/**
 * Restricted Routes
 */
 Route.group(() => {

	/** USER ROUTES */
	Route.get('/users', 'UsersController.index')
	Route.get('/users/:id', 'UsersController.index')

	/** ROLES ROUTES */
	Route.get('/roles', 'RolesController.index')

	/** CATEGORIES ROUTES */
	Route.get('/categories', 'CategoriesController.index')
	Route.get('/categories/:id', 'CategoriesController.index')
	Route.get('/categories/:id/roles', 'CategoriesController.roles')

	/** DEGREES ROUTES */
	Route.get('/degrees', 'DegreesController.index')

	/** FACILITY TYPES ROUTES */
	Route.get('/facility_types', 'FacilityTypesController.index')

	/** SPECIALTIES ROUTES */
	Route.get('/specialties', 'SpecialtiesController.index')
	
}).namespace('App/Controllers/Http/V1').prefix('/api/v1').middleware(['auth:api'])
