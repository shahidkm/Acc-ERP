import React, { useState, useMemo, useEffect } from 'react';
import { useGetSalesmans } from '../../hooks/salesmanHooks/salesmanHooks';
import {
  Search,
  AlertCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  User,
  MapPin,
  Phone,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Building,
  Mail,
  Filter,
  Download,
  MoreVertical,
  Badge,
  MapPinned
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const SalesmenTable = () => {
  const { data: salesmen, isLoading, error } = useGetSalesmans();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('salesmanId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const navigate = useNavigate();

  const filteredSalesmen = useMemo(() => {
    if (!salesmen || salesmen.length === 0) return [];

    const filtered = salesmen.filter(salesman => {
      const search = searchTerm.toLowerCase();
      return (
        salesman.salesmanName?.toLowerCase().includes(search) ||
        salesman.address1?.toLowerCase().includes(search) ||
        salesman.address2?.toLowerCase().includes(search) ||
        salesman.contactNo?.includes(search.replace(/\D/g, '')) // Allow searching by digits only
      );
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [salesmen, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredSalesmen.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSalesmen = filteredSalesmen.slice(startIndex, startIndex + itemsPerPage);

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
    navigate('/create-salesman');
  };

  const handleView = (salesmanId) => {
    navigate(`/salesman/${salesmanId}`);
  };

  const handleEdit = (salesmanId) => {
    navigate(`/edit-salesman/${salesmanId}`);
  };

  const handleDelete = (salesmanId) => {
    console.log('Delete salesman:', salesmanId);
    // Add confirmation dialog and delete logic here
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    
    // Clean the phone number
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
      return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length > 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading salesmen...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Salesmen</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Sales Team
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage your sales team members and their information</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Total: {salesmen?.length || 0} salesmen
                  </span>
                  <span className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Showing: {filteredSalesmen.length} records
                  </span>
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
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Salesman
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name, address, or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {/* Items per page */}
              <div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              {/* Clear Search */}
              {searchTerm && (
                <div className="flex items-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th 
                    onClick={() => handleSort('salesmanId')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID {getSortIcon('salesmanId')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('salesmanName')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Salesman Name {getSortIcon('salesmanName')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Information
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedSalesmen.map((salesman, index) => (
                  <tr 
                    key={salesman.salesmanId} 
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {/* Salesman ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Badge className="h-3 w-3 mr-1" />
                        #{salesman.salesmanId}
                      </span>
                    </td>

                    {/* Salesman Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-lg">
                          <UserCheck className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {salesman.salesmanName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Sales Representative
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Information */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {formatPhoneNumber(salesman.contactNo)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Primary contact number
                        </div>
                      </div>
                    </td>

                    {/* Address Information */}
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-start gap-2">
                          <Building className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {truncateText(salesman.address1, 40)}
                            </div>
                            <div className="text-xs text-gray-500">Primary Address</div>
                          </div>
                        </div>
                        
                        {salesman.address2 && (
                          <div className="flex items-start gap-2 mt-2">
                            <MapPinned className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-gray-700">
                                {truncateText(salesman.address2, 40)}
                              </div>
                              <div className="text-xs text-gray-500">Secondary Address</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(salesman.salesmanId)}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(salesman.salesmanId)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="Edit Salesman"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(salesman.salesmanId)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          title="Delete Salesman"
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
          {paginatedSalesmen.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Salesmen Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 
                  'No salesmen match your search criteria. Try adjusting your search terms.' : 
                  'Get started by adding your first salesman to build your sales team.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Salesman
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredSalesmen.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSalesmen.length)} of {filteredSalesmen.length} salesmen
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
      </div>
    </div>
  );
};

export default SalesmenTable;