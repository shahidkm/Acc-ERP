import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag,
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
  Package,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetSalesNonStockVouchers } from '../../hooks/vouchersHooks/vouchersHook';
import Sidebar from "../../components/sidebar/Sidebar";

const SalesNonStockVouchersTable = () => {
  const { data: salesVouchers, isLoading, error } = useGetSalesNonStockVouchers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('voucherDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const navigate = useNavigate();

  const vouchers = salesVouchers || [];

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
      0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      1: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      2: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig[0];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
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
    navigate("/sales-non-stock-voucher");
  };

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-300 rounded mb-6"></div>
            <div className="h-96 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Sales Vouchers</h3>
            <p className="text-gray-600">Failed to fetch sales non-stock vouchers</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar/>
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Non-Stock Vouchers</h1>
              <p className="text-gray-600 mt-1">Manage and view all sales non-stock voucher entries</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Voucher
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by voucher number, reference, remarks, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredVouchers.length)} of {filteredVouchers.length} vouchers
              {vouchers && filteredVouchers.length !== vouchers.length && (
                <span className="text-gray-500"> (filtered from {vouchers.length} total)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredVouchers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sales Vouchers Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'No sales vouchers are available at the moment.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        onClick={() => handleSort('voucherId')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          ID
                          <span className="text-gray-400">{getSortIcon('voucherId')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('voucherNo')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Voucher No.
                          <span className="text-gray-400">{getSortIcon('voucherNo')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('voucherDate')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                          <span className="text-gray-400">{getSortIcon('voucherDate')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Reference
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Description
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Amount
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('status')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Status
                          <span className="text-gray-400">{getSortIcon('status')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVouchers.map((voucher, index) => (
                      <tr key={voucher.voucherId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 font-medium">#{voucher.voucherId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-green-100 rounded-full p-2 mr-3">
                              <ShoppingBag className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{voucher.voucherNo}</div>
                              <div className="text-xs text-gray-500">by {voucher.createdBy}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(voucher.voucherDate)}</div>
                          <div className="text-xs text-gray-500">Created: {formatDate(voucher.createdOn)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {voucher.referenceNo || <span className="text-gray-400 italic">No ref</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {voucher.lines?.[0]?.description || <span className="text-gray-400 italic">N/A</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                              <span className="text-red-600 font-medium">{formatCurrency(voucher.totalDebit)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-green-600 font-medium">{formatCurrency(voucher.totalCredit)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(voucher.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(voucher)}
                            className="inline-flex items-center px-3 py-1 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
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
              <div className="bg-white px-4 py-3 border-t border-gray-200 rounded-b-xl mt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                isCurrentPage
                                  ? 'border-orange-500 bg-orange-500 text-white'
                                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
                        if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-2 text-sm text-gray-500">
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
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Sales Non-Stock Voucher Details</h2>
                  <button
                    onClick={() => setSelectedVoucher(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Voucher No.</p>
                    <p className="font-medium text-gray-900">{selectedVoucher.voucherNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedVoucher.voucherDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference No.</p>
                    <p className="font-medium text-gray-900">{selectedVoucher.referenceNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedVoucher.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created By</p>
                    <p className="font-medium text-gray-900">{selectedVoucher.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved By</p>
                    <p className="font-medium text-gray-900">{selectedVoucher.approvedBy || 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Code</p>
                    <p className="font-medium text-gray-900">{selectedVoucher.jobCodeId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cost Center</p>
                    <p className="font-medium text-gray-900">{selectedVoucher.lines?.[0]?.costCenterCode || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Remarks</p>
                  <p className="text-gray-900">{selectedVoucher.remarks || 'No remarks'}</p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Job Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Cost Center</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Reference</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedVoucher.lines.map((line) => (
                        <tr key={line.lineId}>
                          <td className="px-4 py-2">
                            {line.entryType === 0 ? (
                              <span className="text-red-600 font-medium">Debit</span>
                            ) : (
                              <span className="text-green-600 font-medium">Credit</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{line.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{line.jobCode || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{line.costCenterCode || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{line.reference || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(line.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold">
                      <tr>
                        <td colSpan="5" className="px-4 py-2 text-right">Total Debit:</td>
                        <td className="px-4 py-2 text-right text-red-600">{formatCurrency(selectedVoucher.totalDebit)}</td>
                      </tr>
                      <tr>
                        <td colSpan="5" className="px-4 py-2 text-right">Total Credit:</td>
                        <td className="px-4 py-2 text-right text-green-600">{formatCurrency(selectedVoucher.totalCredit)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesNonStockVouchersTable;