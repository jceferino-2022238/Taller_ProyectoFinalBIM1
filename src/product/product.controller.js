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

export const getProducts = async(req, res) =>{
    const {limit, from} = req.query;
    const query = { state: true}
    try {
        const products = await Product.find(query)
        .skip(Number(from))
        .limit(Number(limit))

        const productC = await Promise.all(products.map(async(product) =>{
            const category = await Category.findById(product.category);
            return{
                ...product.toObject(),
                category: category ? category.name : 'Category not found'
            }
        }))

        const total = await Product.countDocuments(query);

        res.status(200).json({
            total,
            products: productC,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getProductById = async (req, res) =>{
    const { id } = req.params;
    try {
        
    } catch (error) {
        
    }
}