const jwt = require('jsonwebtoken')
process.env.JWT_KEY = 'secret'
module.exports = (req, res, next) => {
    try{
        // From body
        // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);

        // from Headers
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.userData = decoded;
        next();
    } catch(error)
    {
        return res.status(401).json({
            message: "Auth failed!"
        })
    }
}