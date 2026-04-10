import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bgym-session";

const api = {
  async request(path, options = {}, token) {
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const error = new Error(payload?.message || "Nao foi possivel concluir a solicitacao.");
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  },

  register(input) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  login(input) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getTodayWorkout(token) {
    return this.request("/api/me/workout/today", {}, token);
  },

  getTodayProgress(token) {
    return this.request("/api/me/workout/today/progress", {}, token);
  },

  getExercise(token, exerciseId) {
    return this.request(`/api/me/workout/today/exercises/${exerciseId}`, {}, token);
  },

  updateExerciseCompletion(token, exerciseId, completed) {
    return this.request(
      `/api/me/workout/today/exercises/${exerciseId}/completion`,
      {
        method: "PUT",
        body: JSON.stringify({ completed }),
      },
      token
    );
  },
};

function getStoredSession() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function AuthPanel({ mode, onModeChange, onAuthSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("idle");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      if (mode === "register") {
        const response = await api.register(form);
        setMessage({
          type: "success",
          text: `${response.message} Agora faca login para abrir seu treino do dia.`,
        });
        setForm((current) => ({ ...current, password: "" }));
        onModeChange("login");
      } else {
        const response = await api.login({
          email: form.email,
          password: form.password,
        });

        const session = {
          token: response.accessToken,
          user: response.user,
        };

        saveSession(session);
        onAuthSuccess(session);
      }
    } catch (error) {
      const details = error.payload?.details?.[0]?.message;
      setMessage({
        type: "error",
        text: details || error.message,
      });
    } finally {
      setStatus("idle");
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-toggle">
        <button
          className={mode === "login" ? "toggle-button active" : "toggle-button"}
          onClick={() => onModeChange("login")}
          type="button"
        >
          Entrar
        </button>
        <button
          className={mode === "register" ? "toggle-button active" : "toggle-button"}
          onClick={() => onModeChange("register")}
          type="button"
        >
          Criar conta
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label>
            Nome
            <input
              autoComplete="name"
              name="name"
              onChange={updateField}
              placeholder="Seu nome completo"
              required
              value={form.name}
            />
          </label>
        ) : null}

        <label>
          E-mail
          <input
            autoComplete="email"
            name="email"
            onChange={updateField}
            placeholder="voce@exemplo.com"
            required
            type="email"
            value={form.email}
          />
        </label>

        <label>
          Senha
          <input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength="8"
            name="password"
            onChange={updateField}
            placeholder="Minimo de 8 caracteres"
            required
            type="password"
            value={form.password}
          />
        </label>

        {message ? (
          <div className={`feedback ${message.type}`}>{message.text}</div>
        ) : null}

        <button className="primary-button" disabled={status === "loading"} type="submit">
          {status === "loading"
            ? "Processando..."
            : mode === "register"
              ? "Cadastrar"
              : "Acessar treino"}
        </button>
      </form>
    </section>
  );
}

function Dashboard({
  detail,
  detailStatus,
  error,
  onLogout,
  onRefresh,
  onSelectExercise,
  onToggleExercise,
  progress,
  session,
  workout,
}) {
  const completed = progress?.completedCount || 0;
  const total = progress?.totalCount || 0;
  const remaining = Math.max(total - completed, 0);
  const percentage = Math.round(progress?.percentage || 0);

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">B-Gym Daily Flow</p>
          <h1>Seu treino de hoje, sem telas sobrando.</h1>
        </div>

        <div className="topbar-actions">
          <div className="user-chip">
            <span>{session.user.name}</span>
            <small>{session.user.email}</small>
          </div>
          <button className="ghost-button" onClick={onLogout} type="button">
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="hero-card">
          <div className="hero-main">
            <p className="eyebrow">Treino do dia</p>
            <h2>{workout.workout.focusLabel}</h2>
            <p className="hero-text">
              Dia {workout.cycle.currentDay} de {workout.cycle.length}. O proximo foco sera{" "}
              <strong>Dia {workout.cycle.nextDay}</strong>.
            </p>
          </div>

          <div className="hero-metrics">
            <div className="metric-card accent">
              <span>Progresso</span>
              <strong>{percentage}%</strong>
              <small>
                {completed} de {total} exercicios
              </small>
            </div>
            <div className="metric-card">
              <span>Restantes</span>
              <strong>{remaining}</strong>
              <small>para fechar o dia</small>
            </div>
            <div className="metric-card">
              <span>Data</span>
              <strong>{workout.date}</strong>
              <small>progresso salvo por dia</small>
            </div>
          </div>
        </section>

        <section className="list-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Execucao</p>
              <h3>Lista do treino</h3>
            </div>
            <button className="ghost-button" onClick={onRefresh} type="button">
              Atualizar
            </button>
          </div>

          {error ? <div className="feedback error">{error}</div> : null}

          <div className="exercise-list">
            {workout.workout.exercises.map((exercise) => (
              <article
                className={exercise.completed ? "exercise-card completed" : "exercise-card"}
                key={exercise.id}
              >
                <div className="exercise-main">
                  <button
                    aria-label={`Ver detalhes de ${exercise.name}`}
                    className="exercise-name"
                    onClick={() => onSelectExercise(exercise.id)}
                    type="button"
                  >
                    {exercise.name}
                  </button>
                  <p>
                    {exercise.sets} series • {exercise.reps} reps
                  </p>
                  <small>{exercise.notes || "Sem observacoes adicionais."}</small>
                </div>

                <label className="completion-toggle">
                  <input
                    checked={exercise.completed}
                    onChange={(event) => onToggleExercise(exercise.id, event.target.checked)}
                    type="checkbox"
                  />
                  <span>{exercise.completed ? "Concluido" : "Marcar"}</span>
                </label>
              </article>
            ))}
          </div>
        </section>

        <aside className="detail-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Detalhes</p>
              <h3>Foco do exercicio</h3>
            </div>
          </div>

          {detailStatus === "loading" ? <p className="muted">Carregando detalhes...</p> : null}

          {detail ? (
            <div className="detail-content">
              <span className="detail-tag">{detail.focus}</span>
              <h4>{detail.exercise.name}</h4>
              <p>
                {detail.exercise.sets} series de {detail.exercise.reps} reps
              </p>
              <p>{detail.exercise.notes || "Sem orientacao complementar para este exercicio."}</p>
              <div className="detail-state">
                <strong>{detail.exercise.completed ? "Exercicio concluido" : "Pendente"}</strong>
                <small>
                  {detail.exercise.completedAt
                    ? `Ultima marcacao em ${new Date(detail.exercise.completedAt).toLocaleString(
                        "pt-BR"
                      )}`
                    : "Marque o checkbox na lista para atualizar o progresso."}
                </small>
              </div>
            </div>
          ) : (
            <p className="muted">
              Selecione um exercicio na lista para ver os detalhes sem sair da tela principal.
            </p>
          )}
        </aside>
      </main>
    </div>
  );
}

