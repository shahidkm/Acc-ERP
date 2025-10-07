import React, { useState, useMemo, useEffect } from 'react';
import { useGetPurchaseReturnInvoices } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
import {
  Search,
  AlertCircle,
  RotateCcw,
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
  Archive,
  Truck,
  RefreshCw,
  Receipt
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const PurchaseReturnInvoiceTable = () => {
  const { data: returnInvoices, isLoading, error } = useGetPurchaseReturnInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [exportFilter, setExportFilter] = useState('');

  const navigate = useNavigate();

  // Get status based on return processing state
  const getReturnStatus = (returnInvoice) => {
    if (returnInvoice.processed) return 'processed';
    if (returnInvoice.approved) return 'approved';
    if (returnInvoice.rejected) return 'rejected';
    return 'pending';
  };

  const statusConfig = {
    'processed': { 
      label: 'Processed', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle 
    },
    'approved': { 
      label: 'Approved', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Clock 
    },
    'pending': { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: AlertTriangle 
    },
    'rejected': { 
      label: 'Rejected', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    }
  };

  const filteredReturnInvoices = useMemo(() => {
    if (!returnInvoices || returnInvoices.length === 0) return [];

    let filtered = returnInvoices.filter(returnInvoice => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (
        returnInvoice.referenceNo?.toLowerCase().includes(search) ||
        returnInvoice.supplierName?.toLowerCase().includes(search) ||
        returnInvoice.stockAccountName?.toLowerCase().includes(search) ||
        returnInvoice.documentType?.toLowerCase().includes(search) ||
        returnInvoice.description?.toLowerCase().includes(search)
      );

      const matchesDate = !dateFilter || returnInvoice.date?.startsWith(dateFilter);
      
      const status = getReturnStatus(returnInvoice);
      const matchesStatus = !statusFilter || status === statusFilter;
      
      const matchesCurrency = !currencyFilter || returnInvoice.currency === currencyFilter;
      
      const matchesExport = exportFilter === '' || 
        (exportFilter === 'export' && returnInvoice.export) ||
        (exportFilter === 'local' && !returnInvoice.export);
      
      const minAmount = parseFloat(amountRange.min) || 0;
      const maxAmount = parseFloat(amountRange.max) || Infinity;
      const matchesAmount = returnInvoice.grandTotal >= minAmount && returnInvoice.grandTotal <= maxAmount;

      return matchesSearch && matchesDate && matchesStatus && matchesCurrency && matchesAmount && matchesExport;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date sorting
      if (sortField === 'date') {
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
  }, [returnInvoices, searchTerm, sortField, sortDirection, dateFilter, statusFilter, currencyFilter, amountRange, exportFilter]);

  const totalPages = Math.ceil(filteredReturnInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReturnInvoices = filteredReturnInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    if (!returnInvoices) return { total: 0, totalAmount: 0, processed: 0, pending: 0, approved: 0, rejected: 0 };

    const total = returnInvoices.length;
    const totalAmount = returnInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const processed = returnInvoices.filter(inv => getReturnStatus(inv) === 'processed').length;
    const pending = returnInvoices.filter(inv => getReturnStatus(inv) === 'pending').length;
    const approved = returnInvoices.filter(inv => getReturnStatus(inv) === 'approved').length;
    const rejected = returnInvoices.filter(inv => getReturnStatus(inv) === 'rejected').length;

    return { total, totalAmount, processed, pending, approved, rejected };
  }, [returnInvoices]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter, currencyFilter, amountRange, exportFilter]);

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
    navigate('/create-purchase-return-invoice');
  };

  const handleView = (returnInvoiceId) => {
    navigate(`/purchase-return-invoice/${returnInvoiceId}`);
  };

  const handleEdit = (returnInvoiceId) => {
    navigate(`/edit-purchase-return-invoice/${returnInvoiceId}`);
  };

  const handleDelete = (returnInvoiceId) => {
    console.log('Delete return invoice:', returnInvoiceId);
  };

  const formatCurrency = (amount, symbol = '$') => {
    const number = parseFloat(amount) || 0;
    return `${symbol}${number.toLocaleString('en-US', { 
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

  const uniqueCurrencies = [...new Set(returnInvoices?.map(inv => inv.currency).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="text-gray-600">Loading purchase return invoices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Purchase Return Invoices</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        
        {/* Header with Statistics */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                    <RotateCcw className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Purchase Return Invoices
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage and track all purchase return invoices</p>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-lg font-bold text-red-600">{formatCurrency(stats.totalAmount)}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-green-600">Processed</div>
                    <div className="text-lg font-bold text-green-700">{stats.processed}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-blue-600">Approved</div>
                    <div className="text-lg font-bold text-blue-700">{stats.approved}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-yellow-600">Pending</div>
                    <div className="text-lg font-bold text-yellow-700">{stats.pending}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-red-600">Rejected</div>
                    <div className="text-lg font-bold text-red-700">{stats.rejected}</div>
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
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Return Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search returns, suppliers, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="processed">Processed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Currency Filter */}
              <div>
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white"
                >
                  <option value="">All Currencies</option>
                  {uniqueCurrencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              {/* Export Filter */}
              <div>
                <select
                  value={exportFilter}
                  onChange={(e) => setExportFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white"
                >
                  <option value="">All Types</option>
                  <option value="export">Export Returns</option>
                  <option value="local">Local Returns</option>
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
                    className="w-1/2 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || dateFilter || statusFilter || currencyFilter || exportFilter || amountRange.min || amountRange.max) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                    setStatusFilter('');
                    setCurrencyFilter('');
                    setExportFilter('');
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
              <thead className="bg-gradient-to-r from-red-50 to-rose-100">
                <tr>
                  <th 
                    onClick={() => handleSort('referenceNo')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-red-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Reference {getSortIcon('referenceNo')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('date')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-red-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date {getSortIcon('date')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Supplier & Stock
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Original Invoice
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document & Export
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('grandTotal')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-red-200 transition-colors duration-200"
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
                {paginatedReturnInvoices.map((returnInvoice, index) => {
                  const status = getReturnStatus(returnInvoice);
                  const statusInfo = statusConfig[status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr 
                      key={returnInvoice.id} 
                      className={`hover:bg-red-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {/* Reference Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <RotateCcw className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{returnInvoice.referenceNo}</div>
                            <div className="text-xs text-gray-500">ID: {returnInvoice.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(returnInvoice.date)}</div>
                        <div className="text-xs text-gray-500">Return Date</div>
                      </td>

                      {/* Supplier & Stock Account */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{returnInvoice.supplierName}</div>
                          <div className="text-gray-500 text-xs flex items-center gap-1">
                            <Archive className="h-3 w-3" />
                            {returnInvoice.stockAccountName}
                          </div>
                        </div>
                      </td>

                      {/* Original Purchase Invoice */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {returnInvoice.purchaseInvoiceId ? (
                            <>
                              <div className="font-medium text-gray-900">
                                INV-{returnInvoice.purchaseInvoiceId}
                              </div>
                              <div className="text-xs text-gray-500">Original Invoice</div>
                            </>
                          ) : (
                            <div className="text-gray-400 text-xs">No reference</div>
                          )}
                        </div>
                      </td>

                      {/* Document Info & Export */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{returnInvoice.documentType}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {returnInvoice.export && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                <Truck className="h-3 w-3" />
                                Export
                              </div>
                            )}
                            {returnInvoice.foreignCurrency && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                <Globe className="h-3 w-3" />
                                {returnInvoice.currency}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(returnInvoice.grandTotal, returnInvoice.currency)}
                          </div>
                          {returnInvoice.foreignCurrency && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Rate: {returnInvoice.currencyRate}
                            </div>
                          )}
                          {returnInvoice.discount > 0 && (
                            <div className="text-xs text-green-600">
                              {returnInvoice.discount}% discount applied
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
                            onClick={() => handleView(returnInvoice.id)}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            title="View Return Invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(returnInvoice.id)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title="Edit Return Invoice"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(returnInvoice.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete Return Invoice"
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
          {paginatedReturnInvoices.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <RotateCcw className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purchase Return Invoices Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || dateFilter || statusFilter || currencyFilter || exportFilter ? 
                  'No return invoices match your current filters. Try adjusting your search criteria.' : 
                  'Get started by creating your first purchase return invoice.'
                }
              </p>
              {!searchTerm && !dateFilter && !statusFilter && !currencyFilter && !exportFilter && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Return Invoice
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredReturnInvoices.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReturnInvoices.length)} of {filteredReturnInvoices.length} return invoices
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

        {/* Additional Info Panel */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Return Invoice Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">Quick Actions</p>
              <p className="text-red-700 text-sm">
                View, edit, or process return invoices with comprehensive tracking and status management.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">Export Support</p>
              <p className="text-red-700 text-sm">
                Handle both local and export return transactions with multi-currency support.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">Integration</p>
              <p className="text-red-700 text-sm">
                Linked to original purchase invoices and stock accounts for accurate inventory management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturnInvoiceTable;