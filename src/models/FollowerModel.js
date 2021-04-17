const client = require('../modules/mongo')
const Schema = require('mongoose').Schema

const FollowerSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId
    },
    follow_user: {
        type: Schema.Types.ObjectId
    }
})


async function FollowerModel () {
    let db = await client()
    return await db.model('follower', FollowerSchema)
}

async function addFollower(user_id, follow_user){
    const db = await FollowerModel()
    return await db.create({ user_id: user_id, follow_user: follow_user})
}

async function deleteFollower(user_id, follow_user){
    const db = await FollowerModel()
    return await db.deleteOne({ user_id: user_id, follow_user: follow_user})
}

async function myFollowings(user_id){
    const db = await FollowerModel()
    return await db.find({ user_id: user_id })
}

async function myFollowers(user_id){
    const db = await FollowerModel()
    return await db.aggregate([
        {
            $match: {
                follow_user: user_id
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        }
    ])
}

async function findFollower(user_id, follow_user){
    const db = await FollowerModel()
    return await db.findOne({ user_id: user_id, follow_user: follow_user })
}



module.exports = {
    addFollower, deleteFollower, myFollowers, myFollowings, findFollower
}