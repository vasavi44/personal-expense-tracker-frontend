import React from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const DeleteConfirmModal = ({
  expense,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !expense) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isDeleting) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        className="modal-content modal-delete"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="modal-header">
          <div className="delete-icon-badge">
            <AlertTriangle size={24} className="danger-accent" />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Cancel deletion"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h3 id="delete-dialog-title" className="modal-title">Delete Expense?</h3>
          <p id="delete-dialog-desc" className="modal-description">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>

          <div className="delete-preview-card">
            <div className="preview-row">
              <span className="preview-label">Expense:</span>
              <span className="preview-value title-val">{expense.title}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Category:</span>
              <span className="preview-value">{expense.category}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Amount:</span>
              <span className="preview-value amount-val">{formatINR(expense.amount)}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
