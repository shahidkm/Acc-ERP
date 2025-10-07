import React, { useState, useMemo } from 'react';
import { useGetInventoryCategories } from '../../hooks/inventoryHooks/useGetInventoryCategory';
import { 
  Package, 
  Search, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  FileText,
  Tag,
  Plus
} from 'lucide-react';
import Sidebar from  "../../components/sidebar/Sidebar"
import { useNavigate } from 'react-router-dom';
const InventoryCategoriesTable = () => {
  const { data: inventoryGroups, isLoading, error } = useGetInventoryCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
const navigate=useNavigate();
  // Extract groups from response - assuming the hook returns the array directly
  const groups = inventoryGroups || [];

  // Filter and search functionality
  const filteredGroups = useMemo(() => {
    if (!groups.length) return [];

    let filtered = groups.filter(group => {
      const matchesSearch = searchTerm === '' || 
        (group.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (group.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (group.id?.toString() || '').includes(searchTerm);
      
      return matchesSearch;
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
  }, [groups, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  // Reset to first page when filters change
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

  const handleCreateNew = () => {
   navigate("/create-category");
    console.log('Create new inventory group');
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Inventory Groups</h3>
            <p className="text-gray-600">Failed to fetch inventory groups</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Inventory Categories</h1>
              <p className="text-gray-600 mt-1">Manage and view all inventory  categories</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white font-medium rounded-lg hover:bg-[#e8935c] focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:ring-offset-2 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New
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
                placeholder="Search by name, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredGroups.length)} of {filteredGroups.length} inventory groups
              {groups && filteredGroups.length !== groups.length && (
                <span className="text-gray-500"> (filtered from {groups.length} total)</span>
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
        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory Groups Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'No inventory groups are available at the moment.'}
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
                          <Package className="h-4 w-4" />
                          Category Name
                          <span className="text-gray-400">{getSortIcon('name')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('description')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Description
                          <span className="text-gray-400">{getSortIcon('description')}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedGroups.map((group, index) => (
                      <tr key={group.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 font-medium">#{group.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{group.name || 'Not specified'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-900 max-w-md">
                              {group.description ? (
                                <p className="break-words">{group.description}</p>
                              ) : (
                                <span className="text-gray-500 italic">No description provided</span>
                              )}
                            </div>
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

export default InventoryCategoriesTable;