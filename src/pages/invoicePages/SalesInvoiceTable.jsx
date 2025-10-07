import React, { useState, useMemo, useEffect } from 'react';
import { useGetSalesInvoices } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
import {
  Search,
  AlertCircle,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Calendar,
  User,
  Building,
  DollarSign,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Percent,
  CreditCard,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const SalesInvoiceTable = () => {
  const { data: salesInvoices, isLoading, error } = useGetSalesInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('voucherId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });

  const navigate = useNavigate();

  // Get status based on due date and status field
  const getInvoiceStatus = (invoice) => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // Check voucher status first
    if (invoice.status === 1) return 'approved';
    if (invoice.status === 2) return 'rejected';
    if (invoice.status === 3) return 'cancelled';
    
    // For draft status (0), check due dates
    if (daysDiff < 0) return 'overdue';
    if (daysDiff <= 7) return 'due-soon';
    return 'pending';
  };

  const statusConfig = {
    'approved': { 
      label: 'Approved', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle 
    },
    'pending': { 
      label: 'Pending', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Clock 
    },
    'overdue': { 
      label: 'Overdue', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    },
    'due-soon': { 
      label: 'Due Soon', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: AlertTriangle 
    },
    'rejected': { 
      label: 'Rejected', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    },
    'cancelled': { 
      label: 'Cancelled', 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: XCircle 
    }
  };

  // Get total items count from lines
  const getTotalItems = (invoice) => {
    if (!invoice.lines) return 0;
    return invoice.lines.reduce((total, line) => {
      return total + (line.salesItems?.length || 0);
    }, 0);
  };

  const filteredInvoices = useMemo(() => {
    if (!salesInvoices || salesInvoices.length === 0) return [];

    let filtered = salesInvoices.filter(invoice => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (
        invoice.voucherNo?.toLowerCase().includes(search) ||
        invoice.referenceNo?.toLowerCase().includes(search) ||
        invoice.remarks?.toLowerCase().includes(search) ||
        invoice.createdBy?.toLowerCase().includes(search) ||
        invoice.lines?.some(line => 
          line.description?.toLowerCase().includes(search) ||
          line.reference?.toLowerCase().includes(search) ||
          line.partyName?.toLowerCase().includes(search) ||
          line.jobCode?.toLowerCase().includes(search)
        )
      );

      const matchesDate = !dateFilter || invoice.voucherDate?.startsWith(dateFilter);
      
      const status = getInvoiceStatus(invoice);
      const matchesStatus = !statusFilter || status === statusFilter;
      
      const matchesCurrency = !currencyFilter || invoice.currency === currencyFilter;
      
      const minAmount = parseFloat(amountRange.min) || 0;
      const maxAmount = parseFloat(amountRange.max) || Infinity;
      const matchesAmount = (invoice.grandTotal || 0) >= minAmount && (invoice.grandTotal || 0) <= maxAmount;

      return matchesSearch && matchesDate && matchesStatus && matchesCurrency && matchesAmount;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date sorting
      if (sortField === 'voucherDate' || sortField === 'dueDate' || sortField === 'createdOn') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (aVal instanceof Date) {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [salesInvoices, searchTerm, sortField, sortDirection, dateFilter, statusFilter, currencyFilter, amountRange]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    if (!salesInvoices) return { total: 0, totalAmount: 0, approved: 0, pending: 0, overdue: 0, totalItems: 0 };

    const total = salesInvoices.length;
    const totalAmount = salesInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const approved = salesInvoices.filter(inv => getInvoiceStatus(inv) === 'approved').length;
    const pending = salesInvoices.filter(inv => getInvoiceStatus(inv) === 'pending').length;
    const overdue = salesInvoices.filter(inv => getInvoiceStatus(inv) === 'overdue').length;
    const totalItems = salesInvoices.reduce((sum, inv) => sum + getTotalItems(inv), 0);

    return { total, totalAmount, approved, pending, overdue, totalItems };
  }, [salesInvoices]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter, currencyFilter, amountRange]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleCreateNew = () => {
    navigate('/create-sales-invoice');
  };

  const handleView = (invoiceId) => {
    navigate(`/sales-invoice/${invoiceId}`);
  };

  const handleEdit = (invoiceId) => {
    navigate(`/edit-sales-invoice/${invoiceId}`);
  };

  const handleDelete = (invoiceId) => {
    console.log('Delete invoice:', invoiceId);
  };

  const formatCurrency = (amount, currency = '$') => {
    const number = parseFloat(amount) || 0;
    return `${currency}${number.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueCurrencies = [...new Set(salesInvoices?.map(inv => inv.currency).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading sales invoices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Sales Invoices</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        
        {/* Header with Statistics */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Sales Invoices
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage and track all sales invoices</p>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-lg font-bold text-emerald-600">{formatCurrency(stats.totalAmount)}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-green-600">Approved</div>
                    <div className="text-lg font-bold text-green-700">{stats.approved}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-blue-600">Pending</div>
                    <div className="text-lg font-bold text-blue-700">{stats.pending}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-red-600">Overdue</div>
                    <div className="text-lg font-bold text-red-700">{stats.overdue}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-purple-600">Total Items</div>
                    <div className="text-lg font-bold text-purple-700">{stats.totalItems}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search invoices, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="overdue">Overdue</option>
                  <option value="due-soon">Due Soon</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Currency Filter */}
              <div>
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white"
                >
                  <option value="">All Currencies</option>
                  {uniqueCurrencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              {/* Amount Range */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || dateFilter || statusFilter || currencyFilter || amountRange.min || amountRange.max) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                    setStatusFilter('');
                    setCurrencyFilter('');
                    setAmountRange({ min: '', max: '' });
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th 
                    onClick={() => handleSort('voucherNo')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Invoice No {getSortIcon('voucherNo')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('voucherDate')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date {getSortIcon('voucherDate')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer & Details
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Items & Orders
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('dueDate')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Due Date {getSortIcon('dueDate')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('grandTotal')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Amount {getSortIcon('grandTotal')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedInvoices.map((invoice, index) => {
                  const status = getInvoiceStatus(invoice);
                  const statusInfo = statusConfig[status];
                  const StatusIcon = statusInfo.icon;
                  const totalItems = getTotalItems(invoice);

                  return (
                    <tr 
                      key={invoice.voucherId} 
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {/* Invoice Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <ShoppingCart className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{invoice.voucherNo}</div>
                            <div className="text-xs text-gray-500">
                              {invoice.referenceNo ? `Ref: ${invoice.referenceNo}` : `ID: ${invoice.voucherId}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(invoice.voucherDate)}</div>
                        <div className="text-xs text-gray-500">
                          {invoice.days ? `${invoice.days} days` : 'Immediate'}
                        </div>
                      </td>

                      {/* Customer & Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {invoice.lines?.[0]?.partyName || 'N/A'}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {invoice.createdBy}
                          </div>
                          {invoice.jobCodeId > 0 && (
                            <div className="text-xs text-blue-600">Job: {invoice.jobCodeId}</div>
                          )}
                        </div>
                      </td>

                      {/* Items & Orders */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {totalItems} item(s)
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.lines?.length || 0} line(s)
                          </div>
                          {invoice.salesOrderId && (
                            <div className="text-xs text-green-600">SO: {invoice.salesOrderId}</div>
                          )}
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
                        {status === 'overdue' && (
                          <div className="text-xs text-red-600 font-medium">
                            {Math.abs(Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))} days overdue
                          </div>
                        )}
                        {status === 'due-soon' && (
                          <div className="text-xs text-yellow-600 font-medium">
                            Due in {Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(invoice.grandTotal, invoice.currency)}
                          </div>
                          {invoice.subtotal !== invoice.grandTotal && (
                            <div className="text-xs text-gray-500">
                              Subtotal: {formatCurrency(invoice.subtotal, invoice.currency)}
                            </div>
                          )}
                          {invoice.discount > 0 && (
                            <div className="text-xs text-green-600">
                              {invoice.discount}% discount
                            </div>
                          )}
                          {invoice.totalVATAmount > 0 && (
                            <div className="text-xs text-blue-600">
                              VAT: {formatCurrency(invoice.totalVATAmount, invoice.currency)}
                            </div>
                          )}
                          {invoice.foreignCurrency && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Rate: {invoice.currencyRate}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(invoice.voucherId)}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            title="View Invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(invoice.voucherId)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title="Edit Invoice"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.voucherId)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete Invoice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedInvoices.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sales Invoices Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || dateFilter || statusFilter || currencyFilter ? 
                  'No invoices match your current filters. Try adjusting your search criteria.' : 
                  'Get started by creating your first sales invoice.'
                }
              </p>
              {!searchTerm && !dateFilter && !statusFilter && !currencyFilter && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Invoice
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                >
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700 px-4 py-2 bg-gray-100 rounded-lg font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesInvoiceTable;