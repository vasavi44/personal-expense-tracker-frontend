import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

export const EditModal = ({ expense, isOpen, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount !== undefined ? expense.amount.toString() : '',
        category: expense.category || 'Food',
        date: expense.date || '',
      });
      setErrors({});
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

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
        newErrors.amount = 'Amount must be a valid number greater than zero';
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    await onSave(expense.id, payload);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isSaving) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        className="modal-content modal-edit"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="edit-modal-title" className="modal-title">Edit Expense</h3>
            <span className="modal-subtitle">Update transaction details</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Expense Title <span className="required-star">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSaving}
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              maxLength={100}
              required
            />
            {errors.title && <span className="field-error-msg">{errors.title}</span>}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="edit-amount" className="form-label">
              Amount in Rupees (₹) <span className="required-star">*</span>
            </label>
            <div className="input-currency-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                id="edit-amount"
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                disabled={isSaving}
                className={`form-input has-prefix ${errors.amount ? 'input-error' : ''}`}
                required
              />
            </div>
            {errors.amount && <span className="field-error-msg">{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="edit-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSaving}
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

          {/* Date */}
          <div className="form-group">
            <label htmlFor="edit-date" className="form-label">
              Expense Date <span className="required-star">*</span>
            </label>
            <input
              id="edit-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSaving}
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              required
            />
            {errors.date && <span className="field-error-msg">{errors.date}</span>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
