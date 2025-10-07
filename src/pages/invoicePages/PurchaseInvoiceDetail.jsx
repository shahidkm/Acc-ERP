import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPurchaseInvoiceById } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
import Sidebar from '../../components/sidebar/Sidebar';
import {
  ArrowLeft,
  Receipt,
  Calendar,
  User,
  Building,
  FileText,
  Hash,
  DollarSign,
  Globe,
  Clock,
  Package,
  Edit,
  Download,
  
  Share2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  CreditCard,
  Percent,
  Calculator,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Loader
} from 'lucide-react';

const PurchaseInvoiceDetail = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { data: invoice, isLoading, error } = useGetPurchaseInvoiceById(invoiceId);

  // Get status based on due date
  const getInvoiceStatus = (invoice) => {
    if (!invoice) return 'unknown';
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (invoice.paid) return 'paid';
    if (daysDiff < 0) return 'overdue';
    if (daysDiff <= 7) return 'due-soon';
    return 'pending';
  };

  const statusConfig = {
    'paid': { 
      label: 'Paid', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle 
    },
    'pending': { 
      label: 'Pending', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Clock 
    },
    'overdue': { 
      label: 'Overdue', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    },
    'due-soon': { 
      label: 'Due Soon', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: AlertTriangle 
    },
    'unknown': { 
      label: 'Unknown', 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: Info 
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
  
    let validCurrency = 'USD';
    
    if (currency && typeof currency === 'string' && currency.length === 3) {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SGD'];
      validCurrency = validCurrencies.includes(currency.toUpperCase()) ? currency.toUpperCase() : 'USD';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: validCurrency,
        minimumFractionDigits: 2
      }).format(amount || 0);
    } catch (error) {
      return `${validCurrency} ${(amount || 0).toFixed(2)}`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    navigate(`/edit-purchase-invoice/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log('Download invoice as PDF');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share invoice');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin h-8 w-8 text-[#f29f67]" />
          <span className="text-gray-600">Loading invoice details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <Sidebar />
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Invoice</h3>
              <p className="text-red-700">Could not load invoice details. Please try again or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <Sidebar />
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">Invoice Not Found</h3>
              <p className="text-yellow-700">The requested invoice could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = getInvoiceStatus(invoice);
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/purchase-invoices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Invoices
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                    <Receipt className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Purchase Invoice #{invoice.referenceNo}
                  </h1>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {statusInfo.label}
                  </div>
                  <span className="text-sm text-gray-500">Invoice ID: {invoice.id}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Print
                </button>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300 shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Invoice Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#f29f67]" />
                  Invoice Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Reference Number</p>
                        <p className="font-semibold text-gray-900">{invoice.referenceNo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Invoice Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(invoice.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
                        {invoice.days > 0 && (
                          <p className="text-xs text-gray-500">{invoice.days} days payment terms</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Document Type</p>
                        <p className="font-semibold text-gray-900">{invoice.documentType || 'Standard Invoice'}</p>
                        {invoice.documentId > 0 && (
                          <p className="text-xs text-gray-500">Document ID: {invoice.documentId}</p>
                        )}
                      </div>
                    </div>
                    
                    {invoice.purchaseOrderId > 0 && (
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Purchase Order</p>
                          <p className="font-semibold text-gray-900">PO #{invoice.purchaseOrderId}</p>
                        </div>
                      </div>
                    )}
                    
                    {invoice.jobCodeId > 0 && (
                      <div className="flex items-center gap-3">
                        <Hash className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Job Code</p>
                          <p className="font-semibold text-gray-900">Job #{invoice.jobCodeId}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#f29f67]" />
                  Purchase Items ({invoice.purchaseItems?.length || 0})
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          VAT Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {invoice.purchaseItems?.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                <Package className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Product #{item.productId}
                                </p>
                                <p className="text-xs text-gray-500">Item ID: {item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {item.unitId > 0 ? `Unit #${item.unitId}` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(item.cost, invoice.currency)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.taxCode ? (
                              <div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {item.taxCode}
                                </span>
                                {item.taxIncluded && (
                                  <p className="text-xs text-green-600 mt-1">Tax Included</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">No Tax</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(item.vatAmount, invoice.currency)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                            {formatCurrency(item.total, invoice.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            
            {/* Account & Supplier Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#f29f67]" />
                  Account & Supplier
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Account Master</p>
                      <p className="font-semibold text-gray-900">
                        Account #{invoice.accountMasterId}
                      </p>
                      {invoice.accountMasterName && (
                        <p className="text-sm text-gray-600">{invoice.accountMasterName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="font-semibold text-gray-900">
                        Supplier #{invoice.supplierId}
                      </p>
                      {invoice.supplierName && (
                        <p className="text-sm text-gray-600">{invoice.supplierName}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Information */}
            {invoice.foreignCurrency && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#f29f67]" />
                    Currency Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Currency</p>
                        <p className="font-semibold text-gray-900">{invoice.currency}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calculator className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Exchange Rate</p>
                        <p className="font-semibold text-gray-900">{invoice.currencyRate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Totals */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#f29f67]" />
                  Invoice Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(invoice.subtotal, invoice.currency)}
                    </span>
                  </div>
                  
                  {invoice.discount > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Discount ({invoice.discount}%):</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency((invoice.subtotal * invoice.discount) / 100, invoice.currency)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Total VAT:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(invoice.totalVATAmount, invoice.currency)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-lg font-semibold text-gray-900">Grand Total:</span>
                      <span className="text-lg font-bold text-[#f29f67]">
                        {formatCurrency(invoice.grandTotal, invoice.currency)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Net Amount:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(invoice.netAmount, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInvoiceDetail;