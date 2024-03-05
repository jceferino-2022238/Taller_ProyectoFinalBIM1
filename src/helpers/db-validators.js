import User from '../users/user.model.js';
import Category from '../category/category.model.js';
export const exEmail = async (email = '') =>{
    const existsEmail = await User.findOne({email});
    if(existsEmail){
        throw new Error(`The email ${email} is already registered`)
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
        throw new Error(`Id ${email} doesnt exist`)
    }
}

export const exCategoryById = async (id = '') =>{
    const existsCategoryById = await Category.findById(id);
    if(!existsCategoryById){
        throw new Error(`Id ${name} doesnt exist`)
    }
}
