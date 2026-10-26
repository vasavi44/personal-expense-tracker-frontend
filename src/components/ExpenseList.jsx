import React from 'react';
import { Pencil, Trash2, Calendar, Tag, AlertCircle, Inbox, Loader2 } from 'lucide-react';
import { formatINR, formatDate, CATEGORY_METADATA } from '../utils/formatters';

export const ExpenseList = ({
  expenses,
  isLoading,
  totalSavedCount,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="card-container state-card loading-state">
        <Loader2 size={36} className="spin-icon primary-accent" />
        <h3 className="state-title">Loading expenses...</h3>
        <p className="state-description">Fetching your records from the server.</p>
      </div>
    );
  }

  // Entirely empty state (No expenses saved in database yet)
  if (totalSavedCount === 0) {
    return (
      <div className="card-container state-card empty-state">
        <div className="empty-icon-wrapper">
          <Inbox size={42} className="empty-icon" />
        </div>
        <h3 className="state-title">No expenses recorded yet</h3>
        <p className="state-description">
          Start building your financial journal by adding your first expense using the form above.
        </p>
      </div>
    );
  }

  // Filter yielded zero results
  if (expenses.length === 0) {
    return (
      <div className="card-container state-card empty-filter-state">
        <div className="empty-icon-wrapper">
          <AlertCircle size={40} className="empty-icon" />
        </div>
        <h3 className="state-title">No matching expenses found</h3>
        <p className="state-description">
          We couldn't find any expenses matching your active search or category criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="card-container table-card">
      <div className="card-header table-card-header">
        <h2 className="card-title">Recorded Expenses</h2>
        <span className="card-subtitle">Detailed log of transactions</span>
      </div>

      {/* Desktop Table View */}
      <div className="table-responsive-desktop">
        <table className="expenses-table">
          <thead>
            <tr>
              <th scope="col" className="th-title">Expense Title</th>
              <th scope="col" className="th-category">Category</th>
              <th scope="col" className="th-date">Date</th>
              <th scope="col" className="th-amount text-right">Amount (₹)</th>
              <th scope="col" className="th-actions text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const meta = CATEGORY_METADATA[expense.category] || CATEGORY_METADATA.Other;
              return (
                <tr key={expense.id} className="expense-row">
                  <td className="td-title">
                    <span className="expense-item-title">{expense.title}</span>
                  </td>
                  <td className="td-category">
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: meta.bg,
                        color: meta.color,
                        borderColor: meta.border,
                      }}
                    >
                      <Tag size={12} className="badge-icon" />
                      {expense.category}
                    </span>
                  </td>
                  <td className="td-date">
                    <div className="date-wrapper">
                      <Calendar size={14} className="date-icon" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </td>
                  <td className="td-amount text-right">
                    <span className="amount-inr">{formatINR(expense.amount)}</span>
                  </td>
                  <td className="td-actions text-center">
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        onClick={() => onEdit(expense)}
                        title={`Edit "${expense.title}"`}
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Pencil size={15} />
                        <span className="action-btn-text">Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        onClick={() => onDelete(expense)}
                        title={`Delete "${expense.title}"`}
                        aria-label={`Delete ${expense.title}`}
                      >
                        <Trash2 size={15} />
                        <span className="action-btn-text">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card / List Layout */}
      <div className="mobile-cards-list">
        {expenses.map((expense) => {
          const meta = CATEGORY_METADATA[expense.category] || CATEGORY_METADATA.Other;
          return (
            <div key={expense.id} className="mobile-expense-card">
              <div className="mobile-card-header">
                <span className="mobile-expense-title">{expense.title}</span>
                <span className="mobile-expense-amount">{formatINR(expense.amount)}</span>
              </div>

              <div className="mobile-card-meta">
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: meta.bg,
                    color: meta.color,
                    borderColor: meta.border,
                  }}
                >
                  <Tag size={12} className="badge-icon" />
                  {expense.category}
                </span>

                <div className="date-wrapper">
                  <Calendar size={13} className="date-icon" />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </div>

              <div className="mobile-card-actions">
                <button
                  type="button"
                  className="btn-action btn-action-edit"
                  onClick={() => onEdit(expense)}
                  aria-label={`Edit ${expense.title}`}
                >
                  <Pencil size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="btn-action btn-action-delete"
                  onClick={() => onDelete(expense)}
                  aria-label={`Delete ${expense.title}`}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
