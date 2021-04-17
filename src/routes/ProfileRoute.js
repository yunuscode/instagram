const {
    Router
} = require('express')
const UserMiddleware = require('../middlewares/UserMiddleware')
const upload = require('express-fileupload')
const fs = require('fs/promises')
const fsOld = require('fs')
const path = require('path')
const { findUser } = require('../models/UserModel')
const { myFollowers, findFollower, addFollower, deleteFollower } = require('../models/FollowerModel')


const router = Router()

router.use(UserMiddleware)


router.get('/', UserMiddleware, async (request, response) => {
    let user = await findUser(request.user.username)
    let followers = await myFollowers(request.user._id)
    // console.log(followers);
    const photoPath = path.join(__dirname, "..", "public", "avatar", `${request.user._id}.jpg`)
    let isExist = fsOld.existsSync(photoPath)
    response.render('index', {
        title: "Homepage",
        photo: isExist,
        user: user
    })
})



router.post('/follow', UserMiddleware, async (request, response) => {
    try {
        const { username } = request.body
        let { _id: follow_id } = await findUser(username)
        let { _id: user_id } = request.user

        let followOld = await findFollower(user_id, follow_id)
        if(followOld) {
            await deleteFollower(user_id, follow_id)
        } else {
            await addFollower(user_id, follow_id)
        }


        response.status(200).send({
            ok: true,
            message: "Following created",
            followOld: followOld ? true : false
        })
    }
    catch(e){
       response.status(400).send({
           ok: false,
           message: "Bad request"
       }) 
    }
})

router.get('/followers', async (request, response) => {
    try {
        const { username } = request.query
        let { _id } = await findUser(username)
        let followers = await myFollowers(_id)
        followers = await followers.map(follower => {
            const photoPath = path.join(__dirname, "..", "public", "avatar", `${follower.user_id}.jpg`)
            let isExist = fsOld.existsSync(photoPath)
            return {
                id: follower.user[0]._id,
                name: follower.user[0].name,
                username: follower.user[0].username,
                isExist
            }
        })

        console.log(followers);
    }
    catch(e){

        response.status(400).send({
            ok: false
        })
    }
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


router.get('/:username', UserMiddleware, async (request, response) => {
    const {username} = request.params
    let user = await findUser(username)
    let followers = await myFollowers(request.user._id)
    
    let followOld = await findFollower(request.user._id, user._id)
    const photoPath = path.join(__dirname, "..", "public", "avatar", `${request.user._id}.jpg`)
    let isExist = fsOld.existsSync(photoPath)
    response.render('index', {
        title: "Homepage",
        photo: isExist,
        user: user,
        thisUser: request.user,
        oldFollow: followOld ? true : false
    })
})




module.exports = {
    path: "/profile",
    router: router
}