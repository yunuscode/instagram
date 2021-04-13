const { verify, sign } = require('jsonwebtoken')

const Path = require('path')
require('dotenv').config({ path: Path.join(__dirname, ".env")})

function genereteJWTToken(data){
    return sign(data, process.env.SECRET_WORD)
}


function checkJWTToken(token) {
    try {
        return verify(token, process.env.SECRET_WORD)
    }
    catch(e) {
        return false
    }
}

module.exports = {
    genereteJWTToken, checkJWTToken
}