import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useGetAccountEnquries } from '../../hooks/accountHooks/accountHooks';
import Sidebar from "../../components/sidebar/Sidebar";

const Reconciliation = () => {
  const accountsData = useGetAccountEnquries();
  
  // Debug logging to see what we're getting
  console.log('Raw accountsData:', accountsData);
  console.log('Type of accountsData:', typeof accountsData);
  console.log('Is Array:', Array.isArray(accountsData));
  
  // Handle different possible data structures
  let accounts = [];
  if (Array.isArray(accountsData)) {
    accounts = accountsData;
  } else if (accountsData && Array.isArray(accountsData.data)) {
    accounts = accountsData.data;
  } else if (accountsData && accountsData.accounts && Array.isArray(accountsData.accounts)) {
    accounts = accountsData.accounts;
  } else if (accountsData && typeof accountsData === 'object') {
    // If it's an object, try to find an array property
    const arrayProp = Object.values(accountsData).find(value => Array.isArray(value));
    if (arrayProp) {
      accounts = arrayProp;
    }
  }

  console.log('Processed accounts:', accounts);
  console.log('Accounts length:', accounts.length);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique values for filter options - with safety checks
  const uniqueGroups = accounts.length > 0 ? [...new Set(accounts.map(acc => acc.groupName).filter(Boolean))] : [];
  const uniqueCategories = accounts.length > 0 ? [...new Set(accounts.map(acc => acc.categoryName).filter(Boolean))] : [];

  // Filtered accounts based on search and filters
  const filteredAccounts = useMemo(() => {
    if (!accounts.length) return [];
    
    return accounts.filter(account => {
      // Safety checks for account properties
      const accountMasterName = account.accountMasterName || '';
      const accountId = account.accountId || '';
      const groupName = account.groupName || '';
      const categoryName = account.categoryName || '';
      
      const matchesSearch = 
        accountMasterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGroup = !selectedGroup || groupName === selectedGroup;
      const matchesCategory = !selectedCategory || categoryName === selectedCategory;
      
      let matchesBalance = true;
      const closingBalance = account.closingBalance || 0;
      if (balanceFilter === 'positive') {
        matchesBalance = closingBalance > 0;
      } else if (balanceFilter === 'negative') {
        matchesBalance = closingBalance < 0;
      } else if (balanceFilter === 'zero') {
        matchesBalance = closingBalance === 0;
      }
      
      return matchesSearch && matchesGroup && matchesCategory && matchesBalance;
    });
  }, [accounts, searchTerm, selectedGroup, selectedCategory, balanceFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const clearFilters = () => {
    setSelectedGroup('');
    setSelectedCategory('');
    setBalanceFilter('');
    setSearchTerm('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Account Enquiry</h1>
            <p className="text-gray-600">View and manage your account information</p>

            
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search accounts, ID, or group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Filters</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
                        <select
                          value={selectedGroup}
                          onChange={(e) => setSelectedGroup(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="">All Groups</option>
                          {uniqueGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="">All Categories</option>
                          {uniqueCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
                        <select
                          value={balanceFilter}
                          onChange={(e) => setBalanceFilter(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="">All Balances</option>
                          <option value="positive">Positive Balance</option>
                          <option value="negative">Negative Balance</option>
                          <option value="zero">Zero Balance</option>
                        </select>
                      </div>

                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedGroup || selectedCategory || balanceFilter || searchTerm) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedGroup && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Group: {selectedGroup}
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Category: {selectedCategory}
                  </span>
                )}
                {balanceFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Balance: {balanceFilter.charAt(0).toUpperCase() + balanceFilter.slice(1)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </p>
          </div>

          {/* Loading State */}
          {accountsData === undefined || accountsData === null ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-500">Loading accounts...</p>
              </div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center">
                <Search className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No accounts available</p>
                <p className="text-gray-500">No account data found</p>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Debug Info:</p>
                  <p className="text-xs text-gray-500 mt-1">Raw data: {JSON.stringify(accountsData)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Account ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Account Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Opening Balance
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Closing Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account, index) => (
                        <tr key={account.accountId || index} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {account.accountId || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.accountMasterName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {account.groupName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {account.categoryName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={(account.openingBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(account.openingBalance || 0)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={(account.closingBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(account.closingBalance || 0)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Search className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No accounts found</p>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Footer */}
          {filteredAccounts.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredAccounts.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Opening Balance</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(filteredAccounts.reduce((sum, acc) => sum + acc.openingBalance, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Closing Balance</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(filteredAccounts.reduce((sum, acc) => sum + acc.closingBalance, 0))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;