import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import EditModal from './components/EditModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import expenseService, { extractErrorMessage } from './services/expenseService';

export function App() {
  // Master state: all saved expenses from database
  const [allExpenses, setAllExpenses] = useState([]);
  // Total summary state from backend API: totalAmount across ALL expenses
  const [totalSummary, setTotalSummary] = useState({ totalAmount: 0, count: 0 });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendHealth, setBackendHealth] = useState('CHECKING'); // 'CHECKING' | 'CONNECTED' | 'OFFLINE'

  // Filter & Search & Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modals state
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch all expenses and total from the backend
  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      // Parallel fetch for expenses and total
      const [expensesData, totalData] = await Promise.all([
        expenseService.getExpenses(),
        expenseService.getTotalExpenses(),
      ]);

      setAllExpenses(Array.isArray(expensesData) ? expensesData : []);
      setTotalSummary({
        totalAmount: totalData?.totalAmount !== undefined ? totalData.totalAmount : 0,
        count: totalData?.count !== undefined ? totalData.count : (expensesData?.length || 0),
      });
      setBackendHealth('CONNECTED');

      if (isManualRefresh) {
        showToast('success', 'Expenses synced successfully with server.');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setBackendHealth('OFFLINE');
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to load expenses: ${msg}`);
    } finally {
      setIsLoading(false);
      if (isManualRefresh) setIsRefreshing(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler: Add Expense
  const handleAddExpense = async (payload) => {
    setIsSubmitting(true);
    try {
      const created = await expenseService.createExpense(payload);
      showToast('success', `Added "${created.title}" successfully.`);
      // Refresh complete dataset and accurate server total
      await fetchData();
      return true;
    } catch (err) {
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to add expense: ${msg}`);
      return false; // Do not clear form on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  // Handler: Close Edit Modal
  const handleCloseEdit = () => {
    if (!isSavingEdit) {
      setEditingExpense(null);
      setIsEditModalOpen(false);
    }
  };

  // Handler: Save Edited Expense
  const handleSaveEdit = async (id, payload) => {
    setIsSavingEdit(true);
    try {
      const updated = await expenseService.updateExpense(id, payload);
      showToast('success', `Updated "${updated.title}" successfully.`);
      setIsEditModalOpen(false);
      setEditingExpense(null);
      // Refresh complete dataset and accurate server total
      await fetchData();
    } catch (err) {
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to update expense: ${msg}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handler: Open Delete Modal
  const handleOpenDelete = (expense) => {
    setDeletingExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // Handler: Close Delete Modal
  const handleCloseDelete = () => {
    if (!isDeleting) {
      setDeletingExpense(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Handler: Confirm Delete
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(id);
      showToast('success', 'Expense deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeletingExpense(null);
      // Refresh complete dataset and accurate server total
      await fetchData();
    } catch (err) {
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to delete expense: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortBy('date-desc');
  };

  // Filter and Sort displayed records
  // Crucial Rule: The Total Expense card MUST use totalSummary.totalAmount (all saved records),
  // while the table displays the filtered/searched records.
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...allExpenses];

    // Filter by category
    if (selectedCategory !== 'ALL') {
      result = result.filter(
        (exp) => exp.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query (title)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.trim().toLowerCase();
      result = result.filter((exp) =>
        exp.title?.toLowerCase().includes(query)
      );
    }

    // Sort order
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date) || a.id - b.id;
        case 'amount-desc':
          return Number(b.amount) - Number(a.amount);
        case 'amount-asc':
          return Number(a.amount) - Number(b.amount);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date) || b.id - a.id;
      }
    });

    return result;
  }, [allExpenses, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Main Container */}
      <div className="app-container">
        {/* Header */}
        <Header
          backendHealth={backendHealth}
          onRefresh={() => fetchData(true)}
          isRefreshing={isRefreshing}
        />

        {/* Financial Summary Cards */}
        <SummaryCards
          totalAmount={totalSummary.totalAmount}
          totalCount={totalSummary.count}
          filteredCount={filteredAndSortedExpenses.length}
          activeCategory={selectedCategory}
        />

        {/* Add Expense Form Card */}
        <ExpenseForm
          onAddExpense={handleAddExpense}
          isSubmitting={isSubmitting}
        />

        {/* Search, Filter & Sort Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          totalCount={allExpenses.length}
          filteredCount={filteredAndSortedExpenses.length}
        />

        {/* Expenses Table / Cards View */}
        <ExpenseList
          expenses={filteredAndSortedExpenses}
          isLoading={isLoading}
          totalSavedCount={allExpenses.length}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        {/* Footer */}
        <Footer />
      </div>

      {/* Edit Modal Dialog */}
      <EditModal
        expense={editingExpense}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        isSaving={isSavingEdit}
      />

      {/* Delete Confirmation Modal Dialog */}
      <DeleteConfirmModal
        expense={deletingExpense}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default App;
