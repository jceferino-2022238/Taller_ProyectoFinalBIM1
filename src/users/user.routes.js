import { Router } from 'express';
import { check } from 'express-validator';
import { usersGet, usersPost } from './user.controller.js';
import { exEmail} from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validateFields.js'
const router = Router();
router.get("/", usersGet);

router.post(
    "/",
    [
        check("name", "Name isnt optional").not().isEmpty(),
        check("password", "Password cant be shorter than 6 characters").isLength({ min: 6}),
        check("password", "Password isnt optional").not().isEmpty(),
        check("email", "This is not a valid Email").isEmail(),
        check("email").custom(exEmail),
        validateFields
    ], usersPost);

export default router;