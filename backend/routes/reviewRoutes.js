
const express = require('express');
const reviewRouter = express.Router();
const { createReviewController, getAllReviewController,
    getReviewController,updateReviewController,deleteReviewController
} =
    require('../controller/reviewController');
// plans -> get all the plans from db -> sensitive route -> protected route -> logged in i will only allow that person 
reviewRouter.route("/")
    .get(getAllReviewController)
    .post(createReviewController)

// reviewRouter.route("/:reviewRoutes")
//     .get(getReviewController)
//     // .patch(updateReviewController)
//     .delete(deleteReviewController)

// loggedin plan
module.exports = reviewRouter;