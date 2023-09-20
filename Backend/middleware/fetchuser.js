const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Tushar';

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.cookies['auth-Token'];
    if (!token) {
        res.status(404).send({ error: "No token is recieved" })
    }
    try {
        // console.log(token)
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.userr.id;
        // console.log(data.userr.id);
        next();

    } catch (error) {
        // res.status(401).send({ error: "Please authenticate using a valid token" })
        res.json({message: "Please authenticate using valid token"})
    }

}


module.exports = fetchuser;