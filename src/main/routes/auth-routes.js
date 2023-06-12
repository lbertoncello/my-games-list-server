import express from 'express';
import { adaptRoute } from '../adapters/express-router-adapter.js';
import {
  makeSignUpController,
  makeSignInController,
  makeSignOutController,
  makeChangePasswordController,
} from '../factories/auth.js';
import requireAuth from '../middlewares/require-auth.js';

const router = express.Router();
const signUpController = makeSignUpController();
const signInController = makeSignInController();
const signOutController = makeSignOutController();
const changePasswordController = makeChangePasswordController();

router.route('/signup').post(adaptRoute(signUpController.handle.bind(signUpController)));
router.route('/signin').post(adaptRoute(signInController.handle.bind(signInController)));
router.route('/password').post(requireAuth, adaptRoute(changePasswordController.handle.bind(changePasswordController)));
router.route('/signout').post(requireAuth, adaptRoute(signOutController.handle.bind(signOutController)));

export default router;
