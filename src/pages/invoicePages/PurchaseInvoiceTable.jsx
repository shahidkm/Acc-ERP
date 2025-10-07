import React, { useState, useMemo, useEffect } from 'react';
import { useGetPurchaseInvoices } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
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
  CreditCard
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const PurchaseVoucherTable = () => {
  const { data: vouchers, isLoading, error } = useGetPurchaseInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('voucherId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });

  const navigate = useNavigate();

  // Get status based on voucher status field
  const getVoucherStatus = (voucher) => {
    switch (voucher.status) {
      case 0: return 'draft';
      case 1: return 'approved';
      case 2: return 'rejected';
      case 3: return 'cancelled';
      default: return 'draft';
    }
  };

  const statusConfig = {
    'draft': { 
      label: 'Draft', 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: Clock 
    },
    'approved': { 
      label: 'Approved', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle 
    },
    'rejected': { 
      label: 'Rejected', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    },
    'cancelled': { 
      label: 'Cancelled', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: AlertTriangle 
    }
  };

  const voucherTypes = {
    1: 'General Voucher',
    2: 'Payment Voucher',
    3: 'Receipt Voucher',
    4: 'Journal Voucher',
    5: 'Purchase Voucher'
  };

  // Calculate total amount from lines
  const getVoucherTotal = (voucher) => {
    if (!voucher.lines || voucher.lines.length === 0) return 0;
    return voucher.lines.reduce((total, line) => total + (line.amount || 0), 0);
  };

  const filteredVouchers = useMemo(() => {
    if (!vouchers || vouchers.length === 0) return [];

    let filtered = vouchers.filter(voucher => {
      const search = searchTerm.toLowerCase();
      const voucherTotal = getVoucherTotal(voucher);
      
      const matchesSearch = (
        voucher.voucherNo?.toLowerCase().includes(search) ||
        voucher.remarks?.toLowerCase().includes(search) ||
        voucher.createdBy?.toLowerCase().includes(search) ||
        voucher.lines?.some(line => 
          line.description?.toLowerCase().includes(search) ||
          line.reference?.toLowerCase().includes(search) ||
          line.jobCode?.toLowerCase().includes(search)
        )
      );

      const matchesDate = !dateFilter || voucher.voucherDate?.startsWith(dateFilter);
      
      const status = getVoucherStatus(voucher);
      const matchesStatus = !statusFilter || status === statusFilter;
      
      const matchesVoucherType = !voucherTypeFilter || voucher.voucherType.toString() === voucherTypeFilter;
      
      const minAmount = parseFloat(amountRange.min) || 0;
      const maxAmount = parseFloat(amountRange.max) || Infinity;
      const matchesAmount = voucherTotal >= minAmount && voucherTotal <= maxAmount;

      return matchesSearch && matchesDate && matchesStatus && matchesVoucherType && matchesAmount;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date sorting
      if (sortField === 'voucherDate' || sortField === 'createdOn') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      // Handle amount sorting
      if (sortField === 'totalAmount') {
        aVal = getVoucherTotal(a);
        bVal = getVoucherTotal(b);
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
  }, [vouchers, searchTerm, sortField, sortDirection, dateFilter, statusFilter, voucherTypeFilter, amountRange]);

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVouchers = filteredVouchers.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    if (!vouchers) return { total: 0, totalAmount: 0, draft: 0, approved: 0, rejected: 0 };

    const total = vouchers.length;
    const totalAmount = vouchers.reduce((sum, voucher) => sum + getVoucherTotal(voucher), 0);
    const draft = vouchers.filter(voucher => getVoucherStatus(voucher) === 'draft').length;
    const approved = vouchers.filter(voucher => getVoucherStatus(voucher) === 'approved').length;
    const rejected = vouchers.filter(voucher => getVoucherStatus(voucher) === 'rejected').length;

    return { total, totalAmount, draft, approved, rejected };
  }, [vouchers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter, voucherTypeFilter, amountRange]);

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
    navigate('/create-purchase-invoice');
  };

  const handleView = (voucherId) => {
    navigate(`/purchase-voucher/${voucherId}`);
  };

  const handleEdit = (voucherId) => {
    navigate(`/edit-purchase-voucher/${voucherId}`);
  };

  const handleDelete = (voucherId) => {
    console.log('Delete voucher:', voucherId);
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading purchase vouchers...</span>
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
              <h3 className="font-semibold text-red-800">Error Loading Purchase Vouchers</h3>
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
                  <div className="p-2 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                    <Receipt className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Purchase Vouchers
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage and track all purchase vouchers</p>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-lg font-bold text-[#f29f67]">{formatCurrency(stats.totalAmount)}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-green-600">Approved</div>
                    <div className="text-lg font-bold text-green-700">{stats.approved}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Draft</div>
                    <div className="text-lg font-bold text-gray-700">{stats.draft}</div>
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
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Voucher
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
                    placeholder="Search vouchers, descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Voucher Type Filter */}
              <div>
                <select
                  value={voucherTypeFilter}
                  onChange={(e) => setVoucherTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value="">All Types</option>
                  {Object.entries(voucherTypes).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
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
                    className="w-1/2 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || dateFilter || statusFilter || voucherTypeFilter || amountRange.min || amountRange.max) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                    setStatusFilter('');
                    setVoucherTypeFilter('');
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
                      Voucher No {getSortIcon('voucherNo')}
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
                      <FileText className="h-4 w-4" />
                      Type & Description
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Created By
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('totalAmount')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Amount {getSortIcon('totalAmount')}
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
                {paginatedVouchers.map((voucher, index) => {
                  const status = getVoucherStatus(voucher);
                  const statusInfo = statusConfig[status];
                  const StatusIcon = statusInfo.icon;
                  const voucherTotal = getVoucherTotal(voucher);

                  return (
                    <tr 
                      key={voucher.voucherId} 
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {/* Voucher Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Receipt className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{voucher.voucherNo}</div>
                            <div className="text-xs text-gray-500">ID: {voucher.voucherId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(voucher.voucherDate)}</div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(voucher.createdOn)}
                        </div>
                      </td>

                      {/* Type & Description */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {voucherTypes[voucher.voucherType] || `Type ${voucher.voucherType}`}
                          </div>
                          <div className="text-gray-500 text-xs line-clamp-2">
                            {voucher.remarks || 'No description'}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {voucher.lines?.length || 0} line(s)
                          </div>
                        </div>
                      </td>

                      {/* Created By */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{voucher.createdBy}</div>
                          <div className="text-xs text-gray-500">{formatDate(voucher.createdOn)}</div>
                          {voucher.approvedBy && (
                            <div className="text-xs text-green-600">
                              Approved by: {voucher.approvedBy}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(voucherTotal)}
                          </div>
                          {voucher.totalDebit !== voucherTotal && (
                            <div className="text-xs text-gray-500">
                              Debit: {formatCurrency(voucher.totalDebit || 0)}
                            </div>
                          )}
                          {voucher.totalCredit > 0 && (
                            <div className="text-xs text-gray-500">
                              Credit: {formatCurrency(voucher.totalCredit)}
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
                            onClick={() => handleView(voucher.voucherId)}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            title="View Voucher"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(voucher.voucherId)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title="Edit Voucher"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher.voucherId)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete Voucher"
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
          {paginatedVouchers.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Receipt className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purchase Vouchers Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || dateFilter || statusFilter || voucherTypeFilter ? 
                  'No vouchers match your current filters. Try adjusting your search criteria.' : 
                  'Get started by creating your first purchase voucher.'
                }
              </p>
              {!searchTerm && !dateFilter && !statusFilter && !voucherTypeFilter && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Voucher
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredVouchers.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVouchers.length)} of {filteredVouchers.length} vouchers
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

export default PurchaseVoucherTable;