const { checkJWTToken } = require('../modules/jwt')


module.exports = async function (request, response, next) {
    let token = request.cookies?.token
    token = checkJWTToken(token)
    if(!token) {
        response.redirect('/login')
        return 0
    } else {
        request.user = token
    }
    next()
}