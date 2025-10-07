import React, { useState, useMemo } from 'react';
import { Search, Filter, User, Building2, Eye, EyeOff, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { useGetAddressList } from '../../hooks/accountHooks/accountHooks';
import  Sidebar from "../../components/sidebar/Sidebar"
const AddressListTable = () => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'customer', 'supplier'
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  // Get data based on filter type (1 for customer, 2 for supplier, or both)
  const queryParam = filterType === 'customer' ? 1 : filterType === 'supplier' ? 2 : null;
  const { data: addressList = [], isLoading, error } = useGetAddressList(queryParam);

  // Filter and search functionality
  const filteredData = useMemo(() => {
    return addressList.filter(item => {
      // Search filter
      const matchesSearch = 
        item.accountMasterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountNo.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = 
      filterType==='All Types' ||
        (filterType === 'customer' && item.supplierOrCustomer === 'Customer') ||
        (filterType === 'supplier' && item.supplierOrCustomer === 'Supplier');

      // Hidden filter
      const matchesHidden = showHidden || !item.hide;

      return matchesSearch && matchesType && matchesHidden;
    });
  }, [addressList, searchTerm, filterType, showHidden]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading address list: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
 <Sidebar/>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Address List</h1>
        <p className="text-gray-600">Manage your customer and supplier addresses</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, ID, area, or account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
            </select>
          </div>
        </div>

        {/* Show Hidden Toggle */}
        <button
          onClick={() => setShowHidden(!showHidden)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showHidden 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {showHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {showHidden ? 'Hide Hidden' : 'Show Hidden'}
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredData.length} of {addressList.length} records
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Account Details</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Area</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Balances</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Transaction</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">VAT</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                } hover:bg-blue-25 transition-colors ${
                  item.hide ? 'opacity-60' : ''
                }`}
              >
                <td className="border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.supplierOrCustomer === 'Customer' ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Building2 className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.supplierOrCustomer === 'Customer' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.supplierOrCustomer}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div>
                    <div className="font-semibold text-gray-900">{item.accountMasterName}</div>
                    <div className="text-sm text-gray-600">ID: {item.accountId}</div>
                    {item.accountNo && (
                      <div className="text-sm text-gray-600">Acc: {item.accountNo}</div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="text-sm text-gray-900">{item.area}</div>
                  {item.trnNo && (
                    <div className="text-xs text-gray-600">TRN: {item.trnNo}</div>
                  )}
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-600">Opening:</span>
                      <span className="ml-1 font-medium">{formatCurrency(item.openingBalance)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        {formatCurrency(item.totalCredit)}
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="h-3 w-3" />
                        {formatCurrency(item.totalDebit)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.transactionType === 'Debit' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.transactionType === 'Debit' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.transactionType}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="text-sm">
                    {item.vatAssignable ? (
                      <div className="flex items-center gap-1 text-green-700">
                        <CreditCard className="h-3 w-3" />
                        {item.vAtPercentage}%
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {item.hide && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </span>
                    )}
                    {item.jobAssignable && (
                      <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        Job Assignable
                      </span>
                    )}
                    {item.jobCompulsary && (
                      <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        Job Required
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No records found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressListTable;