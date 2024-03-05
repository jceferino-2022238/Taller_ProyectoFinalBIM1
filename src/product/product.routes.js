import { Router } from 'express'
import { check } from 'express-validator'
import { exPName } from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { postProduct } from './product.controller.js';
const router = Router();

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