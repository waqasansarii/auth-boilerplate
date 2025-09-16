import express from 'express';
import { signin, signup, signout } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', signin);
authRouter.post('/sign-up', signup);
authRouter.post('/sign-out', signout);

export default authRouter;
