const client = require('../modules/mongo')
const Schema = require('mongoose').Schema

const UserSchema = new Schema({
    phone: {
        type: Number,
        index: true,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    bdate: {
        bmonth: {
            type: String,
        },
        bday: {
            type: Number,
        },
        byear: {
            type: Number,
        }
    }
})

async function UserModel () {
    let db = await client()
    return await db.model('users', UserSchema)
}

async function createUser(phone, name, username, password) {
    const db = await UserModel()
    return await db.create({
        phone, name, username, password
    })
}

async function updateDate(objectId, bdate){
    const db = await UserModel()
    return await db.updateOne({ _id: objectId }, { bdate })
}

async function findUser(login) {
    let object = ((typeof login) == "string") ? { username: login } : { phone: login }
    
    const db = await UserModel()
    return await db.findOne(object)
}

module.exports = {
    createUser,
    updateDate,
    findUser
}