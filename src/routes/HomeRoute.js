const { Router } = require('express')

const router = Router()


router.get('/', (request, response) => {
    response.render('index', {
        title: "Homepage"
    })
})


module.exports = {
    path: "/",
    router: router
}