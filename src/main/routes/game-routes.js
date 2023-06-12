import express from 'express';
import { adaptRoute } from '../adapters/express-router-adapter.js';
import {
  makeAddGameController,
  makeGetGameController,
  makeGetAllGamesController,
  makeUpdateGameController,
  makeDeleteGameController,
} from '../factories/game.js';

const router = express.Router();
const addGameController = makeAddGameController();
const getGameController = makeGetGameController();
const getAllGamesController = makeGetAllGamesController();
const updateGameController = makeUpdateGameController();
const deleteGameController = makeDeleteGameController();

router.route('/').post(adaptRoute(addGameController.handle.bind(addGameController)));
router.route('/all').get(adaptRoute(getAllGamesController.handle.bind(getAllGamesController)));
router
  .route('/:id')
  .get(adaptRoute(getGameController.handle.bind(getGameController)))
  .put(adaptRoute(updateGameController.handle.bind(updateGameController)))
  .patch(adaptRoute(updateGameController.handle.bind(updateGameController)))
  .delete(adaptRoute(deleteGameController.handle.bind(deleteGameController)));

export default router;
