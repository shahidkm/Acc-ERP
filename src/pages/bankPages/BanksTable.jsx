import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, AlertCircle, Building2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Hash, FileText, Plus, Eye, Edit, Trash2, Download, Users, XCircle, CheckCircle, Info 
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
// assume you have a hook similar to useGetDepartments for banks:
import { useGetBanks } from '../../hooks/bankHooks/bankHooks';

const BanksTable = () => {
  const { data: banks, isLoading, error } = useGetBanks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('bankId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const navigate = useNavigate();

  const filteredBanks = useMemo(() => {
    if (!banks || banks.length === 0) return [];

    const lower = searchTerm.toLowerCase();

    let filtered = banks.filter(bank => {
      return (
        bank.bankCode?.toLowerCase().includes(lower) ||
        bank.bankName?.toLowerCase().includes(lower) ||
        bank.branch?.toLowerCase().includes(lower) ||
        bank.ifsc?.toLowerCase().includes(lower) ||
        bank.accountNo?.toLowerCase().includes(lower) ||
        bank.email?.toLowerCase().includes(lower) ||
        bank.address?.toLowerCase().includes(lower) ||
        bank.contactNo?.toLowerCase().includes(lower)
      );
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // ensure we handle undefined/null
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      // assume numeric
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [banks, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBanks = filteredBanks.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    if (!banks) return { total: 0 };
    return { total: banks.length };
  }, [banks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleCreateNew = () => {
    navigate('/create-bank');
  };

  const handleView = (bankId) => {
    navigate(`/bank/${bankId}`);
  };

  const handleEdit = (bankId) => {
    navigate(`/edit-bank/${bankId}`);
  };

  const handleDelete = (bankId) => {
    console.log('Delete bank:', bankId);
    // implement deletion logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          <span className="text-gray-600">Loading banks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Banks</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">

        {/* Header with Statistics */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#f29f67] rounded-xl shadow-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Banks
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage bank details</p>

                {/* Statistics */}
                <div className="flex gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total Banks</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  </div>
                  {/* You can add more stats like how many active etc. */}
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
                  className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Bank
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search banks by code, name, branch, IFSC, etc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-teal-50 to-cyan-100">
                <tr>
                  <th 
                    onClick={() => handleSort('bankId')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID {getSortIcon('bankId')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('bankCode')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank Code {getSortIcon('bankCode')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('bankName')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Bank Name {getSortIcon('bankName')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('branch')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    Branch {getSortIcon('branch')}
                  </th>
                  <th 
                    onClick={() => handleSort('ifsc')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    IFSC {getSortIcon('ifsc')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedBanks.map((bank, index) => (
                  <tr 
                    key={bank.bankId} 
                    className={`hover:bg-teal-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Hash className="h-4 w-4 text-teal-600" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {bank.bankId}
                        </div>
                      </div>
                    </td>

                    {/* Bank Code */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 font-mono">
                            {bank.bankCode}
                          </div>
                          <div className="text-xs text-gray-500">Code</div>
                        </div>
                      </div>
                    </td>

                    {/* Bank Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bank.bankName}
                          </div>
                          <div className="text-xs text-gray-500">Name</div>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bank.branch}</div>
                      <div className="text-xs text-gray-500">Branch</div>
                    </td>

                    {/* IFSC */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bank.ifsc}</div>
                      <div className="text-xs text-gray-500">IFSC</div>
                    </td>

                    {/* Contact No */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bank.contactNo}</div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bank.email}</div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(bank.bankId)}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          title="View Bank"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(bank.bankId)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="Edit Bank"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bank.bankId)}
                          className="inline-flex items-cent er px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          title="Delete Bank"
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

          {/* Empty State */}
          {paginatedBanks.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Banks Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 
                  'No banks match your search criteria. Try adjusting your search term.' : 
                  'Get started by creating your first bank.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Bank
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBanks.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBanks.length)} of {filteredBanks.length} banks
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
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
          <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Bank Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-teal-800">Bank Data Integrity</p>
              <p className="text-teal-700 text-sm">
                Keep bank information accurate. IFSC, account numbers and branch names should match official records.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-teal-800">Management Features</p>
              <p className="text-teal-700 text-sm">
                View, edit, and delete banks. Export or print bank data as needed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BanksTable;
