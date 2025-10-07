import React, { useState, useMemo } from 'react';
import { 
  Receipt,
  Search, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Calendar,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Briefcase,
  CreditCard,
  User
} from 'lucide-react';
import { useGetSupplierPaymentVouchers } from '../../hooks/vouchersHooks/vouchersHook';
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';

const SupplierPaymentsTable = () => {
  const { data: supplierPayments, isLoading, error } = useGetSupplierPaymentVouchers();

  const vouchers = supplierPayments || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('voucherDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const navigate = useNavigate();

  // Filter and search functionality
  const filteredVouchers = useMemo(() => {
    if (!vouchers.length) return [];

    let filtered = vouchers.filter(voucher => {
      const matchesSearch = searchTerm === '' || 
        (voucher.voucherNo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voucher.remarks?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voucher.createdBy?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voucher.referenceNo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voucher.voucherId?.toString() || '').includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || voucher.status.toString() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      if (sortField === 'voucherDate' || sortField === 'createdOn') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [vouchers, searchTerm, sortField, sortDirection, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      1: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      2: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig[0];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const handleCreateNew = () => {
    navigate("/supplier-payment-voucher");
  };

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
        <div className="max-w-full mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/50 rounded-xl w-1/3"></div>
            <div className="h-16 bg-white/50 rounded-xl"></div>
            <div className="h-96 bg-white/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
        <div className="max-w-full mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-12 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Supplier Payments</h3>
            <p className="text-gray-600 mb-6">Failed to fetch supplier payment vouchers data</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
      <Sidebar/>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Supplier Payments
                  </h1>
                  <p className="text-gray-600 mt-1">Manage and view all supplier payment vouchers</p>
                </div>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Payment
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
                <input
                  type="text"
                  placeholder="Search by voucher number, reference, remarks, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-56">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Rejected</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 font-medium">
                Showing <span className="text-teal-600 font-bold">{startIndex + 1}</span> to{' '}
                <span className="text-teal-600 font-bold">{Math.min(endIndex, filteredVouchers.length)}</span> of{' '}
                <span className="text-teal-600 font-bold">{filteredVouchers.length}</span> payments
                {vouchers && filteredVouchers.length !== vouchers.length && (
                  <span className="text-gray-500"> (filtered from {vouchers.length} total)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-medium"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700 font-medium">per page</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredVouchers.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl text-center py-16">
            <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Supplier Payments Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'No supplier payment vouchers are available at the moment.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th 
                        onClick={() => handleSort('voucherId')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-teal-500" />
                          ID
                          <span className="text-gray-400">{getSortIcon('voucherId')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('voucherNo')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-teal-500" />
                          Voucher No.
                          <span className="text-gray-400">{getSortIcon('voucherNo')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('voucherDate')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-500" />
                          Date
                          <span className="text-gray-400">{getSortIcon('voucherDate')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-teal-500" />
                          Reference
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-teal-500" />
                          Supplier
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-teal-500" />
                          Amount
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('status')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Status
                          <span className="text-gray-400">{getSortIcon('status')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVouchers.map((voucher, index) => (
                      <tr key={voucher.voucherId} className={`hover:bg-teal-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 font-bold">#{voucher.voucherId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-teal-100 rounded-xl p-2 mr-3">
                              <CreditCard className="h-4 w-4 text-teal-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{voucher.voucherNo}</div>
                              <div className="text-xs text-gray-500">by {voucher.createdBy}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(voucher.voucherDate)}</div>
                          <div className="text-xs text-gray-500">Created: {formatDate(voucher.createdOn)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {voucher.referenceNo || <span className="text-gray-400 italic">No ref</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {voucher.lines?.[0]?.partyName || <span className="text-gray-400 italic">N/A</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <TrendingUp className="h-3 w-3 text-red-500 mr-1.5" />
                              <span className="text-red-600 font-bold">{formatCurrency(voucher.totalDebit)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <TrendingDown className="h-3 w-3 text-green-500 mr-1.5" />
                              <span className="text-green-600 font-bold">{formatCurrency(voucher.totalCredit)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(voucher.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(voucher)}
                            className="inline-flex items-center px-4 py-2 border-2 border-[#f29f67] text-[#f29f67] font-semibold rounded-lg hover:bg-[#f29f67] hover:text-white transition-all"
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white/80 backdrop-blur-sm border-t-2 border-gray-200 rounded-b-2xl mt-0 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-700">
                      Page <span className="text-teal-600 font-bold">{currentPage}</span> of{' '}
                      <span className="text-teal-600 font-bold">{totalPages}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;
                        
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-4 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                                isCurrentPage
                                  ? 'border-[#f29f67] bg-[#f29f67] text-white shadow-lg'
                                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
                        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                          return (
                            <span key={pageNumber} className="px-2 py-2 text-sm text-gray-500 font-bold">
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Voucher Details Modal */}
        {selectedVoucher && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 rounded-2xl max-w-5xl w-full my-8 shadow-2xl">
              <div className="bg-white/70 backdrop-blur-sm p-6 border-b border-white/50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                      <Receipt className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Supplier Payment Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedVoucher(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                {/* Basic Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-500" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Voucher No.</p>
                      <p className="font-bold text-gray-900">{selectedVoucher.voucherNo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                      <p className="font-bold text-gray-900">{formatDate(selectedVoucher.voucherDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Reference No.</p>
                      <p className="font-bold text-gray-900">{selectedVoucher.referenceNo || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedVoucher.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Created By</p>
                      <p className="font-bold text-gray-900">{selectedVoucher.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Approved By</p>
                      <p className="font-bold text-gray-900">{selectedVoucher.approvedBy || 'Pending'}</p>
                    </div>
                    {selectedVoucher.jobCodeId && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Job Code ID</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="h-4 w-4 text-teal-500" />
                          <p className="font-bold text-gray-900">{selectedVoucher.jobCodeId}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedVoucher.remarks && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-600 mb-2">Remarks</p>
                      <p className="text-gray-900">{selectedVoucher.remarks}</p>
                    </div>
                  )}
                </div>

                {/* Payment Lines */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-teal-500" />
                      Payment Details
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Supplier</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Bank/Cheque</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Reference</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Job Code</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Cost Center</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {selectedVoucher.lines.map((line) => (
                          <tr key={line.lineId} className="hover:bg-teal-50/50 transition-colors">
                            <td className="px-4 py-3">
                              {line.entryType === 0 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Debit
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                  Credit
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">
                                {line.partyName || <span className="text-gray-400 italic">N/A</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{line.description}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {line.bankName && (
                                <div>
                                  <div className="font-semibold">{line.bankName}</div>
                                  {line.chequeNo && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {line.chequeNo} - {formatDate(line.chequeDate)}
                                    </div>
                                  )}
                                </div>
                              )}
                              {!line.bankName && <span className="text-gray-400 italic">-</span>}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {line.reference || <span className="text-gray-400 italic">-</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {line.jobCode ? (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3 text-teal-500" />
                                  <span className="font-medium">{line.jobCode}</span>
                                </div>
                              ) : <span className="text-gray-400 italic">-</span>}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {line.costCenterCode || <span className="text-gray-400 italic">-</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                              {formatCurrency(line.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gradient-to-r from-teal-50 to-cyan-50">
                        <tr className="border-t-2 border-gray-300">
                          <td colSpan="7" className="px-4 py-3 text-right font-bold text-gray-900">Total Debit:</td>
                          <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(selectedVoucher.totalDebit)}</td>
                        </tr>
                        <tr>
                          <td colSpan="7" className="px-4 py-3 text-right font-bold text-gray-900">Total Credit:</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(selectedVoucher.totalCredit)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Close Button */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedVoucher(null)}
                      className="px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPaymentsTable;