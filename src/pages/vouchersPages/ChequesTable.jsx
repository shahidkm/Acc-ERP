import React, { useState, useMemo } from 'react';
import { 
  CreditCard,
  Search, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Calendar,
  User,
  Plus,
  Eye,
  DollarSign,
  FileText,
  RefreshCw,
  Users,
  Layout
} from 'lucide-react';
import { useGetCheques } from '../../hooks/vouchersHooks/vouchersHook';
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';

const ChequesTable = () => {
  const { data: chequesData, isLoading, error } = useGetCheques();

  const cheques = chequesData || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('chequeDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const navigate = useNavigate();

  // Filter and search functionality
  const filteredCheques = useMemo(() => {
    if (!cheques.length) return [];

    let filtered = cheques.filter(cheque => {
      const matchesSearch = searchTerm === '' || 
        (cheque.chequeNo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cheque.payee?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cheque.customer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cheque.format?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cheque.amountWords?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      if (sortField === 'chequeDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'amountNumber') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
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
  }, [cheques, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredCheques.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCheques = filteredCheques.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    navigate("/create-cheque");
  };

  const handleViewDetails = (cheque) => {
    setSelectedCheque(cheque);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-12 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Cheques</h3>
            <p className="text-gray-600 mb-6">Failed to fetch cheques data</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
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
                    Cheques
                  </h1>
                  <p className="text-gray-600 mt-1">Manage and view all cheque entries</p>
                </div>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Cheque
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search by cheque number, payee, customer, format, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-[#f29f67] transition-all"
                />
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 font-medium">
                Showing <span className="text-[#f29f67] font-bold">{startIndex + 1}</span> to{' '}
                <span className="text-[#f29f67] font-bold">{Math.min(endIndex, filteredCheques.length)}</span> of{' '}
                <span className="text-[#f29f67] font-bold">{filteredCheques.length}</span> cheques
                {cheques && filteredCheques.length !== cheques.length && (
                  <span className="text-gray-500"> (filtered from {cheques.length} total)</span>
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
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-[#f29f67] text-sm font-medium"
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
        {filteredCheques.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl text-center py-16">
            <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Cheques Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search.' : 'No cheques are available at the moment.'}
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
                        onClick={() => handleSort('chequeNo')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-[#f29f67]" />
                          Cheque No.
                          <span className="text-gray-400">{getSortIcon('chequeNo')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('chequeDate')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#f29f67]" />
                          Date
                          <span className="text-gray-400">{getSortIcon('chequeDate')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('payee')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#f29f67]" />
                          Payee
                          <span className="text-gray-400">{getSortIcon('payee')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('customer')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#f29f67]" />
                          Customer
                          <span className="text-gray-400">{getSortIcon('customer')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Layout className="h-4 w-4 text-[#f29f67]" />
                          Format
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('amountNumber')}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#f29f67]" />
                          Amount
                          <span className="text-gray-400">{getSortIcon('amountNumber')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        A/C Payee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCheques.map((cheque, index) => (
                      <tr key={cheque.chequeNo} className={`hover:bg-orange-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-orange-100 rounded-xl p-2 mr-3">
                              <CreditCard className="h-4 w-4 text-[#f29f67]" />
                            </div>
                            <div className="font-semibold text-gray-900">{cheque.chequeNo}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(cheque.chequeDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cheque.payee}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cheque.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cheque.format}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-[#f29f67]">{formatCurrency(cheque.amountNumber)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cheque.aC_Payee ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(cheque)}
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
                      Page <span className="text-[#f29f67] font-bold">{currentPage}</span> of{' '}
                      <span className="text-[#f29f67] font-bold">{totalPages}</span>
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

        {/* Cheque Details Modal */}
        {selectedCheque && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
              <div className="bg-white/70 backdrop-blur-sm p-6 border-b border-white/50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Cheque Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCheque(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                {/* Basic Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#f29f67]" />
                    Cheque Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Cheque Number</p>
                      <p className="font-bold text-gray-900">{selectedCheque.chequeNo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                      <p className="font-bold text-gray-900">{formatDate(selectedCheque.chequeDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Payee</p>
                      <p className="font-bold text-gray-900">{selectedCheque.payee}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Customer</p>
                      <p className="font-bold text-gray-900">{selectedCheque.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Format</p>
                      <p className="font-bold text-gray-900">{selectedCheque.format}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">A/C Payee</p>
                      <p className="font-bold text-gray-900">{selectedCheque.aC_Payee ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600 mb-1">Amount</p>
                      <p className="font-bold text-2xl text-[#f29f67]">{formatCurrency(selectedCheque.amountNumber)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600 mb-1">Amount in Words</p>
                      <p className="font-bold text-gray-900">{selectedCheque.amountWords}</p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedCheque(null)}
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

export default ChequesTable;