import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name isnt optional']
    },
    description: {
        type: String,
        required: [true, 'Description isnt optional']  
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
})

CategorySchema.methods.toJSON = function(){
    const{__v, _id, ...category} = this.toObject();
    category.cid = _id;
    return category;
}

export default mongoose.model('Category', CategorySchema)