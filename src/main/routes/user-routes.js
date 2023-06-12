import express from 'express';
import {
  makeGetMyUserDataController,
  makeUpdateMyUserDataController,
  makeDeleteMyUserController,
} from '../factories/user.js';
import { adaptRoute } from '../adapters/express-router-adapter.js';

const router = express.Router();
const getMyUserDataController = makeGetMyUserDataController();
const updateMyUserDataController = makeUpdateMyUserDataController();
const deleteMyUserDataController = makeDeleteMyUserController();

router
  .route('/me')
  .get(adaptRoute(getMyUserDataController.handle.bind(getMyUserDataController)))
  .put(adaptRoute(updateMyUserDataController.handle.bind(updateMyUserDataController)))
  .patch(adaptRoute(updateMyUserDataController.handle.bind(updateMyUserDataController)))
  .delete(adaptRoute(deleteMyUserDataController.handle.bind(deleteMyUserDataController)));

export default router;
