import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreatePurchaseReturnInvoice } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
import { useGetPurchaseInvoices } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
import { useGetVendors } from '../../hooks/vendorHooks/useGetVendors';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import { useGetInventoryUnits } from '../../hooks/inventoryHooks/useGetInventoryCategory';
// import { useGetStockAccounts } from '../../hooks/stockHooks/useGetStockAccounts';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  RotateCcw,
  Calendar,
  User,
  FileText,
  Hash,
  DollarSign,
  Plus,
  Trash2,
  Calculator,
  Globe,
  Percent,
  Building,
  Package,
  ChevronDown,
  Info,
  Edit,
  Archive,
  Truck
} from 'lucide-react';

const CreatePurchaseReturnInvoice = () => {
  const [formData, setFormData] = useState({
    purchaseInvoiceId: 0,
    referenceNo: '',
    date: new Date().toISOString().split('T')[0],
    stockAccountId: '',
    supplierId: '',
    documentType: '',
    documentId: '',
    purchaseOrderId: '',
    description: '',
    jobCodeId: '',
    foreignCurrency: false,
    currency: 'USD',
    currencyRate: '1.00',
    export: false,
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
  });

  const [purchaseReturnItems, setPurchaseReturnItems] = useState([
    {
      itemId: '',
      unitId: '',
      cost: 0,
      taxCode: '',
      taxIncluded: false,
      vatAmount: 0,
      total: 0
    }
  ]);

  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreatePurchaseReturnInvoice();
  const { data: purchaseInvoices, isLoading: invoicesLoading } = useGetPurchaseInvoices();
  const { data: stockAccounts, isLoading: stockAccountsLoading } = useGetAccountMasters();
  const { data: suppliers, isLoading: suppliersLoading } = useGetVendors();
  const { data: products, isLoading: productsLoading } = useGetAccountMasters();
  const { data: units, isLoading: unitsLoading } = useGetInventoryUnits();
  const { data: jobCodes, isLoading: jobCodesLoading } = useGetInventoryUnits();

  const documentTypes = [
    'Purchase Return',
    'Debit Note Return',
    'Supplier Credit Note',
    'Return Against Purchase',
    'Quality Return',
    'Damaged Goods Return'
  ];

  const currencies = [
    'USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR', 'JPY', 'CAD', 'AUD'
  ];

  const taxCodes = [
    { code: 'VAT_5', rate: 5, description: 'VAT 5%' },
    { code: 'VAT_15', rate: 15, description: 'VAT 15%' },
    { code: 'EXEMPT', rate: 0, description: 'VAT Exempt' },
    { code: 'ZERO_RATED', rate: 0, description: 'Zero Rated' }
  ];

  // Calculate totals when items change
  const calculatedTotals = useMemo(() => {
    let subtotal = 0;
    let totalVATAmount = 0;

    purchaseReturnItems.forEach(item => {
      const itemCost = parseFloat(item.cost) || 0;
      const itemSubtotal = itemCost;
      
      subtotal += itemSubtotal;
      
      if (item.taxCode) {
        const taxRate = taxCodes.find(tax => tax.code === item.taxCode)?.rate || 0;
        const vatAmount = item.taxIncluded 
          ? (itemSubtotal * taxRate) / (100 + taxRate)
          : (itemSubtotal * taxRate) / 100;
        totalVATAmount += vatAmount;
      }
    });

    const discount = parseFloat(formData.discount) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const grandTotal = afterDiscount + totalVATAmount;
    const netAmount = grandTotal;

    return {
      subtotal,
      totalVATAmount,
      grandTotal,
      netAmount
    };
  }, [purchaseReturnItems, formData.discount]);

  // Update form totals when calculated totals change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      subtotal: calculatedTotals.subtotal,
      totalVATAmount: calculatedTotals.totalVATAmount,
      grandTotal: calculatedTotals.grandTotal,
      netAmount: calculatedTotals.netAmount
    }));
  }, [calculatedTotals]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...purchaseReturnItems];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate item total when cost changes
    if (field === 'cost') {
      const cost = parseFloat(newItems[index].cost) || 0;
      newItems[index].total = cost;
    }

    // Calculate VAT amount when tax code or tax included changes
    if (field === 'taxCode' || field === 'taxIncluded' || field === 'cost') {
      const taxRate = taxCodes.find(tax => tax.code === newItems[index].taxCode)?.rate || 0;
      const itemTotal = newItems[index].total;
      
      if (newItems[index].taxIncluded) {
        newItems[index].vatAmount = (itemTotal * taxRate) / (100 + taxRate);
      } else {
        newItems[index].vatAmount = (itemTotal * taxRate) / 100;
      }
    }

    setPurchaseReturnItems(newItems);
  };

  const addItem = () => {
    setPurchaseReturnItems(prev => [
      ...prev,
      {
        itemId: '',
        unitId: '',
        cost: 0,
        taxCode: '',
        taxIncluded: false,
        vatAmount: 0,
        total: 0
      }
    ]);
  };

  const removeItem = (index) => {
    if (purchaseReturnItems.length > 1) {
      setPurchaseReturnItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      purchaseInvoiceId: parseInt(formData.purchaseInvoiceId) || 0,
      stockAccountId: parseInt(formData.stockAccountId),
      supplierId: parseInt(formData.supplierId),
      documentId: parseInt(formData.documentId) || 0,
      purchaseOrderId: parseInt(formData.purchaseOrderId) || 0,
      jobCodeId: parseInt(formData.jobCodeId) || 0,
      currencyRate: parseFloat(formData.currencyRate),
      grandTotal: parseFloat(formData.grandTotal),
      discount: parseFloat(formData.discount),
      subtotal: parseFloat(formData.subtotal),
      totalVATAmount: parseFloat(formData.totalVATAmount),
      netAmount: parseFloat(formData.netAmount),
      date: new Date(formData.date).toISOString(),
      purchaseReturnItems: purchaseReturnItems.map(item => ({
        ...item,
        itemId: parseInt(item.itemId),
        unitId: parseInt(item.unitId),
        cost: parseFloat(item.cost),
        vatAmount: parseFloat(item.vatAmount),
        total: parseFloat(item.total)
      }))
    };

    mutate(submitData, {
      onSuccess: () => {
        // navigate('/purchase-return-invoices');
      },
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency,
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6">
      <Sidebar />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/purchase-return-invoices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Return Invoices
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Purchase Return Invoice
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Create a return invoice for purchased items with tax calculations</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Return Invoice Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" />
                Return Invoice Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reference Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-red-500" />
                    Reference Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNo}
                    onChange={(e) => handleInputChange('referenceNo', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="RET-2025-001"
                  />
                </div>

                {/* Return Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    Return Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                  />
                </div>

                {/* Original Purchase Invoice */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    Original Purchase Invoice
                  </label>
                  <select
                    value={formData.purchaseInvoiceId}
                    onChange={(e) => handleInputChange('purchaseInvoiceId', e.target.value)}
                    disabled={invoicesLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select original invoice...</option>
                    {purchaseInvoices?.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.referenceNo} - {invoice.supplierName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Type */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="">Select document type...</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Account */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Archive className="h-4 w-4 text-red-500" />
                    Stock Account <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.stockAccountId}
                    onChange={(e) => handleInputChange('stockAccountId', e.target.value)}
                    required
                    disabled={stockAccountsLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select stock account...</option>
                    {stockAccounts?.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({account.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-red-500" />
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => handleInputChange('supplierId', e.target.value)}
                    required
                    disabled={suppliersLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select supplier...</option>
                    {suppliers?.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-red-500" />
                    Job Code
                  </label>
                  <select
                    value={formData.jobCodeId}
                    onChange={(e) => handleInputChange('jobCodeId', e.target.value)}
                    disabled={jobCodesLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select job code...</option>
                    {jobCodes?.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.code} - {job.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document ID */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-red-500" />
                    Document ID
                  </label>
                  <input
                    type="number"
                    value={formData.documentId}
                    onChange={(e) => handleInputChange('documentId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="0"
                  />
                </div>

                {/* Purchase Order ID */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-red-500" />
                    Purchase Order ID
                  </label>
                  <input
                    type="number"
                    value={formData.purchaseOrderId}
                    onChange={(e) => handleInputChange('purchaseOrderId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Edit className="h-4 w-4 text-red-500" />
                  Return Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                  placeholder="Enter reason for return or additional notes..."
                />
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-red-500" />
                Currency & Export Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Foreign Currency Toggle */}
                <div className="group">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.foreignCurrency}
                      onChange={(e) => handleInputChange('foreignCurrency', e.target.checked)}
                      className="w-5 h-5 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-sm font-semibold text-gray-800">Foreign Currency</span>
                  </label>
                </div>

                {/* Export Toggle */}
                <div className="group">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.export}
                      onChange={(e) => handleInputChange('export', e.target.checked)}
                      className="w-5 h-5 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Export Transaction
                    </span>
                  </label>
                </div>

                {/* Currency */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    disabled={!formData.foreignCurrency}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                {/* Currency Rate */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Currency Rate
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.currencyRate}
                    onChange={(e) => handleInputChange('currencyRate', e.target.value)}
                    disabled={!formData.foreignCurrency}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="1.0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Return Items */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-500" />
                  Return Items
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {purchaseReturnItems.map((item, index) => (
                  <div key={index} className="bg-red-50/50 rounded-xl p-6 border border-red-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Return Item #{index + 1}</h4>
                      {purchaseReturnItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {/* Item */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          required
                          disabled={productsLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                        >
                          <option value="">Select item...</option>
                          {products?.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          value={item.unitId}
                          onChange={(e) => handleItemChange(index, 'unitId', e.target.value)}
                          disabled={unitsLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                        >
                          <option value="">Select unit...</option>
                          {units?.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Cost */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Return Cost
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.cost}
                          onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>

                      {/* Tax Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Code
                        </label>
                        <select
                          value={item.taxCode}
                          onChange={(e) => handleItemChange(index, 'taxCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">No Tax</option>
                          {taxCodes.map((tax) => (
                            <option key={tax.code} value={tax.code}>
                              {tax.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Tax Included & Calculated Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-red-300">
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.taxIncluded}
                            onChange={(e) => handleItemChange(index, 'taxIncluded', e.target.checked)}
                            className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Tax Included</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          VAT Amount
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                          {formatCurrency(item.vatAmount)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-red-500" />
                Return Invoice Totals
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Discount */}
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-red-500" />
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(formData.subtotal)}</span>
                  </div>
                  
                  {formData.discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Discount ({formData.discount}%):</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency((formData.subtotal * formData.discount) / 100)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total VAT:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(formData.totalVATAmount)}</span>
                  </div>
                  
                  <div className="border-t border-red-300 pt-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-gray-900">Return Total:</span>
                      <span className="font-bold text-red-600">{formatCurrency(formData.grandTotal)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Net Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(formData.netAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Summary */}
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Return Invoice Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Reference</p>
                <p className="text-red-900">{formData.referenceNo || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Return Items</p>
                <p className="text-red-900">{purchaseReturnItems.length} item(s)</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Currency & Export</p>
                <p className="text-red-900">
                  {formData.currency} {formData.foreignCurrency ? `(Rate: ${formData.currencyRate})` : ''}
                  {formData.export && ' - Export'}
                </p>
              </div>
            </div>
            {formData.description && (
              <div className="mt-4 bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Return Reason</p>
                <p className="text-red-900 text-sm">{formData.description}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/purchase-return-invoices')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || purchaseReturnItems.length === 0}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Return Invoice...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Purchase Return Invoice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Status Messages */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Purchase return invoice has been created successfully.</p>
                  </div>
                </div>
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">{error?.message || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePurchaseReturnInvoice;