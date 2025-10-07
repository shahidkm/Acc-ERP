import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  AlertCircle,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  XCircle,
  Info
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useGetCountries } from '../../hooks/countryHooks/countryHooks';

const CountriesTable = () => {
  const { data: countries, isLoading, error } = useGetCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('countryId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const navigate = useNavigate();

  const filteredCountries = useMemo(() => {
    if (!countries || countries.length === 0) return [];

    const lower = searchTerm.toLowerCase();

    let filtered = countries.filter(country => {
      return (
        String(country.countryId).toLowerCase().includes(lower) ||
        country.countryCode?.toLowerCase().includes(lower) ||
        country.countryName?.toLowerCase().includes(lower) ||
        country.isoCode?.toLowerCase().includes(lower) ||
        country.phoneCode?.toLowerCase().includes(lower)
      );
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Booleans
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        if (aVal === bVal) return 0;
        return sortDirection === 'asc'
          ? (aVal ? 1 : -1)
          : (aVal ? -1 : 1);
      }

      // Numbers
      const aNum = typeof aVal === 'number' ? aVal : parseFloat(aVal);
      const bNum = typeof bVal === 'number' ? bVal : parseFloat(bVal);

      if (isNaN(aNum) || isNaN(bNum)) {
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }

      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return filtered;
  }, [countries, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCountries = filteredCountries.slice(startIndex, startIndex + itemsPerPage);

  const stats = useMemo(() => {
    if (!countries) return { total: 0 };
    return { total: countries.length };
  }, [countries]);

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
    return sortDirection === 'asc'
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const handleCreateNew = () => {
    navigate('/create-country');
  };

  const handleView = (countryId) => {
    navigate(`/country/${countryId}`);
  };

  const handleEdit = (countryId) => {
    navigate(`/edit-country/${countryId}`);
  };

  const handleDelete = (countryId) => {
    console.log('Delete country:', countryId);
    // Add your delete logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#f29f67' }}></div>
          <span className="text-gray-600">Loading countries...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Countries</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">

        {/* Header with Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl shadow-lg" style={{ background: '#f29f67' }}>
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Countries
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage country list and details</p>

                <div className="flex gap-4 mt-6">
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Total Countries</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
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
                  className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ background: '#f29f67' }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Country
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search countries by code, name, ISO, or phone code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 transition-all duration-300 bg-white focus:border-[#f29f67]"
                    style={{ '--tw-ring-color': 'rgba(242, 159, 103, 0.2)' }}
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-white text-left" style={{ background: '#f29f67' }}>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort('countryId')}
                  >
                    <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      <span>ID</span>
                      {getSortIcon('countryId')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort('countryCode')}
                  >
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Code</span>
                      {getSortIcon('countryCode')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort('countryName')}
                  >
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Name</span>
                      {getSortIcon('countryName')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort('isoCode')}
                  >
                    <div className="flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      <span>ISO Code</span>
                      {getSortIcon('isoCode')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort('phoneCode')}
                  >
                    <div className="flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      <span>Phone Code</span>
                      {getSortIcon('phoneCode')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort('isActive')}
                  >
                    <div className="flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      <span>Active</span>
                      {getSortIcon('isActive')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCountries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No countries found.
                    </td>
                  </tr>
                ) : (
                  paginatedCountries.map(country => (
                    <tr
                      key={country.countryId}
                      className="hover:bg-orange-50 cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{country.countryId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{country.countryCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{country.countryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{country.isoCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{country.phoneCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {country.isActive ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleView(country.countryId)}
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: '#f29f67' }}
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(country.countryId)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(country.countryId)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 focus:border-[#f29f67] focus:ring-2 focus:ring-[#f29f67]/20"
              >
                {[5, 10, 15, 20, 25, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md disabled:opacity-50 transition-colors"
                style={{ 
                  backgroundColor: currentPage === 1 ? 'transparent' : 'rgba(242, 159, 103, 0.1)',
                  color: currentPage === 1 ? '#9CA3AF' : '#f29f67'
                }}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-gray-700 font-semibold">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md disabled:opacity-50 transition-colors"
                style={{ 
                  backgroundColor: (currentPage === totalPages || totalPages === 0) ? 'transparent' : 'rgba(242, 159, 103, 0.1)',
                  color: (currentPage === totalPages || totalPages === 0) ? '#9CA3AF' : '#f29f67'
                }}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountriesTable;