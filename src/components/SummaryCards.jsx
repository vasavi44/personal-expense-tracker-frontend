import React from 'react';
import { IndianRupee, ReceiptText, TrendingUp, Layers } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const SummaryCards = ({ totalAmount, totalCount, filteredCount, activeCategory }) => {
  const avgExpense = totalCount > 0 ? Number(totalAmount) / totalCount : 0;

  return (
    <section className="summary-section" aria-label="Financial Summary Cards">
      {/* Total Expenses Card (Mandatory Requirement: Complete Dataset Total) */}
      <div className="summary-card card-primary">
        <div className="card-top">
          <span className="card-label">Total Expenses</span>
          <div className="card-icon-wrapper icon-emerald">
            <IndianRupee size={22} />
          </div>
        </div>
        <div className="card-main">
          <span className="card-value total-value">{formatINR(totalAmount)}</span>
        </div>
        <div className="card-footer">
          <span className="card-hint">
            Calculated across all <strong>{totalCount}</strong> recorded expenses
          </span>
        </div>
      </div>

      {/* Number of Expenses Card */}
      <div className="summary-card">
        <div className="card-top">
          <span className="card-label">Number of Expenses</span>
          <div className="card-icon-wrapper icon-blue">
            <ReceiptText size={22} />
          </div>
        </div>
        <div className="card-main">
          <span className="card-value">{totalCount}</span>
          <span className="card-unit">transactions</span>
        </div>
        <div className="card-footer">
          <span className="card-hint">
            {activeCategory !== 'ALL' || filteredCount !== totalCount ? (
              <>Showing <strong>{filteredCount}</strong> filtered of {totalCount}</>
            ) : (
              'All records currently displayed'
            )}
          </span>
        </div>
      </div>

      {/* Average Spend per Expense */}
      <div className="summary-card">
        <div className="card-top">
          <span className="card-label">Average Transaction</span>
          <div className="card-icon-wrapper icon-amber">
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="card-main">
          <span className="card-value">{formatINR(avgExpense)}</span>
        </div>
        <div className="card-footer">
          <span className="card-hint">Per logged expense</span>
        </div>
      </div>

      {/* Active Category Scope */}
      <div className="summary-card">
        <div className="card-top">
          <span className="card-label">Category Scope</span>
          <div className="card-icon-wrapper icon-purple">
            <Layers size={22} />
          </div>
        </div>
        <div className="card-main">
          <span className="card-value category-scope-value">
            {activeCategory === 'ALL' ? 'All Categories' : activeCategory}
          </span>
        </div>
        <div className="card-footer">
          <span className="card-hint">
            {activeCategory === 'ALL' ? 'Unfiltered view' : `Filtered to ${activeCategory}`}
          </span>
        </div>
      </div>
    </section>
  );
};

export default SummaryCards;
