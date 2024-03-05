'use strict';

import Product from '../product/product.model.js'
import Category from '../category/category.model.js'

export const postProduct = async (req, res) =>{
    const data = req.body;

    const category = await Category.findOne({ name: data.category});

    if(!category){
        return res.status(404).send({message: 'Category not found'});
    }

    const product = new Product({
        ...data,
        category: category._id
    });

    await product.save();

    category.products.push(product._id);

    await category.save();

    res.status(200).json({
        msg: 'New product added: ',
        product
    })
}