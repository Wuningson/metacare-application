const controller = require('../controllers/index');
const express = require('express');

const router = express.Router();

router.route('/films').get(controller.getMoviesDetails);
router.route('/films/comments').post(controller.addNewComment);
router.route('/films/:film').get(controller.getCharacterListForAMovie);
router.route('/films/comments/:film').get(controller.getCommentsForMovie);

module.exports = router;
