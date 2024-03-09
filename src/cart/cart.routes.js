import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { addToCart, deleteFromCart, getUserCart, purchaseCart } from './cart.controller.js';
import { exCartById, exCartPById } from '../helpers/db-validators.js';
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdminRole } from "../middlewares/role-validation.js";
import { isClientRole } from '../middlewares/role-validation.js'
const router = Router();
router.get(
    '/:id',
    [
        validateJWT,
        isClientRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exCartById),
        validateFields
    ], getUserCart
)
router.delete(
    '/deleteFromCart/:id',
    [
        validateJWT,
        isClientRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exCartPById),
        validateFields
    ], deleteFromCart
)
router.post(
    '/addToCart/:id',
    [
        validateJWT,
        isClientRole,
        check('quantity', 'Quantity isnt optional').not().isEmpty(),
        validateFields
    ], addToCart);

router.post(
    '/purchaseCart/:id',
    [
        validateJWT,
        isClientRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exCartById),
        validateFields
    ], purchaseCart);
   
export default router;