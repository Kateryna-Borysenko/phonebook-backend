import express from 'express';
import validateRequestBody from '../middleware/validateRequestBody.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import { loginSchema, registerSchema } from '../schemas/userSchemas.js';
import { registerUser, loginUser } from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post('/register', validateRequestBody(registerSchema), controllerWrapper(registerUser));

userRouter.post('/login', validateRequestBody(loginSchema), controllerWrapper(loginUser));

export default userRouter;


