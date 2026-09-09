import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  X
} from 'lucide-react';

import {
  adminLogin,
  saveAdminSession,
  getAdminToken
} from '../../services/api';

import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    document.title =
      'Admin Login | Vyntara Technologies';

    return () => {
      document.title =
        'Vyntara Technologies';
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (!username.trim()) {
      setError(
        'Please enter your username.'
      );

      return;
    }

    if (!password) {
      setError(
        'Please enter your password.'
      );

      return;
    }

    try {
      setLoading(true);

      const data = await adminLogin(
        username.trim(),
        password
      );

      saveAdminSession(data);

      window.location.href =
        '/admin/dashboard';

    } catch (err) {
      setError(
        err.message ||
          'Invalid username or password.'
      );

    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    window.location.href = '/';
  };

  /*
  |--------------------------------------------------------------------------
  | If already logged in
  |--------------------------------------------------------------------------
  */

  if (getAdminToken()) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-bg">
          <div className="admin-login-grid" />
          <div className="admin-login-glow admin-login-glow-one" />
          <div className="admin-login-glow admin-login-glow-two" />
        </div>

        <div className="admin-login-existing">
          <div className="admin-login-existing-icon">
            <ShieldCheck size={28} />
          </div>

          <h2>
            Already Signed In
          </h2>

          <p>
            You already have an active
            Vyntara admin session.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                '/admin/dashboard';
            }}
          >
            <span>
              Open Dashboard
            </span>

            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="admin-login-existing-back"
            onClick={handleBackToWebsite}
          >
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">

      {/* Background */}

      <div className="admin-login-bg">
        <div className="admin-login-grid" />

        <div className="admin-login-glow admin-login-glow-one" />

        <div className="admin-login-glow admin-login-glow-two" />

        <div className="admin-login-orbit admin-login-orbit-one" />

        <div className="admin-login-orbit admin-login-orbit-two" />

        <div className="admin-login-particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Top navigation */}

      <header className="admin-login-topbar">

        <button
          type="button"
          className="admin-login-brand"
          onClick={handleBackToWebsite}
          aria-label="Back to Vyntara website"
        >
          <span className="admin-login-brand-mark">
            V
          </span>

          <span className="admin-login-brand-text">
            <strong>
              VYNTARA
            </strong>

            <small>
              TECHNOLOGIES
            </small>
          </span>
        </button>

        <button
          type="button"
          className="admin-login-close"
          onClick={handleBackToWebsite}
          aria-label="Close admin login"
        >
          <X size={19} />
        </button>

      </header>

      {/* Login area */}

      <main className="admin-login-content">

        <div className="admin-login-card">

          {/* Card top */}

          <div className="admin-login-card-top">

            <div className="admin-login-icon">
              <LockKeyhole size={25} />
            </div>

            <div className="admin-login-secure">
              <ShieldCheck size={14} />
              <span>
                SECURE ADMIN ACCESS
              </span>
            </div>

          </div>

          {/* Heading */}

          <div className="admin-login-heading">

            <span className="admin-login-eyebrow">
              VYNTARA TECHNOLOGIES
            </span>

            <h1>
              Welcome
              <span> Back.</span>
            </h1>

            <p>
              Sign in to access your
              Vyntara administration
              dashboard.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div
              className="admin-login-error"
              role="alert"
            >
              <span className="admin-login-error-dot" />

              <span>
                {error}
              </span>
            </div>
          )}

          {/* Form */}

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >

            {/* Username */}

            <div className="admin-login-field">

              <label htmlFor="admin-username">
                Username
              </label>

              <div className="admin-login-input-wrap">

                <UserRound
                  size={18}
                  className="admin-login-input-icon"
                />

                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Password */}

            <div className="admin-login-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-login-input-wrap">

                <LockKeyhole
                  size={18}
                  className="admin-login-input-icon"
                />

                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="admin-login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-login-spinner" />

                  <span>
                    Signing In...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Sign In
                  </span>

                  <span className="admin-login-submit-icon">
                    <ArrowRight size={18} />
                  </span>
                </>
              )}

            </button>

          </form>

          {/* Footer */}

          <div className="admin-login-card-footer">

            <div>
              <ShieldCheck size={14} />

              <span>
                Protected Admin Area
              </span>
            </div>

            <span>
              VYNTARA • 2026
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminLogin;