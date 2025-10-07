import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Plus, Download, Calendar, DollarSign, User, FileText, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetSalesOrders } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import Sidebar from "../../components/sidebar/Sidebar";
const SalesOrderTable = () => {
  const { data: salesOrders, isLoading, isError, error } = useGetSalesOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
const navigate=useNavigate();
  const handleCreateNew = () => {
   navigate("/create-sales-order");
  };

  // Add debugging to see the data structure
  console.log('Raw sales orders data:', salesOrders);

  // Ensure salesOrders is an array before filtering
  const salesOrdersArray = Array.isArray(salesOrders) 
    ? salesOrders 
    : salesOrders?.data && Array.isArray(salesOrders.data)
    ? salesOrders.data
    : salesOrders?.salesOrders && Array.isArray(salesOrders.salesOrders)
    ? salesOrders.salesOrders
    : [];

  console.log('Sales orders array:', salesOrdersArray);

  // Filter and sort sales orders
  const filteredOrders = salesOrdersArray.filter(order => {
    const matchesSearch = 
      order.referenseNo?.toString().includes(searchTerm) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId?.toString().includes(searchTerm) ||
      order.quotationId?.toString().includes(searchTerm);
    
    const matchesCurrency = filterCurrency === 'all' || order.currency === filterCurrency;
    
    return matchesSearch && matchesCurrency;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    // Validate and sanitize currency code
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NOK', 'MXN', 'NZD', 'SGD', 'HKD', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR'];
    const sanitizedCurrency = typeof currency === 'string' && currency.length === 3 && validCurrencies.includes(currency.toUpperCase()) 
      ? currency.toUpperCase() 
      : 'USD';

    // Ensure amount is a valid number
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: sanitizedCurrency
      }).format(numericAmount);
    } catch (error) {
      // Fallback to simple formatting if Intl.NumberFormat fails
      return `${sanitizedCurrency} ${numericAmount.toFixed(2)}`;
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleEdit = (id) => {
    console.log('Edit sales order:', id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log('Delete sales order:', id);
    // Implement delete functionality
  };

  const handleExport = () => {
    console.log('Export sales orders');
    // Implement export functionality
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading sales orders</h3>
            <p className="text-sm text-red-700 mt-1">{error?.message || 'An error occurred'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <Sidebar/>
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3" />
              Sales Orders
            </h1>
            <p className="text-green-100 mt-2">Manage and view all sales orders</p>
          </div>
          <button
               onClick={handleCreateNew}
          className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Sales Order
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-72">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference no, description, customer ID, or quotation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Currencies</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="referenseNo-desc">Ref No. (High to Low)</option>
                <option value="referenseNo-asc">Ref No. (Low to High)</option>
                <option value="grandTotal-desc">Amount (High to Low)</option>
                <option value="grandTotal-asc">Amount (Low to High)</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(filteredOrders.map(order => order.customerId).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredOrders.filter(order => 
                  order.date && new Date(order.date).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quotation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.referenseNo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      #{order.referenseNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.date ? formatDate(order.date) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <span>ID: {order.customerId || 'N/A'}</span>
                        {order.salesManId && (
                          <p className="text-xs text-gray-500">SM: {order.salesManId}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quotationId ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Q#{order.quotationId}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No quotation</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {order.description || 'No description'}
                    </div>
                    {order.discount > 0 && (
                      <div className="text-xs text-green-600">
                        {order.discount}% discount applied
                      </div>
                    )}
                    {order.jobCode && (
                      <div className="text-xs text-gray-500">
                        Job: {order.jobCode}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.currency || 'USD'}
                      {order.foreignCurrency && (
                        <span className="text-xs text-gray-500 block">
                          Rate: {order.currencyRate}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {order.salesOrderItems?.length || 0} items
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.grandTotal || 0, order.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      VAT: {formatCurrency(order.totalVATAmount || 0, order.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(order.referenseNo)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.referenseNo)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales orders found</h3>
            <p className="text-gray-500">
              {searchTerm || filterCurrency !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first sales order'}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Sales Order Details - #{selectedOrder.referenseNo}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Date:</span> {selectedOrder.date ? formatDate(selectedOrder.date) : 'N/A'}</p>
                    <p><span className="font-medium">Customer ID:</span> {selectedOrder.customerId || 'N/A'}</p>
                    <p><span className="font-medium">Salesman ID:</span> {selectedOrder.salesManId || 'N/A'}</p>
                    <p><span className="font-medium">Quotation ID:</span> {selectedOrder.quotationId || 'N/A'}</p>
                    <p><span className="font-medium">Job Code:</span> {selectedOrder.jobCode || 'N/A'}</p>
                    <p><span className="font-medium">Purchase Order:</span> {selectedOrder.purchaseOrderId || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Currency & Terms</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Currency:</span> {selectedOrder.currency || 'USD'}</p>
                    <p><span className="font-medium">Foreign Currency:</span> {selectedOrder.foreignCurrency ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Currency Rate:</span> {selectedOrder.currencyRate || '1'}</p>
                    <p><span className="font-medium">Day:</span> {selectedOrder.day || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Subtotal:</span> {formatCurrency(selectedOrder.subtotal || 0, selectedOrder.currency)}</p>
                    <p><span className="font-medium">Discount:</span> {selectedOrder.discount || 0}%</p>
                    <p><span className="font-medium">Net Amount:</span> {formatCurrency(selectedOrder.netAmount || 0, selectedOrder.currency)}</p>
                    <p><span className="font-medium">VAT:</span> {formatCurrency(selectedOrder.totalVATAmount || 0, selectedOrder.currency)}</p>
                    <p className="text-lg"><span className="font-bold">Grand Total:</span> <span className="font-bold text-green-600">{formatCurrency(selectedOrder.grandTotal || 0, selectedOrder.currency)}</span></p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description & Terms</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><span className="font-medium">Description:</span> {selectedOrder.description || 'No description'}</p>
                  <p><span className="font-medium">Terms:</span> {selectedOrder.terms || 'No terms specified'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items ({selectedOrder.salesOrderItems?.length || 0})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Included</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">VAT</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(selectedOrder.salesOrderItems || []).map((item, index) => (
                        <tr key={item.itemId || index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.itemId || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.unitId || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.cost || 0, selectedOrder.currency)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.taxCode || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <span className={`px-2 py-1 rounded-full text-xs ${item.taxIncluded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.taxIncluded ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.vatAmount || 0, selectedOrder.currency)}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(item.total || 0, selectedOrder.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrderTable;