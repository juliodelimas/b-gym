const express = require("express");

const { validateCompletionUpdate } = require("../middleware/validate");

function createWorkoutRoutes(workoutService) {
  const router = express.Router();

  router.get("/workout/today", (req, res) => {
    res.json(workoutService.getTodayWorkout(req.user));
  });

  router.get("/workout/today/progress", (req, res) => {
    res.json(workoutService.getTodayProgress(req.user));
  });

  router.get("/workout/today/exercises/:exerciseId", (req, res) => {
    const response = workoutService.getExercise(req.user, req.params.exerciseId);

    if (!response) {
      return res.status(404).json({
        code: "RESOURCE_NOT_FOUND",
        message: "Recurso nao encontrado.",
      });
    }

    return res.json(response);
  });

  router.put("/workout/today/exercises/:exerciseId/completion", validateCompletionUpdate, (req, res) => {
    const response = workoutService.updateExerciseCompletion(
      req.user,
      req.params.exerciseId,
      req.body.completed
    );

    if (!response) {
      return res.status(404).json({
        code: "RESOURCE_NOT_FOUND",
        message: "Recurso nao encontrado.",
      });
    }

    return res.json(response);
  });

  return router;
}

module.exports = {
  createWorkoutRoutes,
};
