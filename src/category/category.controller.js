import { response, request } from "express";
import Category from './category.model.js';
import Product from '../product/product.model.js'
export const categoryGet = async (req=request, res = response) =>{
    const {limit, from} = req.query;
    const query = {state: true};
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .skip(Number(from))
        .limit(Number(limit))
    ])

    res.status(200).json({
        msg: 'The categories in database are the following: ',
        total,
        categories
    })
}

export const categoryPost = async (req, res) =>{
    const {name, description} = req.body;
    try {
        const category = new Category({name, description})

        await category.save();

        res.status(200).json({
            msg: 'New Category',
            category
        })
    } catch (e) {
        res.status(500).json({e: 'Category couldnt be added'})
    }
}

export const categoryPut = async(req, res = response) =>{
    const { id } = req.params;
    const {_id, name, ...rest} = req.body;
    const category = await Category.findOne({_id: id})

    await Category.findByIdAndUpdate(id, rest);

    res.status(200).json({
        msg: 'Category updated',
        category
    })
}

export const categoryDelete = async(req, res) =>{
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    const defaultCategory = await Category.findOne({name: 'defaultCategory'})
    await Product.updateMany({category: id}, {category: defaultCategory._id});

    res.status(200).json({
        msg: 'Category eliminated: ',
        category
    })
}