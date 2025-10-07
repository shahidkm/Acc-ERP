import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateSalesInvoice } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import { useGetCustomers } from '../../hooks/customerHooks/useGetCustomers';
import { useGetProducts } from '../../hooks/productHooks/useGetProducts';
import { useGetInventoryUnits } from '../../hooks/inventoryHooks/useGetInventoryCategory';
// import { useGetJobCodes } from '../../hooks/jobHooks/useGetJobCodes';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Receipt,
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
  ShoppingCart
} from 'lucide-react';

const CreateSalesInvoice = () => {
  const [formData, setFormData] = useState({
    voucherNo: '',
    voucherDate: new Date().toISOString().split('T')[0],
    referenceNo: '',
    remarks: '',
    createdBy: '',
    documentType: '',
    documentId: '',
    salesOrderId: '',
    days: 0,
    dueDate: '',
    jobCodeId: '',
    foreignCurrency: false,
    currency: 'USD',
    currencyRate: '1.00',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
  });

  const [journalLines, setJournalLines] = useState([
    {
      accountMasterId: '',
      entryType: 'Dr',
      amount: 0,
      description: '',
      reference: '',
      jobCode: '',
      costCenterCode: '',
      bankName: '',
      chequeNo: '',
      chequeDate: '',
      partyName: '',
      saleItems: []
    }
  ]);

  const [saleItems, setSaleItems] = useState([
    {
      saleInvoiceId: 0,
      itemId: '',
      unitId: '',
      quantity: 1,
      price: 0,
      taxCode: '',
      taxIncluded: false,
      vatAmount: 0,
      total: 0
    }
  ]);

  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateSalesInvoice();
  const { data: accountMasters, isLoading: accountsLoading } = useGetAccountMasters();
  const { data: customers, isLoading: customersLoading } = useGetCustomers();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: units, isLoading: unitsLoading } = useGetInventoryUnits();
  const { data: jobCodes, isLoading: jobCodesLoading } = useGetInventoryUnits();

  const documentTypes = [
    'Standard Invoice',
    'Pro Forma Invoice',
    'Commercial Invoice',
    'Tax Invoice',
    'Debit Note',
    'Credit Note'
  ];

  const currencies = [
    'USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR', 'JPY', 'CAD', 'AUD'
  ];

  const entryTypes = ['Dr', 'Cr'];

  const taxCodes = [
    { code: 'VAT_5', rate: 5, description: 'VAT 5%' },
    { code: 'VAT_15', rate: 15, description: 'VAT 15%' },
    { code: 'EXEMPT', rate: 0, description: 'VAT Exempt' },
    { code: 'ZERO_RATED', rate: 0, description: 'Zero Rated' }
  ];

  // Calculate due date when days change
  useEffect(() => {
    if (formData.voucherDate && formData.days > 0) {
      const invoiceDate = new Date(formData.voucherDate);
      const dueDate = new Date(invoiceDate.getTime() + (formData.days * 24 * 60 * 60 * 1000));
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.voucherDate, formData.days]);

  // Calculate totals when items change
  const calculatedTotals = useMemo(() => {
    let subtotal = 0;
    let totalVATAmount = 0;

    saleItems.forEach(item => {
      const itemPrice = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const itemSubtotal = itemPrice * quantity;
      
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
  }, [saleItems, formData.discount]);

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

  const handleJournalLineChange = (index, field, value) => {
    const newLines = [...journalLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setJournalLines(newLines);
  };

  const addJournalLine = () => {
    setJournalLines(prev => [
      ...prev,
      {
        accountMasterId: '',
        entryType: 'Dr',
        amount: 0,
        description: '',
        reference: '',
        jobCode: '',
        costCenterCode: '',
        bankName: '',
        chequeNo: '',
        chequeDate: '',
        partyName: '',
        saleItems: []
      }
    ]);
  };

  const removeJournalLine = (index) => {
    if (journalLines.length > 1) {
      setJournalLines(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...saleItems];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate item total when price or quantity changes
    if (field === 'price' || field === 'quantity') {
      const price = parseFloat(newItems[index].price) || 0;
      const quantity = parseFloat(newItems[index].quantity) || 1;
      newItems[index].total = price * quantity;
    }

    // Calculate VAT amount when tax code or tax included changes
    if (field === 'taxCode' || field === 'taxIncluded' || field === 'price' || field === 'quantity') {
      const taxRate = taxCodes.find(tax => tax.code === newItems[index].taxCode)?.rate || 0;
      const itemTotal = newItems[index].total;
      
      if (newItems[index].taxIncluded) {
        newItems[index].vatAmount = (itemTotal * taxRate) / (100 + taxRate);
      } else {
        newItems[index].vatAmount = (itemTotal * taxRate) / 100;
      }
    }

    setSaleItems(newItems);
  };

  const addItem = () => {
    setSaleItems(prev => [
      ...prev,
      {
        saleInvoiceId: 0,
        itemId: '',
        unitId: '',
        quantity: 1,
        price: 0,
        taxCode: '',
        taxIncluded: false,
        vatAmount: 0,
        total: 0
      }
    ]);
  };

  const removeItem = (index) => {
    if (saleItems.length > 1) {
      setSaleItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the first journal line to include sale items
    const updatedJournalLines = [...journalLines];
    if (updatedJournalLines.length > 0) {
      updatedJournalLines[0].saleItems = saleItems.map(item => ({
        saleInvoiceId: parseInt(item.saleInvoiceId) || 0,
        itemId: parseInt(item.itemId),
        unitId: parseInt(item.unitId),
        price: parseFloat(item.price),
        taxCode: item.taxCode,
        taxIncluded: item.taxIncluded,
        vatAmount: parseFloat(item.vatAmount),
        total: parseFloat(item.total)
      }));
    }

    const submitData = {
      voucherNo: formData.voucherNo,
      voucherDate: new Date(formData.voucherDate).toISOString(),
      referenceNo: formData.referenceNo,
      remarks: formData.remarks,
      createdBy: formData.createdBy,
      documentType: formData.documentType,
      documentId: parseInt(formData.documentId) || 0,
      salesOrderId: parseInt(formData.salesOrderId) || 0,
      days: parseInt(formData.days),
      dueDate: new Date(formData.dueDate).toISOString(),
      jobCodeId: parseInt(formData.jobCodeId) || 0,
      foreignCurrency: formData.foreignCurrency,
      currency: formData.currency,
      currencyRate: formData.currencyRate,
      grandTotal: parseFloat(formData.grandTotal),
      discount: parseFloat(formData.discount),
      subtotal: parseFloat(formData.subtotal),
      totalVATAmount: parseFloat(formData.totalVATAmount),
      netAmount: parseFloat(formData.netAmount),
      lines: updatedJournalLines.map(line => ({
        accountMasterId: parseInt(line.accountMasterId),
        entryType: line.entryType,
        amount: parseFloat(line.amount),
        description: line.description,
        reference: line.reference,
        jobCode: line.jobCode,
        costCenterCode: line.costCenterCode,
        bankName: line.bankName,
        chequeNo: line.chequeNo,
        chequeDate: line.chequeDate ? new Date(line.chequeDate).toISOString() : null,
        partyName: line.partyName,
        saleItems: line.saleItems
      }))
    };

    mutate(submitData, {
      onSuccess: () => {
        // navigate('/sales-invoices');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/sales-invoices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Invoices
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Sales Invoice
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Create a new sales invoice with items and tax calculations</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Invoice Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Invoice Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Voucher Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-green-500" />
                    Voucher Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.voucherNo}
                    onChange={(e) => handleInputChange('voucherNo', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="SVH-2025-001"
                  />
                </div>

                {/* Reference Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-green-500" />
                    Reference Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNo}
                    onChange={(e) => handleInputChange('referenceNo', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="SINV-2025-001"
                  />
                </div>

                {/* Voucher Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Voucher Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.voucherDate}
                    onChange={(e) => handleInputChange('voucherDate', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  />
                </div>

                {/* Created By */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-green-500" />
                    Created By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    onChange={(e) => handleInputChange('createdBy', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter creator name"
                  />
                </div>

                {/* Document Type */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  >
                    <option value="">Select document type...</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Job Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-green-500" />
                    Job Code
                  </label>
                  <select
                    value={formData.jobCodeId}
                    onChange={(e) => handleInputChange('jobCodeId', e.target.value)}
                    disabled={jobCodesLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select job code...</option>
                    {jobCodes?.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.code} - {job.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sales Order ID */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-green-500" />
                    Sales Order ID
                  </label>
                  <input
                    type="number"
                    value={formData.salesOrderId}
                    onChange={(e) => handleInputChange('salesOrderId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter sales order ID"
                  />
                </div>

                {/* Document ID */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    Document ID
                  </label>
                  <input
                    type="number"
                    value={formData.documentId}
                    onChange={(e) => handleInputChange('documentId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter document ID"
                  />
                </div>

                {/* Remarks - Full Width */}
                <div className="group lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter any additional remarks or notes..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Payment Terms
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment Days */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Payment Days
                  </label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => handleInputChange('days', e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="0"
                  />
                </div>

                {/* Due Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Currency Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Foreign Currency Toggle */}
                <div className="group">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.foreignCurrency}
                      onChange={(e) => handleInputChange('foreignCurrency', e.target.checked)}
                      className="w-5 h-5 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-sm font-semibold text-gray-800">Foreign Currency</span>
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
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
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
                    type="text"
                    value={formData.currencyRate}
                    onChange={(e) => handleInputChange('currencyRate', e.target.value)}
                    disabled={!formData.foreignCurrency}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="1.0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Journal Lines */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Journal Lines
                </h3>
                <button
                  type="button"
                  onClick={addJournalLine}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </button>
              </div>

              <div className="space-y-4">
                {journalLines.map((line, index) => (
                  <div key={index} className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Line #{index + 1}</h4>
                      {journalLines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeJournalLine(index)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Account Master */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Master <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={line.accountMasterId}
                          onChange={(e) => handleJournalLineChange(index, 'accountMasterId', e.target.value)}
                          required
                          disabled={accountsLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                        >
                          <option value="">Select account...</option>
                          {accountMasters?.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.accountMasterName} ({account.accountId})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Entry Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Entry Type
                        </label>
                        <select
                          value={line.entryType}
                          onChange={(e) => handleJournalLineChange(index, 'entryType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          {entryTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.amount}
                          onChange={(e) => handleJournalLineChange(index, 'amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => handleJournalLineChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter description..."
                        />
                      </div>

                      {/* Reference */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reference
                        </label>
                        <input
                          type="text"
                          value={line.reference}
                          onChange={(e) => handleJournalLineChange(index, 'reference', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter reference..."
                        />
                      </div>

                      {/* Job Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Code
                        </label>
                        <input
                          type="text"
                          value={line.jobCode}
                          onChange={(e) => handleJournalLineChange(index, 'jobCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter job code..."
                        />
                      </div>

                      {/* Cost Center Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost Center Code
                        </label>
                        <input
                          type="text"
                          value={line.costCenterCode}
                          onChange={(e) => handleJournalLineChange(index, 'costCenterCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter cost center code..."
                        />
                      </div>

                      {/* Party Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Party Name
                        </label>
                        <input
                          type="text"
                          value={line.partyName}
                          onChange={(e) => handleJournalLineChange(index, 'partyName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter party name..."
                        />
                      </div>
                    </div>

                    {/* Banking Details (Optional) */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Banking Details (Optional)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={line.bankName}
                            onChange={(e) => handleJournalLineChange(index, 'bankName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter bank name..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cheque Number
                          </label>
                          <input
                            type="text"
                            value={line.chequeNo}
                            onChange={(e) => handleJournalLineChange(index, 'chequeNo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter cheque number..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cheque Date
                          </label>
                          <input
                            type="date"
                            value={line.chequeDate}
                            onChange={(e) => handleJournalLineChange(index, 'chequeDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sale Items */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  Sale Items
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {saleItems.map((item, index) => (
                  <div key={index} className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
                      {saleItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {/* Product */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          required
                          disabled={productsLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                        >
                          <option value="">Select product...</option>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                        >
                          <option value="">Select unit...</option>
                          {units?.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-300">
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.taxIncluded}
                            onChange={(e) => handleItemChange(index, 'taxIncluded', e.target.checked)}
                            className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
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
                <Calculator className="h-5 w-5 text-green-500" />
                Invoice Totals
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Discount */}
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-green-500" />
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(formData.subtotal)}</span>
                  </div>
                  
                  {formData.discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Discount ({formData.discount}%):</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency((formData.subtotal * formData.discount) / 100)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total VAT:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(formData.totalVATAmount)}</span>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-gray-900">Grand Total:</span>
                      <span className="font-bold text-green-600">{formatCurrency(formData.grandTotal)}</span>
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Invoice Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">Voucher No.</p>
                <p className="text-green-900">{formData.voucherNo || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">Reference</p>
                <p className="text-green-900">{formData.referenceNo || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">Items Count</p>
                <p className="text-green-900">{saleItems.length} item(s)</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">Journal Lines</p>
                <p className="text-green-900">{journalLines.length} line(s)</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/sales-invoices')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || saleItems.length === 0}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Invoice...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Sales Invoice
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
                    <p className="text-sm">Sales invoice has been created successfully.</p>
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

export default CreateSalesInvoice;