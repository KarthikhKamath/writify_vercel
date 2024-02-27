import User from "../schema/UserSchema.js";
import jwt from "jsonwebtoken";

const getAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            req.authError = "Token Unauthorized";
            // Do not send a response here
        } else {
            const verifyToken = jwt.verify(token, "Karthik");
            console.log("Verify", verifyToken);

            const auth = await User.findById(verifyToken.id);
            console.log(auth);

            req.userId = verifyToken.id;
            req.auth = auth;
        }
        next();
    } catch (err) {
        req.authError = "Other Unauthorized";
        // Do not send a response here
        next();
    }
};

export default getAuth;
