import { Component } from "react";
import { Link } from "react-router-dom";

/**
 * Last line of defense for the marketing site. Any render error used to
 * unmount the whole app (ReactDOM has no error boundary of its own), leaving
 * a white screen — e.g. a CMS post missing a field a page assumes. This
 * catches the error, keeps the app alive, and offers a reset that remounts
 * the route tree.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Render error caught by boundary:", error, info && info.componentStack);
  }

  handleReset = () => {
    // A fresh key forces <App> (BrowserRouter + all routes) to remount,
    // discarding any half-set component state that triggered the crash.
    this.setState({ error: null, resetKey: this.state.resetKey + 1 });
  };

  render() {
    const { error, resetKey } = this.state;
    if (error) {
      return (
        <div className="min-h-screen bg-paper px-6 py-20 text-ink" data-testid="app-error-boundary">
          <div className="mx-auto max-w-xl">
            <p className="mono-label text-green-700">SOMETHING BROKE</p>
            <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight">
              This page hit an error while loading.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              The rest of the site is fine. You can go back to the blog, or start again from the
              homepage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/blog"
                className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-bold text-green"
              >
                Back to the blog
              </Link>
              <Link
                to="/"
                className="inline-flex h-11 items-center rounded-full border border-divider px-6 text-[14px] font-bold text-ink hover:border-ink"
              >
                Homepage
              </Link>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex h-11 items-center rounded-full border border-divider px-6 text-[14px] font-bold text-ink hover:border-ink"
                data-testid="error-boundary-retry"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    const Component = this.props.components;
    return <Component key={resetKey} />;
  }
}
