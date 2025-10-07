import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  User,
  Hash
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
const VoucherReports = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('voucherDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Filter states
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    voucherType: '',
    status: '',
    accountId: '',
    createdBy: '',
    minAmount: '',
    maxAmount: '',
    referenceNo: ''
  });

  // Voucher types enum
  const voucherTypes = [
    { value: '', label: 'All Voucher Types' },
    { value: '0', label: 'Journal' },
    { value: '1', label: 'Payment' },
    { value: '2', label: 'Receipt' },
    { value: '3', label: 'Customer Receipt' },
    { value: '4', label: 'Contra' },
    { value: '5', label: 'Purchase' },
    { value: '6', label: 'Purchase Non-Stock' },
    { value: '7', label: 'Sales' },
    { value: '8', label: 'Sales Non-Stock' },
    { value: '9', label: 'Purchase Return' },
    { value: '10', label: 'Sales Return' },
    { value: '11', label: 'Adjustment' },
    { value: '12', label: 'Opening' }
  ];

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: '0', label: 'Draft' },
    { value: '1', label: 'Pending' },
    { value: '2', label: 'Approved' },
    { value: '3', label: 'Rejected' },
    { value: '4', label: 'Cancelled' },
    { value: '5', label: 'Completed' }
  ];

  // Get voucher type label
  const getVoucherTypeLabel = (type) => {
    const voucherType = voucherTypes.find(v => v.value === type?.toString());
    return voucherType ? voucherType.label : 'Unknown';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(s => s.value === status?.toString());
    return statusOption ? statusOption.label : 'Unknown';
  };

  // Get voucher type color
  const getVoucherTypeColor = (type) => {
    const colors = {
      '0': 'bg-gray-100 text-gray-800',      // Journal
      '1': 'bg-red-100 text-red-800',        // Payment
      '2': 'bg-green-100 text-green-800',    // Receipt
      '3': 'bg-emerald-100 text-emerald-800', // Customer Receipt
      '4': 'bg-blue-100 text-blue-800',      // Contra
      '5': 'bg-purple-100 text-purple-800',  // Purchase
      '6': 'bg-violet-100 text-violet-800',  // Purchase Non-Stock
      '7': 'bg-orange-100 text-orange-800',  // Sales
      '8': 'bg-amber-100 text-amber-800',    // Sales Non-Stock
      '9': 'bg-pink-100 text-pink-800',      // Purchase Return
      '10': 'bg-yellow-100 text-yellow-800', // Sales Return
      '11': 'bg-indigo-100 text-indigo-800', // Adjustment
      '12': 'bg-teal-100 text-teal-800'      // Opening
    };
    return colors[type?.toString()] || 'bg-gray-100 text-gray-800';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      '0': 'bg-gray-100 text-gray-800',     // Draft
      '1': 'bg-yellow-100 text-yellow-800', // Pending
      '2': 'bg-green-100 text-green-800',   // Approved
      '3': 'bg-red-100 text-red-800',       // Rejected
      '4': 'bg-red-100 text-red-800',       // Cancelled
      '5': 'bg-blue-100 text-blue-800'      // Completed
    };
    return colors[status?.toString()] || 'bg-gray-100 text-gray-800';
  };

  // Fetch vouchers from API
  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      // Format dates for API
      const startDateTime = new Date(filters.startDate + 'T00:00:00.000').toISOString();
      const endDateTime = new Date(filters.endDate + 'T23:59:59.999').toISOString();
      
      params.append('StartDate', startDateTime);
      params.append('EndDate', endDateTime);
      
      if (filters.voucherType) params.append('VoucherType', filters.voucherType);
      if (filters.status) params.append('Status', filters.status);
      if (filters.accountId) params.append('AccountId', filters.accountId);
      if (filters.createdBy) params.append('CreatedBy', filters.createdBy);
      if (filters.minAmount) params.append('MinAmount', filters.minAmount);
      if (filters.maxAmount) params.append('MaxAmount', filters.maxAmount);
      if (filters.referenceNo) params.append('ReferenceNo', filters.referenceNo);

      const response = await fetch(`https://localhost:7230/api/vouchers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVouchers(Array.isArray(data) ? data : []);
      setCurrentPage(1); // Reset to first page
    } catch (err) {
      setError(err.message || 'Failed to fetch vouchers');
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      voucherType: '',
      status: '',
      accountId: '',
      createdBy: '',
      minAmount: '',
      maxAmount: '',
      referenceNo: ''
    });
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort vouchers
  const sortedVouchers = [...vouchers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'totalDebitAmount':
      case 'totalCreditAmount':
        aValue = parseFloat(a[sortField]) || 0;
        bValue = parseFloat(b[sortField]) || 0;
        break;
      case 'voucherDate':
      case 'createdOn':
      case 'approvedOn':
        aValue = new Date(a[sortField]);
        bValue = new Date(b[sortField]);
        break;
      case 'voucherId':
      case 'voucherType':
      case 'status':
        aValue = parseInt(a[sortField]) || 0;
        bValue = parseInt(b[sortField]) || 0;
        break;
      default:
        aValue = String(a[sortField] || '').toLowerCase();
        bValue = String(b[sortField] || '').toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVouchers = sortedVouchers.slice(startIndex, startIndex + itemsPerPage);

  // Load vouchers on component mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Calculate totals
  const totalDebitAmount = vouchers.reduce((sum, v) => sum + (parseFloat(v.totalDebitAmount) || 0), 0);
  const totalCreditAmount = vouchers.reduce((sum, v) => sum + (parseFloat(v.totalCreditAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
   <Sidebar/>
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-[#f59e0b]/10 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-[#f59e0b]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Voucher Reports</h1>
              <p className="text-gray-500">View and manage voucher transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-[#f59e0b]" />
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
            
            {/* Date Range and Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Type
                </label>
                <select
                  value={filters.voucherType}
                  onChange={(e) => handleFilterChange('voucherType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                >
                  {voucherTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={filters.accountId}
                    onChange={(e) => handleFilterChange('accountId', e.target.value)}
                    placeholder="Account ID"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                    placeholder="Username"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchVouchers}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f59e0b] text-white rounded-md hover:bg-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </button>
              </div>
            </div>

            {/* Reference Number Filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <input
                type="text"
                value={filters.referenceNo}
                onChange={(e) => handleFilterChange('referenceNo', e.target.value)}
                placeholder="Enter reference number..."
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-semibold text-gray-900">{vouchers.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Debit</p>
                <p className="text-2xl font-semibold text-red-600">
                  {formatCurrency(totalDebitAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Credit</p>
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(totalCreditAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                <p className={`text-2xl font-semibold ${totalDebitAmount - totalCreditAmount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totalDebitAmount - totalCreditAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Vouchers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Vouchers</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchVouchers}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[#f59e0b] text-white rounded-md hover:bg-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#f59e0b] mb-4" />
              <p className="text-gray-600">Loading vouchers...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No vouchers found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or date range</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('voucherId')}
                      >
                        <div className="flex items-center gap-2">
                          ID
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('voucherNo')}
                      >
                        <div className="flex items-center gap-2">
                          Voucher No.
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('voucherDate')}
                      >
                        <div className="flex items-center gap-2">
                          Date
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('voucherType')}
                      >
                        <div className="flex items-center gap-2">
                          Type
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('totalDebitAmount')}
                      >
                        <div className="flex items-center gap-2">
                          Debit Amount
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('totalCreditAmount')}
                      >
                        <div className="flex items-center gap-2">
                          Credit Amount
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdBy')}
                      >
                        <div className="flex items-center gap-2">
                          Created By
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedVouchers.map((voucher) => (
                      <tr key={voucher.voucherId} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{voucher.voucherId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-blue-600">{voucher.voucherNo}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(voucher.voucherDate)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoucherTypeColor(voucher.voucherType)}`}>
                            {getVoucherTypeLabel(voucher.voucherType)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                            {getStatusLabel(voucher.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-red-600">
                          {formatCurrency(voucher.totalDebitAmount)}
                        </td>
                        <td className="py-3 px-4 font-medium text-green-600">
                          {formatCurrency(voucher.totalCreditAmount)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {voucher.createdBy || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1 text-gray-500 hover:text-[#f59e0b] transition-colors"
                              title="View Details"
                              onClick={() => console.log('View voucher:', voucher.voucherId)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                              title="Edit"
                              onClick={() => console.log('Edit voucher:', voucher.voucherId)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                              title="Delete"
                              onClick={() => console.log('Delete voucher:', voucher.voucherId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, vouchers.length)} of {vouchers.length} results
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-500 hover:text-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else {
                            if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                          }
                          
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === page
                                  ? 'bg-[#f59e0b] text-white'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-500 hover:text-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Voucher Details Modal/Section - Show details of selected voucher */}
        {paginatedVouchers.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Voucher Details</h3>
              <p className="text-sm text-gray-500">Showing details for the most recent voucher</p>
            </div>
            <div className="p-6">
              {(() => {
                const recentVoucher = paginatedVouchers[0];
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Voucher Information</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Voucher ID:</dt>
                            <dd className="text-sm font-medium text-gray-900">{recentVoucher.voucherId}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Voucher Number:</dt>
                            <dd className="text-sm font-medium text-gray-900">{recentVoucher.voucherNo}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Date:</dt>
                            <dd className="text-sm font-medium text-gray-900">{formatDate(recentVoucher.voucherDate)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Reference:</dt>
                            <dd className="text-sm font-medium text-gray-900">{recentVoucher.referenceNo || '-'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Remarks:</dt>
                            <dd className="text-sm font-medium text-gray-900">{recentVoucher.remarks || '-'}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Status & Amounts</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Status:</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(recentVoucher.status)}`}>
                                {getStatusLabel(recentVoucher.status)}
                              </span>
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Type:</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoucherTypeColor(recentVoucher.voucherType)}`}>
                                {getVoucherTypeLabel(recentVoucher.voucherType)}
                              </span>
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Total Debit:</dt>
                            <dd className="text-sm font-medium text-red-600">{formatCurrency(recentVoucher.totalDebitAmount)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Total Credit:</dt>
                            <dd className="text-sm font-medium text-green-600">{formatCurrency(recentVoucher.totalCreditAmount)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Created By:</dt>
                            <dd className="text-sm font-medium text-gray-900">{recentVoucher.createdBy}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Created On:</dt>
                            <dd className="text-sm font-medium text-gray-900">{formatDate(recentVoucher.createdOn)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Voucher Lines */}
                    {recentVoucher.lines && recentVoucher.lines.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Voucher Lines</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200 rounded-md">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Line ID</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Account</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Entry Type</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Amount</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Description</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Reference</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {recentVoucher.lines.map((line) => (
                                <tr key={line.lineId} className="hover:bg-gray-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">{line.lineId}</td>
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium">{line.accountName}</div>
                                      <div className="text-gray-500">ID: {line.accountId}</div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-sm">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      line.entryType === 0 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {line.entryType === 0 ? 'Debit' : 'Credit'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium">
                                    <span className={line.entryType === 0 ? 'text-green-600' : 'text-red-600'}>
                                      {formatCurrency(line.amount)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">{line.description || '-'}</td>
                                  <td className="py-2 px-3 text-sm text-gray-600">{line.reference || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherReports;