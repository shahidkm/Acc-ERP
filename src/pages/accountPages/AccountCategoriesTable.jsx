import React, { useState, useMemo, useEffect } from 'react';
import { useGetAccountCategories } from '../../hooks/accountHooks/accountHooks';
import {
  Search,
  AlertCircle,
  Folder,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Tag,
  FileText,
  Plus,
  Users
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const AccountCategoriesTable = () => {
  const { data: categories, isLoading, error } = useGetAccountCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const filtered = categories.filter(category => {
      const search = searchTerm.toLowerCase();
      return (
        category.name?.toLowerCase().includes(search) ||
        category.accountType?.toLowerCase().includes(search)
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
  }, [categories, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

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
    navigate('/create-account-category');
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p>Error loading account categories. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Categories</h1>
            <p className="text-sm text-gray-600">Manage and view account categories</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white font-medium rounded-lg hover:bg-[#e8935c]"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or account type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort('id')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    ID {getSortIcon('id')}
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Name {getSortIcon('name')}
                  </div>
                </th>
                <th onClick={() => handleSort('accountType')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Account Type {getSortIcon('accountType')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-mono">#{category.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.accountType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {paginatedCategories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No account categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new account category.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of {filteredCategories.length}
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm px-2 py-1">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountCategoriesTable;