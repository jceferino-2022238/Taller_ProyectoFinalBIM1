import { Router } from "express";
import { check } from 'express-validator';
import { categoryDelete, categoryGet, categoryPost, categoryPut } from "./category.controller.js";
import { exCName, exCategoryById } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validateFields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdminRole } from "../middlewares/role-validation.js";
import { isClientRole } from '../middlewares/role-validation.js'
const router = Router();
router.get('/', categoryGet)

router.post(
    '/',
    [
        validateJWT,
        isAdminRole,
        check('name', 'Name isnt optional').not().isEmpty(),
        check('name').custom(exCName),
        check('description', 'Description isnt optional').not().isEmpty(),
        validateFields
    ], categoryPost);

router.put(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'Not valid ID').isMongoId(),
        check('id').custom(exCategoryById),
        validateFields
    ], categoryPut);

router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'Not valid ID').isMongoId(),
        check('id').custom(exCategoryById),
        validateFields
    ], categoryDelete);

export default router;