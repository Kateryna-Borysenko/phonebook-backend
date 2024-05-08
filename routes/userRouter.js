import express from 'express';
import validateRequestBody from '../middleware/validateRequestBody.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import { registerSchema, loginSchema } from '../schemas/userSchemas.js';
import { emailSchema } from '../schemas/emailSchema.js';
import { subscriptionSchema } from '../schemas/subscriptionSchema.js';
import {
  registerUser, verifyEmail, resendVerifyEmail, loginUser, getCurrentUser, logoutUser, updateSubscription, updateAvatar
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', validateRequestBody(registerSchema), controllerWrapper(registerUser));

userRouter.get("/verify/:verificationCode", controllerWrapper(verifyEmail));

userRouter.post("/verify", validateRequestBody(emailSchema), controllerWrapper(resendVerifyEmail));

userRouter.post('/login', validateRequestBody(loginSchema), controllerWrapper(loginUser));

userRouter.get('/current', protect, controllerWrapper(getCurrentUser));

// userRouter.post('/logout', protect, controllerWrapper(logoutUser));
userRouter.post('/logout', controllerWrapper(logoutUser));

userRouter.patch('/', protect, validateRequestBody(subscriptionSchema), controllerWrapper(updateSubscription));

userRouter.patch('/avatars', protect, upload.single("avatar"), controllerWrapper(updateAvatar));

export default userRouter;


