import React, { useState } from 'react';
import { useGetTrialBalance } from '../../hooks/vouchersHooks/vouchersHook';
import { 
  Search, 
  Download, 
  Printer, 
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
const TrialBalance = () => {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  
  // Fetch trial balance data using the hook with ISO date string parameter
  const { data: trialBalanceData = [], isLoading, isError, error, refetch } = useGetTrialBalance(selectedDate);
  
  // Handle date change and update the selected date in ISO format
  const handleDateChange = (dateValue) => {
    setAsOfDate(dateValue);
    // Convert to ISO string for API
    const isoDate = new Date(dateValue).toISOString();
    setSelectedDate(isoDate);
  };

  // Get unique groups for filter
  const uniqueGroups = [...new Set(trialBalanceData.map(item => item.groupName))];

  // Filter data based on search and group filter
  const filteredData = trialBalanceData.filter(item => {
    const matchesSearch = item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || item.groupName === filterGroup;
    return matchesSearch && matchesGroup;
  });

  // Calculate totals
  const totals = filteredData.reduce((acc, item) => ({
    openingBalance: acc.openingBalance + item.openingBalance,
    totalDebit: acc.totalDebit + item.totalDebit,
    totalCredit: acc.totalCredit + item.totalCredit,
    closingBalance: acc.closingBalance + item.closingBalance
  }), { openingBalance: 0, totalDebit: 0, totalCredit: 0, closingBalance: 0 });

  const handleFetchData = () => {
    console.log('Fetching trial balance for date:', asOfDate);
    refetch();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting trial balance data...');
    // Implement export functionality
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
        <Sidebar/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Trial Balance
              </h1>
            </div>
            <p className="text-gray-600 text-lg">View and analyze your trial balance report</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Date Picker */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-500" />
                  As of Date
                </label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                />
              </div>

              {/* Group Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-teal-500" />
                  Filter by Group
                </label>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                >
                  <option value="all">All Groups</option>
                  {uniqueGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-teal-500" />
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search accounts..."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                />
              </div>

              {/* Action Buttons */}
              <div className="group flex items-end">
                <button
                  onClick={handleFetchData}
                  disabled={isLoading}
                  className="w-full bg-[#f29f67] text-white px-4 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-md"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Opening Balance</span>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.openingBalance)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Debit</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalDebit)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Credit</span>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalCredit)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Closing Balance</span>
              <DollarSign className="h-5 w-5 text-teal-500" />
            </div>
            <p className={`text-2xl font-bold ${totals.closingBalance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(totals.closingBalance)}
            </p>
          </div>
        </div>

        {/* Trial Balance Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100">
            <h3 className="text-lg font-semibold text-gray-900">Trial Balance Report</h3>
            <p className="text-sm text-gray-600 mt-1">As of {new Date(asOfDate).toLocaleDateString()}</p>
          </div>

          {filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {isLoading ? 'Loading data...' : isError ? 'Error loading data' : 'No data found'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {isError ? error?.message : 'Try adjusting your filters or date range'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Group Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Opening Balance
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Debit
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Credit
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Closing Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-teal-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.accountName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.accountNo || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                          {item.groupName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(item.openingBalance)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-green-600">
                        {formatCurrency(item.totalDebit)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-red-600">
                        {formatCurrency(item.totalCredit)}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-bold ${
                        item.closingBalance >= 0 ? 'text-gray-900' : 'text-red-600'
                      }`}>
                        {item.closingBalance < 0 && '('}
                        {formatCurrency(item.closingBalance)}
                        {item.closingBalance < 0 && ')'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-teal-50 to-cyan-50 border-t-2 border-teal-200">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-sm font-bold text-gray-900">
                      TOTAL
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                      {formatCurrency(totals.openingBalance)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-green-600">
                      {formatCurrency(totals.totalDebit)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-red-600">
                      {formatCurrency(totals.totalCredit)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-right font-bold ${
                      totals.closingBalance >= 0 ? 'text-gray-900' : 'text-red-600'
                    }`}>
                      {totals.closingBalance < 0 && '('}
                      {formatCurrency(totals.closingBalance)}
                      {totals.closingBalance < 0 && ')'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Balance Check */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance Verification</h3>
              <p className="text-sm text-gray-600">
                Debit - Credit Difference: 
                <span className={`ml-2 font-bold ${
                  Math.abs(totals.totalDebit - totals.totalCredit) < 0.01 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(totals.totalDebit - totals.totalCredit)}
                </span>
              </p>
            </div>
            {Math.abs(totals.totalDebit - totals.totalCredit) < 0.01 ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold">Balanced</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                <span className="font-semibold">Not Balanced</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;