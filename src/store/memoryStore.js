const { WORKOUT_DEFINITIONS } = require("../data/workouts");
const { differenceInDays, toIsoDate } = require("../lib/date");
const { createId, hashPassword } = require("../lib/security");

function createWorkoutState(definition) {
  return {
    workoutId: definition.id,
    focus: definition.focus,
    exercises: definition.exercises.map((exercise) => ({
      ...exercise,
      completed: false,
      completedAt: null,
    })),
  };
}

class MemoryStore {
  constructor() {
    this.users = [];
    this.sessions = new Map();
  }

  createUser({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();
    const user = {
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      createdAt: now,
      cycleStartedAt: toIsoDate(),
      progressByDate: {},
    };

    this.users.push(user);

    return user;
  }

  findUserByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.users.find((user) => user.email === normalizedEmail) || null;
  }

  findUserById(userId) {
    return this.users.find((user) => user.id === userId) || null;
  }

  validateCredentials(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    return user.passwordHash === hashPassword(password) ? user : null;
  }

  saveSession(token, userId) {
    this.sessions.set(token, userId);
  }

  findUserIdBySession(token) {
    return this.sessions.get(token) || null;
  }

  getTodayWorkoutContext(user, currentDate = toIsoDate()) {
    const elapsedDays = differenceInDays(user.cycleStartedAt, currentDate);
    const currentDay = ((elapsedDays % 3) + 3) % 3 + 1;
    const nextDay = currentDay === 3 ? 1 : currentDay + 1;
    const definition = WORKOUT_DEFINITIONS.find((item) => item.day === currentDay);

    if (!user.progressByDate[currentDate]) {
      user.progressByDate = {
        [currentDate]: createWorkoutState(definition),
      };
    }

    return {
      date: currentDate,
      cycle: {
        length: 3,
        currentDay,
        nextDay,
        resetsAfterDay: 3,
      },
      workoutDefinition: definition,
      workoutState: user.progressByDate[currentDate],
    };
  }
}

module.exports = {
  MemoryStore,
};
