import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import { extractErrorMessage } from '../services/expenseService';

export const RegisterPage = ({ onRegister, onSwitchToLogin, showToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email address cannot be empty';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onRegister(formData.name.trim(), formData.email.trim(), formData.password);
      showToast('success', 'Account registered successfully! Welcome to your Expense Tracker.');
    } catch (err) {
      const msg = extractErrorMessage(err);
      showToast('error', msg || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="logo-badge">
            <Wallet className="logo-icon" size={26} />
          </div>
          <div className="auth-brand-text">
            <h1 className="auth-title">Expense Tracker</h1>
            <span className="badge-currency">INR (₹)</span>
          </div>
        </div>

        <div className="auth-header">
          <h2 className="auth-heading">Create your account</h2>
          <p className="auth-subheading">Start tracking your personal expenses privately and securely</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Vasavi Pulluri"
              autoComplete="name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              maxLength={100}
              required
            />
            {errors.name && <span className="field-error-msg">{errors.name}</span>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="you@example.com"
              autoComplete="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              required
            />
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              Password <span className="required-star">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className={`form-input password-input ${errors.password ? 'input-error' : ''}`}
                required
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="field-error-msg">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={`form-input password-input ${errors.confirmPassword ? 'input-error' : ''}`}
                required
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error-msg">{errors.confirmPassword}</span>}
          </div>

          <button
            id="btn-register-submit"
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-footer-text">Already have an account?</span>
          <button
            type="button"
            className="btn-link"
            onClick={onSwitchToLogin}
            disabled={isSubmitting}
          >
            <ArrowLeft size={14} />
            <span>Sign in instead</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
