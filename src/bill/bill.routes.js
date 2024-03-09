import { Router } from "express";
import { check } from "express-validator";
import { exUserById } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validateFields.js";
import { getUserBills } from "./bill.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdminRole } from "../middlewares/role-validation.js";
const router = Router();

router.get(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check("id", "Not valid ID").isMongoId(),
        check("id").custom(exUserById),
        validateFields
    ], getUserBills);

export default router;