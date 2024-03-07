import { Router } from 'express'
import { check } from 'express-validator'
import { exPName, exProductById } from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { getProductById, getProducts, postProduct, productDelete, putProduct } from './product.controller.js';
const router = Router();

router.get('/', getProducts);

router.get(
    '/:id',
    [
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exProductById),
        validateFields
    ], getProductById)

router.put(
    '/:id',
    [
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exProductById),
        validateFields
    ], putProduct);

router.delete(
    '/:id',
    [
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exProductById),
        validateFields
    ], productDelete);

router.post(
    '/',
    [
            check('name', 'name isnt optional').not().isEmpty(),
            check('name').custom(exPName),
            check('description', 'Description isnt optional').not().isEmpty(),
            check('stock', 'Stock isnt optional').not().isEmpty(),
            check('price', 'Price isnt optional').not().isEmpty(),
            validateFields
    ], postProduct)

export default router;