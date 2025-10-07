import React, { useState } from 'react';
import { useGetBalanceSheet } from '../../hooks/vouchersHooks/vouchersHook';
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

const BalanceSheet = () => {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  
  const { data: balanceSheetData = {}, isLoading, isError, error, refetch } = useGetBalanceSheet(selectedDate);
  
  const { assets = [], liabilities = [], equities = [] } = balanceSheetData;
  
  const handleDateChange = (dateValue) => {
    setAsOfDate(dateValue);
    const isoDate = new Date(dateValue).toISOString();
    setSelectedDate(isoDate);
  };

  const allAccounts = [...assets, ...liabilities, ...equities];
  const uniqueGroups = [...new Set(allAccounts.map(item => item.groupName))];

  const filterAccounts = (accounts) => accounts.filter(item => {
    const matchesSearch = item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || item.groupName === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const filteredAssets = filterAccounts(assets);
  const filteredLiabilities = filterAccounts(liabilities);
  const filteredEquities = filterAccounts(equities);

  // Corrected totals calculation - sum all balances as absolute values
  const totals = {
    totalAssets: filteredAssets.reduce((sum, item) => sum + Math.abs(item.balance || 0), 0),
    totalLiabilities: filteredLiabilities.reduce((sum, item) => sum + Math.abs(item.balance || 0), 0),
    totalEquities: filteredEquities.reduce((sum, item) => sum + Math.abs(item.balance || 0), 0)
  };

  const totalLiabilitiesAndEquity = totals.totalLiabilities + totals.totalEquities;
  const balanceDiff = totals.totalAssets - totalLiabilitiesAndEquity;

  const handleFetchData = () => {
    refetch();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Balance Sheet', '', '', '', '', ''],
      [`As of ${new Date(asOfDate).toLocaleDateString()}`, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Type', 'Account Name', 'Account ID', 'Category', 'Group', 'Balance'],
      ...filteredAssets.map(item => ['Asset', item.accountName, item.accountId, item.categoryName.trim(), item.groupName, item.balance]),
      ...filteredLiabilities.map(item => ['Liability', item.accountName, item.accountId, item.categoryName.trim(), item.groupName, item.balance]),
      ...filteredEquities.map(item => ['Equity', item.accountName, item.accountId, item.categoryName.trim(), item.groupName, item.balance]),
      ['', '', '', '', '', ''],
      ['', '', '', '', 'Total Assets', totals.totalAssets],
      ['', '', '', '', 'Total Liabilities', totals.totalLiabilities],
      ['', '', '', '', 'Total Equity', totals.totalEquities],
      ['', '', '', '', 'Total Liabilities & Equity', totalLiabilitiesAndEquity]
    ];
    
    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance_sheet_${asOfDate}.csv`;
    a.click();
  };

  const formatBalance = (value) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
    return value < 0 ? `(${formatted})` : formatted;
  };

  const hasData = filteredAssets.length + filteredLiabilities.length + filteredEquities.length > 0;

  const renderSection = (sectionName, items, bgColor) => (
    items.length > 0 && (
      <>
        <tr className={`${bgColor} border-t-2 border-gray-400`}>
          <td colSpan="6" className="px-4 py-2 font-bold text-gray-900 text-sm uppercase tracking-wide">
            {sectionName}
          </td>
        </tr>
        {items.map((item, index) => (
          <tr key={item.accountId} className={`border-b border-gray-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <td className="px-4 py-2 text-xs text-gray-700 border-r border-gray-200 capitalize">
              {item.accountType || 'Unknown'}
            </td>
            <td className="px-4 py-2 text-xs font-medium text-gray-900 border-r border-gray-200">
              {item.accountName}
            </td>
            <td className="px-4 py-2 text-xs text-gray-600 text-center border-r border-gray-200">
              {item.accountId || '-'}
            </td>
            <td className="px-4 py-2 text-xs text-gray-600 border-r border-gray-200">
              {item.categoryName.trim()}
            </td>
            <td className="px-4 py-2 text-xs text-gray-600 border-r border-gray-200">
              {item.groupName}
            </td>
            <td className={`px-4 py-2 text-xs text-right font-mono border-r border-gray-200 ${
              item.balance >= 0 ? 'text-gray-900' : 'text-red-600'
            }`}>
              {formatBalance(item.balance)}
            </td>
          </tr>
        ))}
      </>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Balance Sheet
              </h1>
            </div>
            <p className="text-gray-600 text-lg">View and analyze your balance sheet report</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Assets</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatBalance(totals.totalAssets)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Liabilities</span>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatBalance(totals.totalLiabilities)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Equity</span>
              <DollarSign className="h-5 w-5 text-teal-500" />
            </div>
            <p className="text-2xl font-bold text-teal-600">{formatBalance(totals.totalEquities)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Balance Check</span>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className={`text-2xl font-bold ${Math.abs(balanceDiff) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
              {formatBalance(balanceDiff)}
            </p>
          </div>
        </div>

        {/* Excel-Style Balance Sheet Table */}
        <div className="bg-white shadow-2xl border-2 border-gray-300 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b-2 border-gray-400">
            <h3 className="text-xl font-bold text-white">BALANCE SHEET</h3>
            <p className="text-sm text-blue-100 mt-1">As of {new Date(asOfDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {!hasData ? (
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
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-y-2 border-gray-400">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-24">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-gray-300">
                      Account Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-24">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-gray-300">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-gray-300">
                      Group
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-32">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {renderSection('ASSETS', filteredAssets, 'bg-green-50')}
                  {renderSection('LIABILITIES', filteredLiabilities, 'bg-red-50')}
                  {renderSection('EQUITY', filteredEquities, 'bg-blue-50')}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-400 bg-green-100">
                    <td colSpan="5" className="px-4 py-3 text-right font-bold text-gray-900 text-sm border-r border-gray-300">
                      TOTAL ASSETS
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700 text-sm font-mono border-r border-gray-300">
                      {formatBalance(totals.totalAssets)}
                    </td>
                  </tr>
                  <tr className="bg-red-100 border-t border-gray-300">
                    <td colSpan="5" className="px-4 py-3 text-right font-bold text-gray-900 text-sm border-r border-gray-300">
                      TOTAL LIABILITIES
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-700 text-sm font-mono border-r border-gray-300">
                      {formatBalance(totals.totalLiabilities)}
                    </td>
                  </tr>
                  <tr className="bg-blue-100 border-t border-gray-300">
                    <td colSpan="5" className="px-4 py-3 text-right font-bold text-gray-900 text-sm border-r border-gray-300">
                      TOTAL EQUITY
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700 text-sm font-mono border-r border-gray-300">
                      {formatBalance(totals.totalEquities)}
                    </td>
                  </tr>
                  <tr className="bg-gray-200 border-t-2 border-gray-400">
                    <td colSpan="5" className="px-4 py-3 text-right font-bold text-gray-900 text-sm border-r border-gray-300">
                      TOTAL LIABILITIES AND EQUITY
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 text-sm font-mono border-r border-gray-300">
                      {formatBalance(totalLiabilitiesAndEquity)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Balance Verification */}
        <div className="mt-6 bg-white border-2 border-gray-300 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Balance Verification</h3>
              <p className="text-sm text-gray-700">
                Assets - (Liabilities + Equity) = 
                <span className={`ml-2 font-bold font-mono ${
                  Math.abs(balanceDiff) < 0.01 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatBalance(balanceDiff)}
                </span>
              </p>
            </div>
            {Math.abs(balanceDiff) < 0.01 ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">BALANCED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <AlertCircle className="h-6 w-6" />
                <span className="font-bold">NOT BALANCED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;