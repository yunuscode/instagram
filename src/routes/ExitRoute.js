const { Router } = require('express')
const router = Router()


router.get('/', (request, response) => {
    response.clearCookie('token').redirect('/login')
})


module.exports = {
    path: "/exit",
    router: router
}