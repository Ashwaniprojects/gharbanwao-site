import { useEffect, useState } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { Container } from "@/components/site/shared";
import { errorMessage, login, setToken } from "@/lib/cmsAdmin";

const STYLES = {
  input:
    "h-12 rounded-lg border-divider bg-paper text-[16px] font-medium focus-visible:ring-green",
  primary:
    "h-12 rounded-lg bg-green px-6 text-[15px] font-bold text-ink hover:bg-green-600",
  danger:
    "h-10 rounded-lg border border-divider px-4 text-[14px] font-semibold text-ink hover:bg-wash-yellow",
};

export const AdminLogin = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Admin — Ghar Banwao";
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const token = await login(password);
      setToken(token);
      setPassword("");
      onAuthenticated();
    } catch (err) {
      setError(errorMessage(err, "Incorrect password."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-wash-yellow" data-testid="admin-login-screen">
      <Container className="flex min-h-screen max-w-md flex-col justify-center py-16">
        <div className="card-gb p-6 md:p-8">
          <Logo size="h-14" />
          <h1 className="mt-6 text-[28px] font-extrabold tracking-tight">Content admin</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/65">
            Sign in to publish posts and update project details.
          </p>

          <form onSubmit={submit} className="mt-8 grid gap-4" data-testid="admin-login-form">
            <div>
              <label
                htmlFor="admin-password"
                className="mono-label mb-2 block text-ink/50"
              >
                Password
              </label>
              <Input
                id="admin-password"
                data-testid="admin-password-input"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={STYLES.input}
                placeholder="••••••••"
              />
            </div>
            {error ? (
              <p
                role="alert"
                data-testid="admin-login-error"
                className="rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
              >
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={busy || !password}
              data-testid="admin-login-submit"
              className={`${STYLES.primary} disabled:opacity-60`}
            >
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
        <p className="mono-label mt-6 text-center text-ink/40">
          <KeyRound className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2.5} />
          Sessions last 12 hours
        </p>
      </Container>
    </div>
  );
};

export const AdminHeader = ({ onSignOut }) => (
  <header className="sticky top-0 z-40 border-b border-divider bg-paper/95 backdrop-blur">
    <Container className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <Logo size="h-10" />
        <span className="mono-label text-ink/45">Admin</span>
      </div>
      <Button
        variant="ghost"
        onClick={onSignOut}
        data-testid="admin-sign-out"
        className={STYLES.danger}
      >
        <LogOut className="mr-2 h-4 w-4" strokeWidth={2.5} />
        Sign out
      </Button>
    </Container>
  </header>
);
