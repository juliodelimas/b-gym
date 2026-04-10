class WorkoutService {
  constructor(store) {
    this.store = store;
  }

  getTodayWorkout(user) {
    const context = this.store.getTodayWorkoutContext(user);

    return {
      date: context.date,
      cycle: context.cycle,
      workout: {
        id: context.workoutDefinition.id,
        name: context.workoutDefinition.name,
        focus: context.workoutDefinition.focus,
        focusLabel: context.workoutDefinition.focusLabel,
        exercises: context.workoutState.exercises,
      },
      progress: this.buildProgress(context.workoutState.exercises),
    };
  }

  getTodayProgress(user) {
    const context = this.store.getTodayWorkoutContext(user);
    const progress = this.buildProgress(context.workoutState.exercises);

    return {
      date: context.date,
      workoutId: context.workoutDefinition.id,
      focus: context.workoutDefinition.focus,
      ...progress,
    };
  }

  getExercise(user, exerciseId) {
    const context = this.store.getTodayWorkoutContext(user);
    const exercise = context.workoutState.exercises.find((item) => item.id === exerciseId);

    if (!exercise) {
      return null;
    }

    return {
      date: context.date,
      workoutId: context.workoutDefinition.id,
      focus: context.workoutDefinition.focus,
      exercise,
    };
  }

  updateExerciseCompletion(user, exerciseId, completed) {
    const context = this.store.getTodayWorkoutContext(user);
    const exercise = context.workoutState.exercises.find((item) => item.id === exerciseId);

    if (!exercise) {
      return null;
    }

    exercise.completed = completed;
    exercise.completedAt = completed ? new Date().toISOString() : null;

    return {
      exercise,
      progress: this.buildProgress(context.workoutState.exercises),
    };
  }

  buildProgress(exercises) {
    const totalCount = exercises.length;
    const completedCount = exercises.filter((item) => item.completed).length;
    const percentage = totalCount === 0
      ? 0
      : Number(((completedCount / totalCount) * 100).toFixed(2));

    return {
      completedCount,
      totalCount,
      percentage,
    };
  }
}

module.exports = {
  WorkoutService,
};
