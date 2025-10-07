import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag,
  Search, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Calendar,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  DollarSign,
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Percent,
  CreditCard,
  Tag,
  Package
} from 'lucide-react';

import Sidebar from "../../components/sidebar/Sidebar";
import { useGetSalesOrders } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import { useNavigate } from 'react-router-dom';
const SalesOrdersTable = () => {
  const { data: salesOrders, isLoading, error } = useGetSalesOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
const navigate=useNavigate();
  const orders = salesOrders || [];

  // Get unique currencies for filter
  const uniqueCurrencies = useMemo(() => {
    const currencies = new Set(orders.map(order => order.currency));
    return Array.from(currencies);
  }, [orders]);

  // Filter and search functionality
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    let filtered = orders.filter(order => {
      const matchesSearch = searchTerm === '' || 
        (order.orderId?.toString() || '').includes(searchTerm) ||
        (order.referenseNo?.toString() || '').includes(searchTerm) ||
        (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.salesManName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status.toString() === statusFilter;
      const matchesCurrency = currencyFilter === 'all' || order.currency === currencyFilter;
      
      return matchesSearch && matchesStatus && matchesCurrency;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, sortField, sortDirection, statusFilter, currencyFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, currencyFilter]);

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      1: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      2: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig[0];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  const handleCreateNew = () => {
   navigate("/create-sales-order");
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Sales Orders</h3>
            <p className="text-gray-600">Failed to fetch sales orders</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6">
        <Sidebar/>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
              <p className="text-gray-600 mt-1">Manage and view all sales order entries</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Order
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
                placeholder="Search by order ID, customer, salesman, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </div>

            {/* Currency Filter */}
            <div className="w-full lg:w-48">
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="all">All Currencies</option>
                {uniqueCurrencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
              {orders && filteredOrders.length !== orders.length && (
                <span className="text-gray-500"> (filtered from {orders.length} total)</span>
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
                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
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
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sales Orders Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || currencyFilter !== 'all' ? 'Try adjusting your filters.' : 'No sales orders are available at the moment.'}
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
                        onClick={() => handleSort('orderId')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Order ID
                          <span className="text-gray-400">{getSortIcon('orderId')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('date')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                          <span className="text-gray-400">{getSortIcon('date')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Customer
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Salesman
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Terms
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Amount
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('status')}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Status
                          <span className="text-gray-400">{getSortIcon('status')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order, index) => (
                      <tr key={order.orderId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 font-medium">#SO-{order.orderId}</div>
                          <div className="text-xs text-gray-500">Ref: {order.referenseNo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                          <div className="text-xs text-gray-500">Job: {order.jobCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-orange-100 rounded-full p-2 mr-3">
                              <Users className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-xs text-gray-500">ID: {order.customerId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{order.salesManName}</div>
                          <div className="text-xs text-gray-500">ID: {order.salesManId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.terms}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              order.foreignCurrency ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.currency}
                            </span>
                            {order.foreignCurrency && (
                              <span className="text-xs text-gray-500">@{order.currencyRate}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(order.netAmount, order.currency)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Sub: {formatCurrency(order.subtotal, order.currency)}</span>
                              {order.discount > 0 && (
                                <span className="text-green-600">-{formatCurrency(order.discount, order.currency)}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="inline-flex items-center px-3 py-1 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 rounded-b-xl mt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;
                        
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
                                  ? 'border-orange-500 bg-orange-500 text-white'
                                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Sales Order Details</h2>
                    <p className="text-sm text-gray-600 mt-1">Order #SO-{selectedOrder.orderId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Order Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference No.</p>
                    <p className="font-medium text-gray-900">{selectedOrder.referenseNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Code</p>
                    <p className="font-medium text-gray-900">{selectedOrder.jobCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                    <p className="text-xs text-gray-500">ID: {selectedOrder.customerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salesman</p>
                    <p className="font-medium text-gray-900">{selectedOrder.salesManName}</p>
                    <p className="text-xs text-gray-500">ID: {selectedOrder.salesManId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Terms</p>
                    <p className="font-medium text-gray-900">{selectedOrder.terms}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.day} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Currency</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.currency} {selectedOrder.foreignCurrency && `(Rate: ${selectedOrder.currencyRate})`}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder.description || 'No description provided'}</p>
                </div>

                {/* Items Table */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Unit</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Cost</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tax Code</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Tax Incl.</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">VAT</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.salesOrderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="text-sm text-gray-900 font-medium">{item.itemName}</div>
                            <div className="text-xs text-gray-500">ID: {item.itemId}</div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.unitName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {formatCurrency(item.cost, selectedOrder.currency)}
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {item.taxCode}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {item.taxIncluded ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {formatCurrency(item.vatAmount, selectedOrder.currency)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(item.total, selectedOrder.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}
                      </span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatCurrency(selectedOrder.discount, selectedOrder.currency)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Grand Total (Before VAT)</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedOrder.grandTotal, selectedOrder.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        Total VAT Amount
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedOrder.totalVATAmount, selectedOrder.currency)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Net Amount</span>
                        <span className="text-xl font-bold text-orange-600">
                          {formatCurrency(selectedOrder.netAmount, selectedOrder.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Related Documents</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-blue-800">Quotation ID: {selectedOrder.quotationId}</p>
                      <p className="text-blue-800">Purchase Order ID: {selectedOrder.purchaseOrderId}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Order Statistics</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-800">Total Items: {selectedOrder.salesOrderItems.length}</p>
                      <p className="text-green-800">Total Quantity: {selectedOrder.salesOrderItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Print Order
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrdersTable;