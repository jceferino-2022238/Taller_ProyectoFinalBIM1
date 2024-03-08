import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { addToCart, getUserCart } from './cart.controller.js';
import { exCartById } from '../helpers/db-validators.js';

const router = Router();
router.get(
    '/:id',
    [
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exCartById),
        validateFields
    ], getUserCart
)
router.post(
    '/addToCart/:id',
    [
        check('quantity', 'Quantity isnt optional').not().isEmpty(),
        validateFields
    ], addToCart);

export default router;