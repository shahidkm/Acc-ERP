import React, { useState, useMemo } from 'react';
import { useGetLedgers } from '../hooks/useGetLedgers';
import { 
  BookOpen, 
  Search, 
  Building2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  Activity,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Building,
  Landmark,
  DollarSign,
  Tag,
  Shield,
  FileText,
  Users
} from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';

const LedgersTable = () => {
  const { data: response, isLoading, error } = useGetLedgers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLedgerGroup, setSelectedLedgerGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTaxLedger, setSelectedTaxLedger] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Extract ledgers from response
  const ledgers = response?.data || [];

  // Filter and search functionality
  const filteredLedgers = useMemo(() => {
    if (!ledgers.length) return [];

    let filtered = ledgers.filter(ledger => {
      const matchesSearch = searchTerm === '' || 
        (ledger.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ledger.alias?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ledger.id?.toString() || '').includes(searchTerm) ||
        (ledger.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ledger.phone || '').includes(searchTerm) ||
        (ledger.gstin || '').includes(searchTerm) ||
        (ledger.pan || '').includes(searchTerm);
      
      const matchesLedgerGroup = selectedLedgerGroup === '' || ledger.ledgerGroupId?.toString() === selectedLedgerGroup;
      const matchesStatus = selectedStatus === '' || 
        (selectedStatus === 'active' && ledger.isActive) ||
        (selectedStatus === 'inactive' && !ledger.isActive);
      const matchesTaxLedger = selectedTaxLedger === '' ||
        (selectedTaxLedger === 'tax' && ledger.isTaxLedger) ||
        (selectedTaxLedger === 'non-tax' && !ledger.isTaxLedger);
      
      return matchesSearch && matchesLedgerGroup && matchesStatus && matchesTaxLedger;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle null values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      // Convert to string for comparison if needed
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [ledgers, searchTerm, selectedLedgerGroup, selectedStatus, selectedTaxLedger, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredLedgers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLedgers = filteredLedgers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLedgerGroup, selectedStatus, selectedTaxLedger]);

  // Get unique ledger groups for filter
  const ledgerGroups = useMemo(() => {
    if (!ledgers.length) return [];
    return [...new Set(ledgers.map(ledger => ledger.ledgerGroupId).filter(id => id !== null && id !== undefined))];
  }, [ledgers]);

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
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Ledgers</h3>
            <p className="text-gray-600">Failed to fetch ledgers</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors"
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ledgers</h1>
              <p className="text-gray-600 mt-1">Manage and view all ledger accounts</p>
            </div>
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
                placeholder="Search by name, alias, email, phone, GSTIN, or PAN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all"
              />
            </div>

            {/* Ledger Group Filter */}
            <select
              value={selectedLedgerGroup}
              onChange={(e) => setSelectedLedgerGroup(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-32"
            >
              <option value="">All Groups</option>
              {ledgerGroups.map(groupId => (
                <option key={groupId} value={groupId}>Group {groupId}</option>
              ))}
            </select>

            {/* Tax Ledger Filter */}
            <select
              value={selectedTaxLedger}
              onChange={(e) => setSelectedTaxLedger(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-32"
            >
              <option value="">All Types</option>
              <option value="tax">Tax Ledgers</option>
              <option value="non-tax">Non-Tax Ledgers</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-32"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLedgers.length)} of {filteredLedgers.length} ledgers
              {ledgers && filteredLedgers.length !== ledgers.length && (
                <span className="text-gray-500"> (filtered from {ledgers.length} total)</span>
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
                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] text-sm"
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
        {filteredLedgers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ledgers Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'No ledgers are available at the moment.'}
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
                        onClick={() => handleSort('id')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          ID
                          <span className="text-gray-400">{getSortIcon('id')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('name')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Name
                          <span className="text-gray-400">{getSortIcon('name')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('ledgerGroupId')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Group
                          <span className="text-gray-400">{getSortIcon('ledgerGroupId')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('openingBalance')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Opening Balance
                          <span className="text-gray-400">{getSortIcon('openingBalance')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Contact
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('isTaxLedger')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Tax Type
                          <span className="text-gray-400">{getSortIcon('isTaxLedger')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('isActive')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Status
                          <span className="text-gray-400">{getSortIcon('isActive')}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedLedgers.map((ledger, index) => (
                      <tr key={ledger.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 font-medium">#{ledger.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{ledger.name || 'Not specified'}</div>
                              {ledger.alias && (
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {ledger.alias}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">Group {ledger.ledgerGroupId || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(ledger.openingBalance)}</div>
                              {ledger.openingType && (
                                <div className="text-xs text-gray-500">{ledger.openingType}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {ledger.email && (
                              <div className="flex items-center text-xs text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                {ledger.email}
                              </div>
                            )}
                            {ledger.phone && (
                              <div className="flex items-center text-xs text-gray-600">
                                <Phone className="h-3 w-3 mr-1" />
                                {ledger.phone}
                              </div>
                            )}
                            {ledger.contactPerson && (
                              <div className="flex items-center text-xs text-gray-600">
                                <Users className="h-3 w-3 mr-1" />
                                {ledger.contactPerson}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              ledger.isTaxLedger 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <FileText className="h-3 w-3 mr-1" />
                              {ledger.isTaxLedger ? 'Tax Ledger' : 'Regular'}
                            </div>
                            {ledger.isTaxLedger && ledger.taxType && (
                              <div className="text-xs text-gray-500 mt-1">{ledger.taxType}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {ledger.isActive ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm text-green-700 font-medium">Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm text-red-700 font-medium">Inactive</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;
                        
                        // Show first page, last page, current page, and pages around current
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
                                  ? 'border-[#f29f67] bg-[#f29f67] text-white'
                                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
                        // Show ellipsis
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

                    {/* Next Button */}
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
      </div>
    </div>
  );
};

export default LedgersTable;