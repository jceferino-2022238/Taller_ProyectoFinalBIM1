import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'The name isnt optional']
    },
    description:{
        type: String,
        required: [true, 'The description isnt optional']
    },
    stock:{
        type: Number,
        required: [true, 'Stock isnt optional']
    },
    price:{
        type: Number,
        required: [true, 'Price isnt optional']
    },
    timesSold:{
        type: Number,
        required: true,
        default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    state:{
        type: Boolean,
        default: true
    }
})

ProductSchema.methods.toJSON = function(){
    const{__v, _id, ...product} = this.toObject();
    product.pid = _id;
    return product;
}

export default mongoose.model('Product', ProductSchema)