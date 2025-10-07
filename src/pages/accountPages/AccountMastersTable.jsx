import React, { useState, useMemo, useEffect } from 'react';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import {
  Search,
  AlertCircle,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  FileText,
  Tag,
  Plus,
  Building,
  CreditCard,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Folder,
  MapPin,
  Receipt,
  ArrowLeftRight,
  Percent,
  Briefcase,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const AccountMastersTable = () => {
  const { data: accounts, isLoading, error } = useGetAccountMasters();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterAccountType, setFilterAccountType] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  const navigate = useNavigate();

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

  const transactionTypeColors = {
    'debit': 'bg-red-100 text-red-800',
    'credit': 'bg-green-100 text-green-800',
    'both': 'bg-blue-100 text-blue-800'
  };

  const filteredAccounts = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    let filtered = accounts.filter(account => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (
        account.accountMasterName?.toLowerCase().includes(search) ||
        account.accountId?.toLowerCase().includes(search) ||
        account.accountNo?.toLowerCase().includes(search) ||
        account.accountCategoryName?.toLowerCase().includes(search) ||
        account.accountGroupName?.toLowerCase().includes(search) ||
        account.area?.toLowerCase().includes(search)
      );

      const matchesType = !filterAccountType || account.accountType === filterAccountType;
      const matchesVisibility = showHidden || !account.hide;

      return matchesSearch && matchesType && matchesVisibility;
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
  }, [accounts, searchTerm, sortField, sortDirection, filterAccountType, showHidden]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterAccountType, showHidden]);

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
    navigate('/create-account-master');
  };

  const handleEdit = (accountId) => {
    navigate(`/edit-account-master/${accountId}`);
  };

  const handleDelete = (accountId) => {
    console.log('Delete account:', accountId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const uniqueAccountTypes = [...new Set(accounts?.map(acc => acc.accountType).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading account masters...</span>
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
              <h3 className="font-semibold text-red-800">Error Loading Account Masters</h3>
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Account Masters
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Comprehensive chart of accounts management</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Total: {accounts?.length || 0}</span>
                  <span>Filtered: {filteredAccounts.length}</span>
                  <span>Hidden: {accounts?.filter(acc => acc.hide).length || 0}</span>
                </div>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Account
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search accounts, categories, groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {/* Account Type Filter */}
              <div>
                <select
                  value={filterAccountType}
                  onChange={(e) => setFilterAccountType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value="">All Account Types</option>
                  {uniqueAccountTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Hidden Toggle */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHidden}
                    onChange={(e) => setShowHidden(e.target.checked)}
                    className="w-5 h-5 text-[#f29f67] bg-gray-100 border-gray-300 rounded focus:ring-[#f29f67] focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Hidden</span>
                </label>
              </div>
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
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('accountMasterName')} 
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Account Name {getSortIcon('accountMasterName')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('accountType')} 
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Type {getSortIcon('accountType')}
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Category & Group
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Account Details
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('openingBalance')} 
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Balances {getSortIcon('openingBalance')}
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Settings
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedAccounts.map((account, index) => {
                  const IconComponent = accountTypeIcons[account.accountType?.toLowerCase()] || Building;
                  const typeColorClass = accountTypeColors[account.accountType?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
                  const transactionColorClass = transactionTypeColors[account.transactionType?.toLowerCase()] || 'bg-gray-100 text-gray-800';

                  return (
                    <tr 
                      key={account.id} 
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        account.hide ? 'opacity-60' : ''
                      } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      {/* ID */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">
                          #{account.id}
                        </span>
                      </td>

                      {/* Account Name */}
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {account.accountMasterName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {account.accountId}
                            </div>
                            {account.hide && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-1">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Hidden
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Account Type */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${typeColorClass}`}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {account.accountType}
                        </div>
                      </td>

                      {/* Category & Group */}
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{account.accountCategoryName}</div>
                          <div className="text-gray-500">{account.accountGroupName}</div>
                        </div>
                      </td>

                      {/* Account Details */}
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1">
                          {account.accountNo && (
                            <div className="flex items-center gap-1">
                              <Hash className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{account.accountNo}</span>
                            </div>
                          )}
                          {account.area && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{account.area}</span>
                            </div>
                          )}
                          {account.transactionType && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transactionColorClass}`}>
                              <ArrowLeftRight className="h-3 w-3 mr-1" />
                              {account.transactionType}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Balances */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(account.openingBalance)}
                          </div>
                          {account.foreignCurrencyOpeningBalance !== 0 && (
                            <div className="text-xs text-gray-500">
                              FC: {formatCurrency(account.foreignCurrencyOpeningBalance)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Settings */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {account.vatAssignable && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Percent className="h-3 w-3 mr-1" />
                              VAT {account.vAtPercentage}%
                            </span>
                          )}
                          {account.jobAssignable && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Briefcase className="h-3 w-3 mr-1" />
                              Job{account.jobCompulsary ? '*' : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(account.id)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title="Edit Account"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete Account"
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

          {/* Empty State */}
          {paginatedAccounts.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Account Masters Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterAccountType ? 
                  'No accounts match your current filters. Try adjusting your search criteria.' : 
                  'Get started by creating your first account master to build your chart of accounts.'
                }
              </p>
              {!searchTerm && !filterAccountType && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Account
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAccounts.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                >
                  <option value={10}>10 per page</option>
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
      </div>
    </div>
  );
};

export default AccountMastersTable;