import { response, request} from 'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js'
import Cart from '../cart/cart.model.js'
import Bill from '../bill/bill.model.js';
import jwt from 'jsonwebtoken'
import CartProduct from '../cart/cartProduct.model.js';
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';
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
    const {name, email, password} = req.body;
    const user = new User({name, email, password});
    
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    await user.save();

    const cart = new Cart({user : user._id})
    
    await cart.save();

    res.status(200).json({
        user,
        cart
    })
}

export const newUser = async(req, res) =>{
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    await user.save();

    if(user.role == 'CLIENT_ROLE'){
        const cart = new Cart({user : user._id})
    
        await cart.save();
        res.status(200).json({
            user,
            cart
        })
    }
    res.status(200).json({
        user
    })
}

export const userPut = async(req, res) =>{
    const { id } = req.params;
    const {_id, password, ...rest} = req.body;
    const user = await User.findOne({_id: id})
    await User.findByIdAndUpdate(id, rest);
    res.status(200).json({
        msg: 'User updated',
        user
    })
}
export const putMyUser = async(req, res) =>{
    const { id } = req.params;
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
    if(user._id.toString() !== id.toString()){
            throw new Error('This is not your user')
    }
    const {_id, password, role, ...rest} = req.body;

    const userE = await User.findOne({_id: id})
    await User.findByIdAndUpdate(id, rest);
    res.status(200).json({
        msg: 'User updated',
        userE
    })
}
export const getMyShoppingH = async (req, res) =>{
    const token = req.header('x-token');
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const bills = await Bill.find({ user: user._id})
        if(!bills){
            return res.status(404).json({ message: 'Bills from user not found' });
        }
        for (const bill of bills) {
            const cart = await Cart.findById(bill.cart)
            const cartProducts = await Promise.all(cart.products.map(async(cartProduct) =>{
                const productC = await CartProduct.findById(cartProduct)
                const product = await Product.findById(productC.product);
                
                return{
                    _id: productC._id,
                    product: product.name,                
                    price: product.price,
                    quantity: productC.quantity
                }
            }));
            res.status(200).json({
                ShoppingHistorial: {
                    products: cartProducts
                }
            })
        }
        
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}