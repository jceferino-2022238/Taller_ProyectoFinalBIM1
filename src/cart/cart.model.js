import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
})

CartSchema.methods.toJSON = function(){
    const {__v, _id, ...cart} = this.toObject();
    cart.cid = _id;
    return cart;
}

export default mongoose.model('Cart', CartSchema)