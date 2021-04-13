const { Router } = require('express')
const { createUser, updateDate } = require('../models/UserModel')
const { generateCrypt } = require('../modules/bcrypt')
const { genereteJWTToken } = require('../modules/jwt')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const Joi = require('joi')

const router = Router()

const RegistrationValidation = new Joi.object({
    phone: Joi.number()
        .min(10000)
        .max(999999999999)
        .error(new Error("Phone number is incorrect"))
        .required(),
    name: Joi.string()
        .min(3)
        .max(32)
        .error(new Error("Name is incorrect"))
        .required(),
    username: Joi.string()
        .alphanum()
        .min(6)
        .max(16)
        .error(new Error("Username is incorrect"))
        .required(),
    password: Joi.string()
        .min(6)
        .max(32)
        .error(new Error("Password is incorrect"))
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
})

const BirthDate = new Joi.object({
    bmonth: Joi.string()
        .required()
        .error(new Error("Birth Month error"))
        .trim(),
    bday: Joi.number()
        .min(1)
        .max(31)
        .error(new Error("Birth day error"))
        .required(),
    byear: Joi.number()
        .min(1930)
        .max(2017)
        .error(new Error("Birth year error"))
        .required()
})


router.get('/', (request, response) => {
    response.render('registration', {
        title: "Sign Up Page"
    })
})

router.post('/', async (request, response) => {
    try {
        const { phone, name, username, password } = await RegistrationValidation.validateAsync(request.body)
        const user = await createUser(phone, name, username, generateCrypt(password))
        let token = genereteJWTToken({
            _id: user._id,
            name: user.name,
            username: user.username,
        })
        response.cookie('token', token).redirect('/signup/bdate')
    }
    catch(e){
        if(String(e).includes("duplicate key")){
            e = "Phone or username is not available"
        }
        response.render('registration', {
            title: "Sign up",
            error: e + ""
        })
    }
})

router.get('/bdate', AuthMiddleware, async (request, response) => {
    response.render('bdate', {
        title: "Birthdate page",
    })
})

router.post('/bdate', AuthMiddleware, async (request, response) => {
    try {
        let data = await BirthDate.validateAsync(request.body)
        let update = await updateDate(request.user._id, data)
        response.redirect('/')
    }
    catch(e){
        response.render('bdate', {
            title: "Birthdate page",
            error: e + ""
        })
    }
})


module.exports = {
    path: "/signup",
    router: router
}