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
  Package,
  Briefcase,
  RefreshCw
} from 'lucide-react';
import { useGetGoodsReceiptNotes } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';

const GoodsReceiptNotesTable = () => {
  const { data: goodsReceiptNotes, isLoading, error } = useGetGoodsReceiptNotes();

  const notes = goodsReceiptNotes || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  // Filter and search functionality
  const filteredNotes = useMemo(() => {
    if (!notes.length) return [];

    let filtered = notes.filter(note => {
      const matchesSearch = searchTerm === '' || 
        (note.referenceNo?.toString() || '').includes(searchTerm) ||
        (note.documentType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (note.document?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (note.jobCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (note.vendorId?.toString() || '').includes(searchTerm) ||
        (note.currency?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || note.status?.toString() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      if (sortField === 'receiptDate' || sortField === 'createdOn') {
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
  }, [notes, searchTerm, sortField, sortDirection, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

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
   navigate("/create-goods-receipt-note");
  };

  const handleViewDetails = (note) => {
    setSelectedNote(note);
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Goods Receipt Notes</h3>
            <p className="text-gray-600 mb-6">Failed to fetch goods receipt notes data</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
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
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Goods Receipt Notes
                  </h1>
                  <p className="text-gray-600 mt-1">Manage and view all goods receipt note entries</p>
                </div>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Note
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
                  placeholder="Search by reference, document type, document, job code, vendor..."
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
                <span className="text-teal-600 font-bold">{Math.min(endIndex, filteredNotes.length)}</span> of{' '}
                <span className="text-teal-600 font-bold">{filteredNotes.length}</span> notes
                {notes && filteredNotes.length !== notes.length && (
                  <span className="text-gray-500"> (filtered from {notes.length} total)</span>
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
        {filteredNotes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl text-center py-16">
            <Receipt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Goods Receipt Notes Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'No goods receipt notes are available at the moment.'}
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
                        onClick={() => handleSort('id')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-teal-500" />
                          ID
                          <span className="text-gray-400">{getSortIcon('id')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('referenceNo')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-teal-500" />
                          Reference No.
                          <span className="text-gray-400">{getSortIcon('referenceNo')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('receiptDate')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-500" />
                          Date
                          <span className="text-gray-400">{getSortIcon('receiptDate')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-teal-500" />
                          Document Type
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-teal-500" />
                          Grand Total
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
                    {paginatedNotes.map((note, index) => (
                      <tr key={note.id} className={`hover:bg-teal-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 font-bold">#{note.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-teal-100 rounded-xl p-2 mr-3">
                              <Package className="h-4 w-4 text-teal-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{note.referenceNo}</div>
                              <div className="text-xs text-gray-500">Vendor: {note.vendorId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(note.receiptDate)}</div>
                          <div className="text-xs text-gray-500">Created: {formatDate(note.createdOn)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {note.documentType || <span className="text-gray-400 italic">No type</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{formatCurrency(note.grandTotal)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(note.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(note)}
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

        {/* Note Details Modal */}
        {selectedNote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 rounded-2xl max-w-5xl w-full my-8 shadow-2xl">
              <div className="bg-white/70 backdrop-blur-sm p-6 border-b border-white/50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                      <Receipt className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Goods Receipt Note Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedNote(null)}
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
                      <p className="text-sm font-medium text-gray-600 mb-1">Reference No.</p>
                      <p className="font-bold text-gray-900">{selectedNote.referenceNo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Vendor ID</p>
                      <p className="font-bold text-gray-900">{selectedNote.vendorId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Document Type</p>
                      <p className="font-bold text-gray-900">{selectedNote.documentType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Document</p>
                      <p className="font-bold text-gray-900">{selectedNote.document || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Job Code</p>
                      <p className="font-bold text-gray-900">{selectedNote.jobCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedNote.status)}</div>
                    </div>
                    {selectedNote.foreignCurrency && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Currency</p>
                          <p className="font-bold text-gray-900">{selectedNote.currency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Currency Rate</p>
                          <p className="font-bold text-gray-900">{selectedNote.currencyRate}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Totals */}
                  <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="font-bold text-gray-900">{formatCurrency(selectedNote.subtotal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="font-bold text-gray-900">{formatCurrency(selectedNote.discount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total VAT</p>
                      <p className="font-bold text-gray-900">{formatCurrency(selectedNote.totalVATAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Net Amount</p>
                      <p className="font-bold text-teal-600 text-lg">{formatCurrency(selectedNote.netAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Other Costs */}
                {selectedNote.otherCosts && selectedNote.otherCosts.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-teal-500" />
                        Other Costs
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Reference</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">VAT Rate</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Converted Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {selectedNote.otherCosts.map((cost, index) => (
                            <tr key={index} className="hover:bg-teal-50/50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900">{cost.reference}</td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{cost.description}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(cost.amount)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{cost.vatRate}%</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">{formatCurrency(cost.convrtAmt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Purchase Order Items */}
                {selectedNote.purchaseOrderItems && selectedNote.purchaseOrderItems.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-teal-500" />
                        Purchase Order Items
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Unit ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Cost</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tax Included</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">VAT Amount</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {selectedNote.purchaseOrderItems.map((item, index) => (
                            <tr key={item.id} className="hover:bg-teal-50/50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900">{item.itemId}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.unitId}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.cost)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {item.taxIncluded ? 'Yes' : 'No'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.vatAmount)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">{formatCurrency(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedNote(null)}
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

export default GoodsReceiptNotesTable;