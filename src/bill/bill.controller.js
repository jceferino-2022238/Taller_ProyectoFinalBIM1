import CartProduct from '../cart/cartProduct.model.js'
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import User from '../users/user.model.js'
import Category from '../category/category.model.js';
import jwt from 'jsonwebtoken'
import Bill from '../bill/bill.model.js';

export const getUserBills = async (req, res) =>{
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const bills = await Bill.find({ user: user._id})
        if(!bills){
            return res.status(404).json({ message: 'Bills from user not found' });
        }
        const fullBills = [];
        for (const bill of bills) {
            const cart = await Cart.findById(bill.cart)
            const cartProducts = await Promise.all(cart.products.map(async(cartProduct) =>{
                const productC = await CartProduct.findById(cartProduct)
                const product = await Product.findById(productC.product);
    
                const category = await Category.findById(product.category);
    
                if(!category){
                    return res.status(404).send({message: 'Category not found'});
                }
                
                return{
                    _id: productC._id,
                    product: product.name,
                    description: product.description,
                    category: category ? category.name: 'Category not found',
                    price: product.price,
                    quantity: productC.quantity
                }
            }));

            fullBills.push({
                _id: bill._id,
                state: bill.state,
                date: bill.date,
                user: user.name,
                email: user.email,
                role: user.role,
                products: cartProducts,
                totalPrice: cart.totalPrice
            })
        }
        res.status(200).json({ msg: 'The Bills of the User are: ', bills: fullBills });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}
