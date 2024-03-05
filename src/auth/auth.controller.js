import bcryptjs from 'bcryptjs'
import User from '../users/user.model.js'
import { generateJWT } from '../helpers/generate-jwt.js'

export const login = async (req, res) =>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({
                msg: 'Invalid credentials, email doesnt exist in the db'
            })
        }
        if(!user.state){
            return res.status(400).json({
                msg: "User doesnt exist in database"
            })
        }
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Wrong password'
            })
        }
        const token = await generateJWT(user.id);
        const roleM = user.role

        res.status(200).json({
            msg: `Login ok, you loged with role: ${roleM}`,
            user,
            token
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Comunicate with admin NOW'
        })
    }
}