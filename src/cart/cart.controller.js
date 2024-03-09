'use strict';

import CartProduct from '../cart/cartProduct.model.js'
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import User from '../users/user.model.js'
import Category from '../category/category.model.js';
import { response } from 'express';
import jwt from 'jsonwebtoken'
import Bill from '../bill/bill.model.js';
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
        const cartProduct = new CartProduct({product: product.id, quantity: quantity, user: user._id, cart: cart._id});
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
export const deleteFromCart = async (req, res) =>{
    const { id } = req.params;
    const token = req.header('x-token');
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid);

        const cart = await Cart.findOne({ user: user._id });
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        if(cart.user.toString() !== user._id.toString()){
            throw new Error('This is not your cart')
        }
        const cartProduct = await CartProduct.findById(id)
        if(!cartProduct){
            return res.status(404).json({ message: 'Product from Cart not found' });
        }

        const product = await Product.findById(cartProduct.product);
        product.stock += cartProduct.quantity

        await product.save();

        await CartProduct.findByIdAndDelete(id);
        await Cart.updateMany({products: id}, {$pull:{products: id}});

        cart.totalPrice -= cartProduct.quantity * product.price;

        await cart.save();

        res.status(200).json({
            msg: 'Product from Cart eliminated',
            cartProduct
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

export const purchaseCart = async (req, res) =>{
    const { id } = req.params;
    const token = req.header('x-token');
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const cart = await Cart.findOne({ _id : id });
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        if(cart.user.toString() !== user._id.toString()){
            throw new Error('This is not your cart')
        }
        const bill = new Bill ({user: user._id, cart: cart._id})
        await bill.save();

        const cartProducts = await Promise.all(cart.products.map(async(cartProduct) =>{
            const productC = await CartProduct.findById(cartProduct)
            const product = await Product.findById(productC.product);

            product.timesSold += productC.quantity;

            const category = await Category.findById(product.category);

            if(!category){
                return res.status(404).send({message: 'Category not found'});
            }
            
            await product.save();
            return{
                _id: productC._id,
                product: product.name,
                description: product.description,
                category: category ? category.name: 'Category not found',
                price: product.price,
                quantity: productC.quantity
            }
        }))

        res.status(200).json({
            bill: {
                msg: 'Thank you four your Purchase, here is your bill: ',
                _id: bill._id,
                state: bill.state,
                date: bill.date,
                user: user ? user.name : 'User not found',
                email: user ? user.email: 'Email not found',
                role: user ? user.role: 'Role not found',
                products: cartProducts,
                totalPrice: cart.totalPrice,
            }
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}