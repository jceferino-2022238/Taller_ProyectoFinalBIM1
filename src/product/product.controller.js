'use strict';

import Product from '../product/product.model.js'
import Category from '../category/category.model.js'
import { response } from 'express';

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


export const getSoldOutProducts = async(req, res) =>{
    const query = {stock: 0}
    try {
        const products = await Product.find(query)

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
export const getMostSoldProducts = async(req, res) =>{
    const query = { state: true};
    const mostSold = {timesSold: -1}
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .sort(mostSold)
    ])
    
    const productC = await Promise.all(products.map(async(product) =>{
        const category = await Category.findById(product.category);
        return{
            ...product.toObject(),
            category: category ? category.name : 'Category not found'
        }
    }))

    res.status(200).json({
        total,
        products: productC,
    });
}
export const getProductById = async (req, res) =>{
    const { id } = req.params;
    try {
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }

        const category = await Category.findById(product.category);

        res.status(200).json({
            product: {
                ...product.toObject(),
                category: category ? category.name : 'Category not found'
            }
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}
export const getProductByName = async (req, res) =>{
    const { name } = req.params;
    try {
        const product = await Product.findOne({name : name})

        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }

        const category = await Category.findById(product.category);

        res.status(200).json({
            product: {
                ...product.toObject(),
                category: category ? category.name : 'Category not found'
            }
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}
export const getProductByCategory = async (req, res) =>{
    const { categoryN } = req.params;
    try {
        const category = await Category.findOne({ name: categoryN})
        if(!category){
            return res.status(404).json({ message: 'Category not found' });
        }
        const products = await Promise.all(category.products.map(async(productsC) =>{
            const product = await Product.findById(productsC);
            return{
                _id: product._id,
                name: product.name,
                description: product.description,
                stock: product.stock,
                price: product.price,
                timesSold: product.timesSold
            }
        }))
        res.status(200).json({
            category: {
                msg: `The products from the category ${categoryN} are: `,
                products: products
            }
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

export const putProduct = async (req, res  = response) =>{
    const { id } = req.params;
    const {_id, name, ...rest} = req.body;
    const product = await Product.findOne({_id: id});
    await Product.findByIdAndUpdate(id, rest);
    res.status(200).json({
        msg: "Product Updated",
        product
    })
}

export const productDelete = async (req, res) =>{
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    await Category.updateMany({products: id}, {$pull:{products: id}});
    res.status(200).json({
        msg: 'Product eliminated',
        product
    })
}