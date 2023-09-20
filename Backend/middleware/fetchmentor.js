const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Tushar';

const fetchmentor = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.cookies['auth-Token'];
    if (!token) {
        res.status(404).send({ error: "No token is recieved" })
    }
    try {
        // console.log(token)
        const data = jwt.verify(token, JWT_SECRET);
        req.mentor = data.mentorr.id;
        // console.log(data.userr.id);
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchmentor;