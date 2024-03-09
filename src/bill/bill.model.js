import mongoose from "mongoose";

const BillSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

BillSchema.methods.toJSON = function(){
    const {__v, _id, ...bill} = this.toObject();
    bill.bid = _id;
    return bill;
}

export default mongoose.model('Bill', BillSchema)