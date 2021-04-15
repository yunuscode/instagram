const {
    Router
} = require('express')
const Joi = require('joi')
const {
    checkCrypt
} = require('../modules/bcrypt')
const {
    genereteJWTToken
} = require('../modules/jwt')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const {
    findUser
} = require('../models/UserModel')

const LoginValidation = Joi.object({
    login: Joi.string()
        .required()
        .alphanum()
        .error(new Error('Login is incorrect')),
    password: Joi.string()
        .required()
        .error(new Error("Password is incorrect"))
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

const router = Router()

router.use(AuthMiddleware)

router.get('/', (request, response) => {
    response.render('login', {
        title: "Login"
    })
})

router.post('/', async (request, response) => {
    try {
        let data = await LoginValidation.validateAsync(request.body)
        let user
        let phone_number = Number(data.login)
        if (isNaN(phone_number)) {
            user = await findUser(data.login)
        } else {
            user = await findUser(phone_number)
        }

        if (!user) {
            throw new Error("User is not found")
        }

        let isTrust = checkCrypt(data.password, user.password)

        if (!isTrust) {
            throw new Error("Password is incorrect")
        }

        let token = genereteJWTToken({
            _id: user._id,
            name: user.name,
            username: user.username,
        })


        response
            .cookie('token', token)
            .redirect('/')
    } catch (e) {
        response.render('login', {
            title: "Login",
            error: e + ""
        })
    }
})


module.exports = {
    path: "/login",
    router: router
}