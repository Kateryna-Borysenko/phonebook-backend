import express from 'express';
import validateRequestBody from '../middleware/validateRequestBody.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import { registerSchema } from '../schemas/userSchemas.js';
import { registerUser } from '../controllers/userControllers.js';

const userRouter = express.Router();
userRouter.post('/register', validateRequestBody(registerSchema), controllerWrapper(registerUser));

export default userRouter;


