import express from 'express';
import validateRequestBody from '../middleware/validateRequestBody.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import { loginSchema, registerSchema } from '../schemas/userSchemas.js';
import { subscriptionSchema } from '../schemas/subscriptionSchema.js';
import { registerUser, loginUser, getCurrentUser, logoutUser, updateSubscription } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', validateRequestBody(registerSchema), controllerWrapper(registerUser));

userRouter.post('/login', validateRequestBody(loginSchema), controllerWrapper(loginUser));

userRouter.get('/current', protect, controllerWrapper(getCurrentUser));

userRouter.post('/logout', protect, controllerWrapper(logoutUser));

userRouter.patch('/', protect, validateRequestBody(subscriptionSchema), controllerWrapper(updateSubscription));

export default userRouter;


