import { Router } from 'express';
import { check } from 'express-validator';
import { getMyShoppingH, newUser, putMyUser, userPut, usersGet, usersPost } from './user.controller.js';
import { exEmail, exUserById} from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validateFields.js'
const router = Router();

router.get("/", usersGet);

router.get('/getMyShoppingH', getMyShoppingH);
router.put('/userPut/:id',
    [
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exUserById),
        validateFields
    ], userPut)
router.put(
    '/putMyUser/:id',
    [
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exUserById),
        validateFields
    ], putMyUser
)
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

router.post(
    '/newUser',
    [
        check("name", "Name isnt optional").not().isEmpty(),
        check("password", "Password cant be shorter than 6 characters").isLength({ min: 6}),
        check("password", "Password isnt optional").not().isEmpty(),
        check("email", "This is not a valid Email").isEmail(),
        check("email").custom(exEmail),
        check('role', 'Role isnt optional').not().isEmpty(),
        validateFields
    ], newUser);
export default router;