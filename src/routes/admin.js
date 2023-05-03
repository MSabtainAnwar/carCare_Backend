const express = require("express");
const router = express.Router();

// MiddleWares
const {
  registerMiddle,
  loginMiddle,
  verifyTokenMiddle,
} = require("../middleware/admin");
// Controllers
const {
  registerAdmin,
  loginAdmin,
  verifyAdminToken,
} = require("../controllers/admin");

/**
 * @swagger
 * components:
 *    schemas:
 *      adminAuth:
 *        type: object
 *        required:
 *          - firstName
 *          - lastName
 *          - phone
 *          - password
 *        properties:
 *          _id:
 *            type: ObjectId
 *            description: The auto-generated id of the admin
 *          firstName:
 *            type: String
 *            description: first name of admin
 *          lastName:
 *            type: String
 *            description: last name of admin
 *          phone:
 *            type: String
 *            description: phone number of the admin
 *          password:
 *            type: String
 *            description: password of the admin
 *          token:
 *             type : String
 *             description: token is auto generated when admin is logined and token verify when the admin back to the website and page
 *                          is reloaded. The token expire time is 1 day
 *        example:
 *            firstName: "M Sabtain"
 *            lastName: "Anwar"
 *            phone: "03066830959"
 *            password: "1234"
 *            confirmPassword: "1234"
 *
 */

/**
 * @swagger
 * tags:
 *    name: adminAuth
 *    description: The Authentications API
 */

/**
 * @swagger
 * /admin/register:
 *    post:
 *      summary: Create a new Admin
 *      tags: [adminAuth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/adminAuth'
 *      responses:
 *        200:
 *          description: The Admin was successfully created!
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/adminAuth'
 *        400:
 *          description: Something missing
 *        403:
 *          description: Already Exist
 *        500:
 *          description: Some Server Error
 *
 */

// register-admin
router.post("/register", registerMiddle, registerAdmin);
// login-admin
router.post("/login", loginMiddle, loginAdmin);
// verify-admin-by-Id
router.post("/verify/:id", verifyTokenMiddle, verifyAdminToken);

module.exports = router;
