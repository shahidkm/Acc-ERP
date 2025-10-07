import React, { useState, useMemo, useEffect } from 'react';
import { useGetAccountGroups } from '../../hooks/accountHooks/accountHooks';
import {
  Search,
  AlertCircle,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Folder,
  Tag,
  Plus,
  Users,
  Building,
  CreditCard,
  TrendingUp,
  Target,
  DollarSign,
  Edit,
  Trash2
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const AccountGroupsTable = () => {
  const { data: groups, isLoading, error } = useGetAccountGroups();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  // Account type icons for visual indication
  const accountTypeIcons = {
    'asset': Building,
    'liability': CreditCard,
    'income': TrendingUp,
    'expense': Target,
    'equity': DollarSign
  };

  const accountTypeColors = {
    'asset': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'liability': 'bg-red-100 text-red-800 border-red-200',
    'income': 'bg-blue-100 text-blue-800 border-blue-200',
    'expense': 'bg-orange-100 text-orange-800 border-orange-200',
    'equity': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const filteredGroups = useMemo(() => {
    if (!groups || groups.length === 0) return [];

    const filtered = groups.filter(group => {
      const search = searchTerm.toLowerCase();
      return (
        group.name?.toLowerCase().includes(search) ||
        group.accountCategoryName?.toLowerCase().includes(search)
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
  }, [groups, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

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
    navigate('/create-account-group');
  };

  const handleEdit = (groupId) => {
    navigate(`/edit-account-group/${groupId}`);
  };

  const handleDelete = (groupId) => {
    // Add delete confirmation logic here
    console.log('Delete group:', groupId);
  };

  // Get account type from category name (you might need to adjust this logic)
  const getAccountTypeFromCategory = (categoryName) => {
    const lowercaseName = categoryName?.toLowerCase() || '';
    if (lowercaseName.includes('asset')) return 'asset';
    if (lowercaseName.includes('liability')) return 'liability';
    if (lowercaseName.includes('income')) return 'income';
    if (lowercaseName.includes('expense')) return 'expense';
    if (lowercaseName.includes('equity')) return 'equity';
    return 'default';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading account groups...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Account Groups</h3>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                    <FolderOpen className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Account Groups
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage and organize your chart of account groups</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Group
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by group name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
              />
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
                    onClick={() => handleSort('id')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID 
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('name')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Group Name 
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('accountCategoryName')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Category 
                      {getSortIcon('accountCategoryName')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('accountCategoryId')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Category ID 
                      {getSortIcon('accountCategoryId')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedGroups.map((group, index) => {
                  const accountType = getAccountTypeFromCategory(group.accountCategoryName);
                  const IconComponent = accountTypeIcons[accountType] || Users;
                  const colorClass = accountTypeColors[accountType] || 'bg-gray-100 text-gray-800 border-gray-200';

                  return (
                    <tr 
                      key={group.id} 
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">
                          #{group.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Folder className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {group.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {group.accountCategoryName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg font-mono">
                          {group.accountCategoryId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(group.id)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title="Edit Group"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(group.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete Group"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {paginatedGroups.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Account Groups Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 
                  'No groups match your search criteria. Try adjusting your search terms.' : 
                  'Get started by creating your first account group to organize your chart of accounts.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Group
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredGroups.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredGroups.length)} of {filteredGroups.length} groups
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

export default AccountGroupsTable;