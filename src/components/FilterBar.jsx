import React from 'react';
import { Search, X, Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'ALL' || sortBy !== 'date-desc';

  return (
    <div className="filter-bar card-container">
      <div className="filter-controls-row">
        {/* Search Input */}
        <div className="search-field-wrapper">
          <label htmlFor="search-expenses" className="sr-only">
            Search expenses by title
          </label>
          <Search size={18} className="search-icon" />
          <input
            id="search-expenses"
            type="text"
            placeholder="Search expenses by title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="select-field-wrapper">
          <label htmlFor="filter-category" className="field-inline-label">
            <Filter size={16} />
            <span>Category:</span>
          </label>
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="select-field-wrapper">
          <label htmlFor="sort-expenses" className="field-inline-label">
            <ArrowUpDown size={16} />
            <span>Sort:</span>
          </label>
          <select
            id="sort-expenses"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-reset"
            onClick={onResetFilters}
            title="Reset search and filters"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results Count Line */}
      <div className="filter-summary-row">
        <span className="results-badge">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> total expenses
        </span>
        {selectedCategory !== 'ALL' && (
          <span className="active-filter-pill">
            Category: <strong>{selectedCategory}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
