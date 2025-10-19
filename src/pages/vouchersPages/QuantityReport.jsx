import React, { useState } from 'react';
import { useGetQuantityReport } from '../../hooks/vouchersHooks/vouchersHook';
import { 
  Search, 
  Download, 
  Printer, 
  FileText,
  Loader,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";

const QuantityReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('itemCode');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const { data: quantityData = [], isLoading, isError, error, refetch } = useGetQuantityReport();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredData = quantityData.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return item.itemCode.toLowerCase().includes(searchLower) ||
           item.description.toLowerCase().includes(searchLower);
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const totals = {
    totalItems: filteredData.length,
    totalOpenQty: filteredData.reduce((sum, item) => sum + item.openQty, 0),
    totalIncomingQty: filteredData.reduce((sum, item) => sum + item.incomingQty, 0),
    totalOutgoingQty: filteredData.reduce((sum, item) => sum + item.outgoingQty, 0),
    totalCurrentQty: filteredData.reduce((sum, item) => sum + item.currentQty, 0)
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Quantity Report', '', '', '', '', ''],
      [`Generated on ${new Date().toLocaleDateString()}`, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Item Code', 'Description', 'Opening Qty', 'Incoming Qty', 'Outgoing Qty', 'Current Qty'],
      ...sortedData.map(item => [
        item.itemCode,
        item.description,
        item.openQty,
        item.incomingQty,
        item.outgoingQty,
        item.currentQty
      ]),
      ['', '', '', '', '', ''],
      ['', 'TOTALS', totals.totalOpenQty, totals.totalIncomingQty, totals.totalOutgoingQty, totals.totalCurrentQty]
    ];
    
    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantity_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatQuantity = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-100 p-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Quantity Report
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Track inventory quantities and movements</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Items</span>
              <Layers className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{totals.totalItems}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Incoming</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatQuantity(totals.totalIncomingQty)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Outgoing</span>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatQuantity(totals.totalOutgoingQty)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Stock</span>
              <Package className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatQuantity(totals.totalCurrentQty)}</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-500" />
                  Search Items
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by item code or description..."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <div className="group flex items-end">
                <button
                  onClick={() => refetch()}
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

            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-4">
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

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Rows per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Report Table */}
        <div className="bg-white shadow-2xl border-2 border-gray-300 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 border-b-2 border-gray-400">
            <h3 className="text-xl font-bold text-white">QUANTITY REPORT</h3>
            <p className="text-sm text-purple-100 mt-1">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {isError ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 text-lg font-semibold">Error loading data</p>
              <p className="text-gray-500 text-sm mt-2">{error?.message}</p>
            </div>
          ) : isLoading ? (
            <div className="p-12 text-center">
              <Loader className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 text-lg">Loading quantity report...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No items found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 border-y-2 border-gray-400">
                      <th 
                        onClick={() => handleSort('itemCode')}
                        className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        Item Code <SortIcon field="itemCode" />
                      </th>
                      <th 
                        onClick={() => handleSort('description')}
                        className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        Description <SortIcon field="description" />
                      </th>
                      <th 
                        onClick={() => handleSort('openQty')}
                        className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-32 cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        Opening Qty <SortIcon field="openQty" />
                      </th>
                      <th 
                        onClick={() => handleSort('incomingQty')}
                        className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-32 cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        Incoming Qty <SortIcon field="incomingQty" />
                      </th>
                      <th 
                        onClick={() => handleSort('outgoingQty')}
                        className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-32 cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        Outgoing Qty <SortIcon field="outgoingQty" />
                      </th>
                      <th 
                        onClick={() => handleSort('currentQty')}
                        className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase border-r border-gray-300 w-32 cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        Current Qty <SortIcon field="currentQty" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={item.itemCode} className={`border-b border-gray-200 hover:bg-purple-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 text-xs font-medium text-gray-900 border-r border-gray-200">
                          {item.itemCode}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700 border-r border-gray-200">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-xs text-right font-mono text-gray-900 border-r border-gray-200">
                          {formatQuantity(item.openQty)}
                        </td>
                        <td className="px-4 py-3 text-xs text-right font-mono text-green-700 border-r border-gray-200">
                          {formatQuantity(item.incomingQty)}
                        </td>
                        <td className="px-4 py-3 text-xs text-right font-mono text-red-700 border-r border-gray-200">
                          {formatQuantity(item.outgoingQty)}
                        </td>
                        <td className={`px-4 py-3 text-xs text-right font-mono font-bold border-r border-gray-200 ${
                          item.currentQty < 0 ? 'text-red-600' : 'text-blue-700'
                        }`}>
                          {formatQuantity(item.currentQty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-200 border-t-2 border-gray-400">
                      <td colSpan="2" className="px-4 py-3 text-right font-bold text-gray-900 text-sm border-r border-gray-300">
                        TOTALS
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 text-sm font-mono border-r border-gray-300">
                        {formatQuantity(totals.totalOpenQty)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-700 text-sm font-mono border-r border-gray-300">
                        {formatQuantity(totals.totalIncomingQty)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-700 text-sm font-mono border-r border-gray-300">
                        {formatQuantity(totals.totalOutgoingQty)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-blue-700 text-sm font-mono border-r border-gray-300">
                        {formatQuantity(totals.totalCurrentQty)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-100 px-6 py-4 border-t-2 border-gray-300 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(endIndex, sortedData.length)}</span> of{' '}
                  <span className="font-semibold">{sortedData.length}</span> items
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantityReport;