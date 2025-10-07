import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  FileText,
  Plus,
  Eye,
  Percent,
  Edit,
  Trash2,
  Download,
  XCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useGetCurrencies } from '../../hooks/currencyHooks/currencyHooks';

const CurrenciesTable = () => {
  const { data: currencies, isLoading, error } = useGetCurrencies();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('currencyId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const navigate = useNavigate();

  const filteredCurrencies = useMemo(() => {
    if (!currencies || currencies.length === 0) return [];

    const lower = searchTerm.toLowerCase();

    let filtered = currencies.filter(c => {
      return (
        c.currencyCode?.toLowerCase().includes(lower) ||
        c.currencyName?.toLowerCase().includes(lower) ||
        String(c.currencyRate)?.toLowerCase().includes(lower) ||
        c.decimalName?.toLowerCase().includes(lower) ||
        c.fraCode?.toLowerCase().includes(lower) ||
        String(c.decimalPlace)?.toLowerCase().includes(lower)
      );
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // If strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      // Else assume number
      const aNum = typeof aVal === 'number' ? aVal : parseFloat(aVal);
      const bNum = typeof bVal === 'number' ? bVal : parseFloat(bVal);
      if (isNaN(aNum) || isNaN(bNum)) {
        // fallback to string compare
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return filtered;
  }, [currencies, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCurrencies = filteredCurrencies.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = useMemo(() => {
    if (!currencies) return { total: 0 };
    return { total: currencies.length };
  }, [currencies]);

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
    navigate('/create-currency');
  };

  const handleView = (currencyId) => {
    navigate(`/currency/${currencyId}`);
  };

  const handleEdit = (currencyId) => {
    navigate(`/edit-currency/${currencyId}`);
  };

  const handleDelete = (currencyId) => {
    console.log('Delete currency:', currencyId);
    // implement deletion logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading currencies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Currencies</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">

        {/* Header with Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#f29f67] rounded-xl shadow-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Currencies
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage currency list, rates and formats</p>

                <div className="flex gap-4 mt-6">
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Total Currencies</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  </div>
                  {/* add more stats if needed */}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-orange-200 text-gray-700 font-medium rounded-xl hover:bg-orange-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:bg-[#e08d55] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Currency
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search currencies by code, name, rate, etc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
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
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th
                    onClick={() => handleSort('currencyId')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID {getSortIcon('currencyId')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('currencyCode')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Code {getSortIcon('currencyCode')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('currencyName')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Name {getSortIcon('currencyName')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('currencyRate')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Rate {getSortIcon('currencyRate')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('decimalName')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Decimal Name {getSortIcon('decimalName')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('fraCode')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      FRA Code {getSortIcon('fraCode')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('decimalPlace')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Decimal Place {getSortIcon('decimalPlace')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-50">
                {paginatedCurrencies.map((c, index) => (
                  <tr
                    key={c.currencyId}
                    className={`hover:bg-orange-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Hash className="h-4 w-4 text-[#f29f67]" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {c.currencyId}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 font-mono">
                        {c.currencyCode}
                      </div>
                      <div className="text-xs text-gray-500">Code</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.currencyName}
                      </div>
                      <div className="text-xs text-gray-500">Name</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.currencyRate}
                      </div>
                      <div className="text-xs text-gray-500">Rate</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.decimalName}
                      </div>
                      <div className="text-xs text-gray-500">Decimal Name</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.fraCode}
                      </div>
                      <div className="text-xs text-gray-500">FRA Code</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.decimalPlace}
                      </div>
                      <div className="text-xs text-gray-500">Decimal Place</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(c.currencyId)}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          title="View Currency"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(c.currencyId)}
                          className="inline-flex items-center px-3 py-1 bg-orange-100 text-[#f29f67] rounded-lg hover:bg-orange-200 transition-colors duration-200"
                          title="Edit Currency"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.currencyId)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          title="Delete Currency"
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

          {paginatedCurrencies.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-[#f29f67]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Currencies Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'No currencies match your search criteria. Try adjusting your search term.'
                  : 'Get started by creating your first currency.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:bg-[#e08d55] transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Currency
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCurrencies.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-4 border border-orange-100 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCurrencies.length)} of {filteredCurrencies.length} currencies
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="text-sm border border-orange-200 rounded-lg px-2 py-1"
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
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="inline-flex items-center px-3 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700 px-4 py-2 bg-orange-50 rounded-lg font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="inline-flex items-center px-3 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-white rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-[#f29f67]" />
            Currency Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67]">Precision & Formatting</p>
              <p className="text-gray-700 text-sm">
                Ensure currency code, FRA codes and decimal places are properly configured for financial accuracy.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67]">Manage Features</p>
              <p className="text-gray-700 text-sm">
                View, edit, and delete currencies. Export as needed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CurrenciesTable;