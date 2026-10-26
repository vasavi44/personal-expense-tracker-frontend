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
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { useAuth } from './context/AuthContext';
import expenseService, { extractErrorMessage } from './services/expenseService';
import { Loader2 } from 'lucide-react';

export function App() {
  const { user, isAuthenticated, isLoading: authLoading, login, register, logout } = useAuth();

  // Switch between 'login' and 'register' for unauthenticated users
  const [authView, setAuthView] = useState('login');

  // Master state: all saved expenses belonging to the authenticated user
  const [allExpenses, setAllExpenses] = useState([]);
  // Total summary state from backend API: totalAmount across this user's expenses
  const [totalSummary, setTotalSummary] = useState({ totalAmount: 0, count: 0 });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch expenses and total for authenticated user
  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (!isAuthenticated) return;

    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
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
        showToast('success', 'Your expenses synced successfully with server.');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      if (err.response && err.response.status === 401) {
        showToast('error', 'Session expired. Please sign in again.');
        logout();
        return;
      }
      setBackendHealth('OFFLINE');
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to load expenses: ${msg}`);
    } finally {
      setIsLoading(false);
      if (isManualRefresh) setIsRefreshing(false);
    }
  }, [isAuthenticated, logout, showToast]);

  // Load user data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setAllExpenses([]);
      setTotalSummary({ totalAmount: 0, count: 0 });
    }
  }, [isAuthenticated, fetchData]);

  // Handler: Add Expense
  const handleAddExpense = async (payload) => {
    setIsSubmitting(true);
    try {
      const created = await expenseService.createExpense(payload);
      showToast('success', `Added "${created.title}" successfully.`);
      await fetchData();
      return true;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showToast('error', 'Session expired. Please sign in again.');
        logout();
        return false;
      }
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to add expense: ${msg}`);
      return false;
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
      await fetchData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showToast('error', 'Session expired. Please sign in again.');
        logout();
        return;
      }
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
      await fetchData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showToast('error', 'Session expired. Please sign in again.');
        logout();
        return;
      }
      const msg = extractErrorMessage(err);
      showToast('error', `Failed to delete expense: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler: Logout
  const handleLogout = () => {
    logout();
    setAllExpenses([]);
    setTotalSummary({ totalAmount: 0, count: 0 });
    showToast('info', 'You have been signed out.');
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortBy('date-desc');
  };

  // Filter and Sort displayed records
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...allExpenses];

    if (selectedCategory !== 'ALL') {
      result = result.filter(
        (exp) => exp.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== '') {
      const query = searchTerm.trim().toLowerCase();
      result = result.filter((exp) =>
        exp.title?.toLowerCase().includes(query)
      );
    }

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

  // Loading spinner during initial session verification
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <Loader2 size={44} className="spin-icon primary-accent" />
        <p className="auth-loading-text">Verifying session...</p>
      </div>
    );
  }

  // Unauthenticated: render Login or Register
  if (!isAuthenticated) {
    return (
      <div className="app-layout">
        <Toast toast={toast} onClose={closeToast} />
        {authView === 'login' ? (
          <LoginPage
            onLogin={login}
            onSwitchToRegister={() => setAuthView('register')}
            showToast={showToast}
          />
        ) : (
          <RegisterPage
            onRegister={register}
            onSwitchToLogin={() => setAuthView('login')}
            showToast={showToast}
          />
        )}
      </div>
    );
  }

  // Authenticated: Render personal dashboard
  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Main Container */}
      <div className="app-container">
        {/* Header with User Info and Logout */}
        <Header
          backendHealth={backendHealth}
          onRefresh={() => fetchData(true)}
          isRefreshing={isRefreshing}
          currentUser={user}
          onLogout={handleLogout}
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
