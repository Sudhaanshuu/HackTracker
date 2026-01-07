import React, { useState } from 'react';
import Button from './shared/Button';
import Layout from './shared/Layout';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const ADMIN_PIN = '418667';

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onLogin();
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <Layout title="Admin Access" onBack={onBack}>
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <span className="admin-icon">🔐</span>
              <h2>Admin Access</h2>
              <p>Enter the admin PIN to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-login-form">
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="pin">Admin PIN</label>
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" variant="primary" className="login-button">
                Access Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;