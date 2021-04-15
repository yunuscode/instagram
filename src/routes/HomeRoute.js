const {
    Router
} = require('express')
const UserMiddleware = require('../middlewares/UserMiddleware')
const upload = require('express-fileupload')
const fs = require('fs/promises')
const fsOld = require('fs')
const path = require('path')
const { findUser } = require('../models/UserModel')


const router = Router()

router.use(UserMiddleware)


router.get('/', UserMiddleware, async (request, response) => {
    let user = await findUser(request.user.username)
    const photoPath = path.join(__dirname, "..", "public", "avatar", `${request.user._id}.jpg`)
    let isExist = fsOld.existsSync(photoPath)
    response.render('index', {
        title: "Homepage",
        photo: isExist,
        user: user
    })
})

router.post('/photo', upload({
    size: (1024 * 10) * 1024
}), async (request, response) => {
    // console.log(request.files.photo.data);
    try {
        const photoPath = path.join(__dirname, "..", "public", "avatar", `${request.user._id}.jpg`)
        const fileStream = await fs.writeFile(photoPath, request.files.photo.data)
        response.send({
            ok: true
        })
    } catch (e) {
        console.log(e);
        response.send({
            ok: false
        })
    }
})




module.exports = {
    path: "/profile",
    router: router
}