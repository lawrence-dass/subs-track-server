import { Router } from 'express';

import { signUp, signIn, signOut } from '../controllers/auth.controller.js';

const authRouter = Router();

try {
    authRouter.post('/sign-up', signUp);
} catch (error) {
  console.log("error", error)
}

authRouter.post('/sign-in', signIn);

authRouter.post('/sign-out', signOut);

export default authRouter;