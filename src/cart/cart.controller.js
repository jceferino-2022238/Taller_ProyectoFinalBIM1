'use strict';

import CartProduct from '../cart/cartProduct.model.js'
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import User from '../users/user.model.js'
import { response } from 'express';
import jwt from 'jsonwebtoken'

export const addToCart = async (req, res) =>{
    const { id } = req.params;
    const data = req.body;
    const token = req.header('x-token');
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid);
        const cart = await Cart.findById(id);
        if(cart.user.toString() !== user._id.toString()){
            throw new Error('This is not your cart')
        }
        const product = await Product.findOne({ name: data.product});
        if(!product){
            return res.status(404).send({message: 'Product not found'});
        }
        if(product.stock < data.quantity){
            return res.status(404).send({message: 'Not enought stock'});
        }
        const quantity = data.quantity
        const cartProduct = new CartProduct({product: product.id, quantity: quantity, user: user._id});
        await cartProduct.save();
        product.stock -= quantity;
        await product.save();

        cart.totalPrice += product.price * data.quantity;
        
        cart.products.push(cartProduct._id);

        
        await cart.save();

        res.status(200).json({
            msg: 'Product added to cart',
            cartProduct,
            msg: 'User cart: ',
            cart
        })
    } catch (e) {
        res.status(500).json({e: 'Couldnt add to cart'})
    }
}

export const getUserCart = async (req, res) =>{
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id)
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        const user = await User.findById(cart.user);
        const cartProducts = await Promise.all(cart.products.map(async(cartProduct) =>{
            const productC = await CartProduct.findById(cartProduct)
            const product = await Product.findById(productC.product);
            return{
                _id: productC._id,
                product: product.name,
                price: product.price,
                quantity: productC.quantity
            }
        }))
        res.status(200).json({
            cart: {
                _id: cart._id,
                user: user ? user.name : 'User not found',
                products: cartProducts,
                totalPrice: cart.totalPrice,
                state: cart.state    
            }
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}
export const buyCartAndBill = async (req, res) =>{

}