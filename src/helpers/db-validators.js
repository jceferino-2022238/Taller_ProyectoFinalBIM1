import User from '../users/user.model.js';
import Category from '../category/category.model.js';
import Product from '../product/product.model.js';
import Cart from '../cart/cart.model.js'
import CartProduct from '../cart/cartProduct.model.js';
import Bill from '../bill/bill.model.js';
export const exEmail = async (email = '') =>{
    const existsEmail = await User.findOne({email});
    if(existsEmail){
        throw new Error(`The email ${email} is already registered`)
    }
}

export const exPName = async (name = '') =>{
    const existsProduct = await Product.findOne({name});
    if(existsProduct){
        throw new Error(`The product ${name} is already registered`)
    }
}

export const exCName = async (name = '') =>{
    const existsCategory = await Category.findOne({name});
    if(existsCategory){
        throw new Error(`The category ${name} is already registered`)
    }
}

export const exUserById = async (id = '') =>{
    const existsUserById = await User.findById(id);
    if(!existsUserById){
        throw new Error(`Id ${id} doesnt exist`)
    }
}

export const exCategoryById = async (id = '') =>{
    const existsCategoryById = await Category.findById(id);
    if(!existsCategoryById){
        throw new Error(`Id ${id} doesnt exist`)
    }
}

export const exProductById = async (id = '') =>{
    const existsProductById = await Product.findById(id);
    if(!existsProductById){
        throw new Error(`Id ${id} doesnt exist`)
    }
}

export const exCartById = async (id = '') =>{
    const existsCartById = await Cart.findById(id);
    if(!existsCartById){
        throw new Error(`Id ${id} doesnt exist`)
    }
}

export const exCartPById = async (id = '') =>{
    const existsCartById = await CartProduct.findById(id);
    if(!existsCartById){
        throw new Error(`Id ${id} doesnt exist`)
    }
}

export const exBillById = async (id='') =>{
    const existsBillById = await Bill.findById(id);
    if(!existsBillById){
        throw new Error(`Id ${id} doesnt exist`)
    }
}