import jwt from 'jsonwebtoken';
import User from '../users/user.model.js'

export const validateJWT = async (req, res, next) =>{
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is no token in the petition'
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);
        if(!user){
            return res.status(401).json({
                msg: 'User doesnt exist in database'
            })
        }
        if(!user.state){
            return res.status(401).json({
                msg: 'The user has a false state'
            })
        }
        req.user = user;
        next();
    } catch (e) {
        console.log(e),
        res.status(401).json({
            msg: 'Not valid token'
        })
    }
}