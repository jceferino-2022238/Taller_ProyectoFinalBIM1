import { Router } from 'express'
import { check } from 'express-validator'
import { exPName, exProductById } from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdminRole } from "../middlewares/role-validation.js";
import { isClientRole } from '../middlewares/role-validation.js'
import { getMostSoldProducts, getProductByCategory, getProductById, getProductByName, getProducts, getSoldOutProducts, postProduct, productDelete, putProduct } from './product.controller.js';
const router = Router();

router.get('/', getProducts);
router.get(
    '/soldOutProducts',
            [
                    validateJWT,
                    isAdminRole,
        ], getSoldOutProducts)
router.get('/mostSoldProducts', getMostSoldProducts)
router.get(
    '/getProductByName/:name', 
    [
        validateJWT,
        isClientRole,
    ],getProductByName)
router.get(
    '/getProductByCategory/:categoryN', 
    [
        validateJWT,
        isClientRole,
    ],getProductByCategory)
router.get(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exProductById),
        validateFields
    ], getProductById)

router.put(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exProductById),
        validateFields
    ], putProduct);

router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exProductById),
        validateFields
    ], productDelete);

router.post(
    '/',
    [
            validateJWT,
            isAdminRole,
            check('name', 'name isnt optional').not().isEmpty(),
            check('name').custom(exPName),
            check('description', 'Description isnt optional').not().isEmpty(),
            check('stock', 'Stock isnt optional').not().isEmpty(),
            check('price', 'Price isnt optional').not().isEmpty(),
            validateFields
    ], postProduct)

export default router;