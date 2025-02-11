const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).json({ message: "Unauthorized", success: false });
            } else {
                // Assign the decoded user ID to the request object
                req.body.userId = decoded.id;
                // Ensure to call next() to proceed to the next middleware
                next();
            }
        })
    } catch (error) {

        return res.status(401).send({
            message: "Authentication failed",
            success: false
        })
    }

};
