import { response, request} from 'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js'

export const usersGet = async (req = request, res = response) =>{
    const { limit, from} = req.query;
    const query = {state: true};
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        users
    })
}

export const usersPost = async (req, res) =>{
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});
    
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user
    })
}