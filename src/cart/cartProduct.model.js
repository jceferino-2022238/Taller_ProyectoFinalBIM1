import mongoose from "mongoose";

const CartProductSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity:{
        type: Number,
        required: [true, 'The quantity to add isnt optional']
    },
    state:{
        type: Boolean,
        default: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
})

export default mongoose.model('CartProduct', CartProductSchema)