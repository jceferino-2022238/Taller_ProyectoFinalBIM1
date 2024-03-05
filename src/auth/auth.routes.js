import { Router } from 'express'
import { check } from 'express-validator'
import { login } from './auth.controller.js'
import { validateFields } from '../middlewares/validateFields.js'

const router = Router()

router.post(
    '/login',
    [
        check('email', 'The email isnt optional').not().isEmpty(),
        check('password', 'Password isnt optional').not().isEmpty(),
        validateFields,
    ], login);

export default router;