export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [session, setSession] = useState(() => getStoredSession());
  const [workout, setWorkout] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailStatus, setDetailStatus] = useState("idle");
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(session?.token);
  const selectedExercise = useMemo(
    () => workout?.workout.exercises.find((exercise) => exercise.id === selectedExerciseId) || null,
    [selectedExerciseId, workout]
  );

  useEffect(() => {
    async function bootstrap() {
      if (!session?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [todayWorkout, todayProgress] = await Promise.all([
          api.getTodayWorkout(session.token),
          api.getTodayProgress(session.token),
        ]);

        setWorkout(todayWorkout);
        setProgress(todayProgress);

        const firstExerciseId = todayWorkout.workout.exercises[0]?.id || null;
        setSelectedExerciseId(firstExerciseId);
      } catch (requestError) {
        if (requestError.status === 401) {
          clearSession();
          setSession(null);
        } else {
          setError(requestError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [session]);

  useEffect(() => {
    async function loadDetail() {
      if (!session?.token || !selectedExerciseId) {
        setDetail(null);
        return;
      }

      setDetailStatus("loading");

      try {
        const response = await api.getExercise(session.token, selectedExerciseId);
        setDetail(response);
      } catch (requestError) {
        setDetail(null);
        setError(requestError.message);
      } finally {
        setDetailStatus("idle");
      }
    }

    loadDetail();
  }, [selectedExerciseId, session]);

  async function refreshWorkout() {
    if (!session?.token) {
      return;
    }

    setError(null);

    try {
      const [todayWorkout, todayProgress] = await Promise.all([
        api.getTodayWorkout(session.token),
        api.getTodayProgress(session.token),
      ]);

      setWorkout(todayWorkout);
      setProgress(todayProgress);

      setSelectedExerciseId((current) =>
        current && todayWorkout.workout.exercises.some((exercise) => exercise.id === current)
          ? current
          : todayWorkout.workout.exercises[0]?.id || null
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleToggleExercise(exerciseId, completed) {
    if (!session?.token || !workout) {
      return;
    }

    setError(null);

    try {
      const response = await api.updateExerciseCompletion(session.token, exerciseId, completed);

      setWorkout((current) => ({
        ...current,
        workout: {
          ...current.workout,
          exercises: current.workout.exercises.map((exercise) =>
            exercise.id === exerciseId ? response.exercise : exercise
          ),
        },
      }));

      setProgress((current) => ({
        ...current,
        ...response.progress,
      }));

      if (selectedExercise?.id === exerciseId) {
        setDetail((current) =>
          current
            ? {
                ...current,
                exercise: response.exercise,
              }
            : current
        );
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setWorkout(null);
    setProgress(null);
    setSelectedExerciseId(null);
    setDetail(null);
    setError(null);
  }

  if (loading) {
    return (
      <div className="screen-shell">
        <div className="loading-card">Preparando sua rotina de treino...</div>
      </div>
    );
  }

  if (!isAuthenticated || !workout || !progress) {
    return (
      <div className="screen-shell">
        <section className="marketing-panel">
          <p className="eyebrow">ATD-53 em uma tela objetiva</p>
          <h1>Cadastre, entre e execute seu treino sem navegar demais.</h1>
          <p>
            A jornada foi condensada em dois momentos: acesso e treino do dia. Depois do login,
            tudo fica concentrado na tela principal com foco, lista, detalhes e progresso.
          </p>

          <div className="feature-strip">
            <div>
              <strong>Ciclo inteligente</strong>
              <span>Superiores, inferiores e cardio em rotacao automatica.</span>
            </div>
            <div>
              <strong>Progresso persistido</strong>
              <span>Seu andamento do dia reaparece quando voce volta.</span>
            </div>
            <div>
              <strong>Detalhes sem sair</strong>
              <span>Series, reps e observacoes dentro da mesma experiencia.</span>
            </div>
          </div>
        </section>

        <AuthPanel mode={authMode} onAuthSuccess={setSession} onModeChange={setAuthMode} />
      </div>
    );
  }

  return (
    <Dashboard
      detail={detail}
      detailStatus={detailStatus}
      error={error}
      onLogout={handleLogout}
      onRefresh={refreshWorkout}
      onSelectExercise={setSelectedExerciseId}
      onToggleExercise={handleToggleExercise}
      progress={progress}
      session={session}
      workout={workout}
    />
  );
}
