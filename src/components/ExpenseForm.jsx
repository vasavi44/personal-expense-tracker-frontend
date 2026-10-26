import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const ExpenseForm = ({ onAddExpense, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: getTodayString(),
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Expense title cannot be empty or only spaces';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.amount || formData.amount === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(formData.amount);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.amount = 'Amount must be a valid number greater than zero (₹)';
      }
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Please select a valid category';
    }

    if (!formData.date) {
      newErrors.date = 'Expense date is required';
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
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission

    if (!validate()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    const success = await onAddExpense(payload);

    // Requirement: Clear the form after a successful submission.
    // Do not clear the form when a request fails.
    if (success) {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: getTodayString(),
      });
      setErrors({});
    }
  };

  return (
    <div className="card-container form-card">
      <div className="card-header">
        <h2 className="card-title">Add New Expense</h2>
        <span className="card-subtitle">Record your recent spend into the system</span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="expense-form">
        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="expense-title" className="form-label">
              Expense Title <span className="required-star">*</span>
            </label>
            <input
              id="expense-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Grocery items at supermarket"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              maxLength={100}
              required
            />
            {errors.title && <span className="field-error-msg">{errors.title}</span>}
          </div>

          {/* Amount in INR */}
          <div className="form-group">
            <label htmlFor="expense-amount" className="form-label">
              Amount in Rupees (₹) <span className="required-star">*</span>
            </label>
            <div className="input-currency-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                id="expense-amount"
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="0.00"
                className={`form-input has-prefix ${errors.amount ? 'input-error' : ''}`}
                required
              />
            </div>
            {errors.amount && <span className="field-error-msg">{errors.amount}</span>}
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="expense-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="expense-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`form-select ${errors.category ? 'input-error' : ''}`}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="field-error-msg">{errors.category}</span>}
          </div>

          {/* Date Picker */}
          <div className="form-group">
            <label htmlFor="expense-date" className="form-label">
              Expense Date <span className="required-star">*</span>
            </label>
            <input
              id="expense-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              required
            />
            {errors.date && <span className="field-error-msg">{errors.date}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            id="btn-add-expense"
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>Saving Expense...</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Add Expense</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
