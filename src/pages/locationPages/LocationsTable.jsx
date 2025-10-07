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
  Edit,
  Trash2,
  Download,
  XCircle,
  Info
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useGetLocations } from '../../hooks/locationHooks/locationHooks';

const LocationsTable = () => {
  const { data: locations, isLoading, error } = useGetLocations();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('locationId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const navigate = useNavigate();

  const filteredLocations = useMemo(() => {
    if (!locations || locations.length === 0) return [];

    const lower = searchTerm.toLowerCase();

    let filtered = locations.filter(loc => {
      return (
        String(loc.locationId).toLowerCase().includes(lower) ||
        loc.locationCode?.toLowerCase().includes(lower) ||
        loc.locationName?.toLowerCase().includes(lower) ||
        String(loc.customerId).toLowerCase().includes(lower)
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

      // Booleans: treat true > false
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
  }, [locations, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLocations = filteredLocations.slice(startIndex, startIndex + itemsPerPage);

  const stats = useMemo(() => {
    if (!locations) return { total: 0 };
    return { total: locations.length };
  }, [locations]);

  useEffect(() => {
    // Whenever search changes, go back to first page
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
    navigate('/create-location');
  };

  const handleView = (locationId) => {
    navigate(`/location/${locationId}`);
  };

  const handleEdit = (locationId) => {
    navigate(`/edit-location/${locationId}`);
  };

  const handleDelete = (locationId) => {
    console.log('Delete location:', locationId);
    // Add your delete logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          <span className="text-gray-600">Loading locations...</span>
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
              <h3 className="font-semibold text-red-800">Error Loading Locations</h3>
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

        {/* Header with Stats */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#f29f67] rounded-xl shadow-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Locations
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage location list and details</p>

                <div className="flex gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                    <div className="text-sm text-gray-600">Total Locations</div>
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
                  className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Location
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
                    placeholder="Search locations by code, name, ID, or customer ID..."
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
                    onClick={() => handleSort('locationId')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID {getSortIcon('locationId')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('locationCode')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Code {getSortIcon('locationCode')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('locationName')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Name {getSortIcon('locationName')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('customerId')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-teal-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Customer ID {getSortIcon('customerId')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Consignment
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedLocations.map((loc, index) => (
                  <tr
                    key={loc.locationId}
                    className={`hover:bg-teal-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Hash className="h-4 w-4 text-[#f29f67]" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {loc.locationId}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 font-mono">
                        {loc.locationCode}
                      </div>
                      <div className="text-xs text-gray-500">Code</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {loc.locationName}
                      </div>
                      <div className="text-xs text-gray-500">Name</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {loc.customerId}
                      </div>
                      <div className="text-xs text-gray-500">Customer</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {loc.default ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Yes</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">No</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {loc.consignmentLocation ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Yes</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">No</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(loc.locationId)}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          title="View Location"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(loc.locationId)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="Edit Location"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(loc.locationId)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          title="Delete Location"
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

          {paginatedLocations.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Locations Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'No locations match your search criteria.'
                  : 'Get started by creating your first location.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Location
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredLocations.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLocations.length)} of {filteredLocations.length} locations
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
                  onClick={() => setCurrentPage(prev => prev - 1)}
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
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
          <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Location Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-teal-800">Naming & Codes</p>
              <p className="text-teal-700 text-sm">
                Make sure location codes and names are unique and descriptive.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-teal-800">Status Flags</p>
              <p className="text-teal-700 text-sm">
                “Default” and “Consignment Location” are toggles which should be clearly shown.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LocationsTable;
