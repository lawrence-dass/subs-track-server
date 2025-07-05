import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.put('/:id', authorize, updateUser);

userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;
