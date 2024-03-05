import { Router } from "express";
import { check } from 'express-validator';
import { categoryDelete, categoryGet, categoryPost, categoryPut } from "./category.controller.js";
import { exCName, exCategoryById } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = Router();
router.get('/', categoryGet)

router.post(
    '/',
    [
        check('name', 'Name isnt optional').not().isEmpty(),
        check('name').custom(exCName),
        check('description', 'Description isnt optional').not().isEmpty(),
        validateFields
    ], categoryPost);

router.put(
    '/:id',
    [
        check('id', 'Not valid ID').isMongoId(),
        check('id').custom(exCategoryById),
        validateFields
    ], categoryPut);

router.delete(
    '/:id',
    [
        check('id', 'Not valid ID').isMongoId(),
        check('id').custom(exCategoryById),
        validateFields
    ], categoryDelete);

export default router;