const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        console.log("Token", token);
        const verifiedToken = jwt.verify(token, process.env.JWT_KEY);
        request.userData = verifiedToken;
        next();
    } catch (error) {
        return response.status(401).json({
            message: 'Authentification failed'
        });
    }

}