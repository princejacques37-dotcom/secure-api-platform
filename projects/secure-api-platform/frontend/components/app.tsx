"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import { createTask, listTasks, login, logout as apiLogout, me, register, seedCsrf, type Task, type User } from "../lib/api";

type AuthMode = "login" | "register";

export default function SecureApiApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    void hydrate();
  }, []);

  async function hydrate() {
    setLoading(true); setError("");
    try {
      await seedCsrf();
      const current = await me();
      const data = await listTasks();
      setToken("cookie"); setUser(current); setTasks(data);
    } catch (err) {
      setToken(null); setUser(null);
      setError("");
    } finally { setLoading(false); }
  }

  async function logout() {
    try { await apiLogout(); } finally {
      setToken(null); setUser(null); setTasks([]); setNotice("Signed out."); setError("");
      void seedCsrf();
    }
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="header-inner">
          <div className="brand">Secure API Platform</div>
          <span className="badge"><ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} /> security-first demo</span>
        </div>
      </header>
      <div className="container">
        {!token || !user ? (
          <Auth mode={mode} setMode={setMode} onAuthenticated={hydrate} loading={loading} error={error} notice={notice} setError={setError} setNotice={setNotice} />
        ) : (
          <Dashboard user={user} token={token} tasks={tasks} setTasks={setTasks} logout={logout} error={error} notice={notice} setError={setError} setNotice={setNotice} />
        )}
        <footer className="footer">Built by Jack Ochieng · FastAPI · PostgreSQL · Next.js · Docker · CI/CD</footer>
      </div>
    </main>
  );
}

function Auth({ mode, setMode, onAuthenticated, loading, error, notice, setError, setNotice }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoadingLocal(true); setError(""); setNotice("");
    try {
      if (mode === "register") {
        await register(email, password);
        setNotice("Account created. Sign in with your credentials.");
        setMode("login");
        return;
      }
      const result = await login(email, password);
      await onAuthenticated();
    } catch (err) { setError(err instanceof Error ? err.message : "Request failed."); }
    finally { setLoadingLocal(false); }
  }

  const [localLoading, setLoadingLocal] = useState(false);
  return (
    <section className="hero">
      <div className="card">
        <span className="eyebrow">Full-stack security project</span>
        <h1>Build. Authenticate. Protect.</h1>
        <p>A working frontend for Jack&apos;s Secure API Platform. Register a user, authenticate with JWT, and manage your own tasks through the protected API.</p>
        <div className="grid grid-3" style={{ marginTop: 28 }}>
          <div className="stat"><strong>JWT</strong><span className="label">HttpOnly cookie</span></div>
          <div className="stat"><strong>Argon2</strong><span className="label">Password hashing</span></div>
          <div className="stat"><strong>Postgres</strong><span className="label">Persistent data</span></div>
        </div>
      </div>
      <div className="card">
        <div className="toolbar"><div><h2 style={{ marginBottom: 4 }}>{mode === "login" ? "Sign in" : "Create account"}</h2><span className="label">Passwords require at least 12 characters.</span></div></div>
        <form className="form" onSubmit={submit}>
          <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label htmlFor="password">Password</label><input className="input" id="password" type="password" minLength={12} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          {error && <div className="error">{error}</div>}
          {notice && <div className="success">{notice}</div>}
          <button className="btn btn-primary" disabled={localLoading}>{localLoading ? "Working…" : mode === "login" ? "Sign in" : "Register"}</button>
        </form>
        <div className="divider" />
        <button className="btn" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setNotice(""); }}>
          {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
        </button>
      </div>
    </section>
  );
}

function Dashboard({ user, token, tasks, setTasks, logout, error, notice, setError, setNotice }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => b.id - a.id), [tasks]);

  async function refresh() {
    setError("");
    try { setTasks(await listTasks()); setNotice("Tasks refreshed."); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to refresh tasks."); }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const created = await createTask(title, description);
      setTasks((items: Task[]) => [created, ...items]); setTitle(""); setDescription(""); setNotice("Task created.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to create task."); }
    finally { setSaving(false); }
  }

  return (
    <>
      <section className="card">
        <div className="toolbar">
          <div><span className="eyebrow">Authenticated dashboard</span><h2 style={{ margin: "7px 0 4px" }}>Welcome back</h2><span className="muted">{user.email} · role: {user.role}</span></div>
          <div className="actions" style={{ marginTop: 0 }}><button className="btn" onClick={refresh}><RefreshCw size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />Refresh</button><button className="btn btn-danger" onClick={logout}><LogOut size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />Sign out</button></div>
        </div>
        {error && <div className="error" style={{ marginBottom: 10 }}>{error}</div>}
        {notice && <div className="success" style={{ marginBottom: 10 }}>{notice}</div>}
      </section>

      <section className="grid grid-2" style={{ marginTop: 18 }}>
        <form className="card form" onSubmit={submit}>
          <div><span className="eyebrow">Protected write path</span><h2 style={{ margin: "8px 0 4px" }}>Create a task</h2><span className="muted">The API binds the record to the authenticated user.</span></div>
          <div className="field"><label htmlFor="title">Title</label><input className="input" id="title" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea className="textarea" id="description" maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <button className="btn btn-primary" disabled={saving}><Plus size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />{saving ? "Creating…" : "Create task"}</button>
        </form>

        <div className="card">
          <div className="toolbar"><div><span className="eyebrow">Protected read path</span><h2 style={{ margin: "8px 0 4px" }}>Your tasks</h2><span className="muted">{sortedTasks.length} record{sortedTasks.length === 1 ? "" : "s"}</span></div></div>
          <div className="grid" style={{ marginTop: 16 }}>
            {sortedTasks.length === 0 ? <div className="stat"><span className="muted">No tasks yet. Create the first one.</span></div> : sortedTasks.map((task: Task) => <article className="stat task" key={task.id}><div><h3>{task.title}</h3><p>{task.description || "No description."}</p><div className="meta"><span className="pill">Task #{task.id}</span><span className="pill">Owner #{task.owner_id}</span></div></div></article>)}
          </div>
        </div>
      </section>
    </>
  );
}
