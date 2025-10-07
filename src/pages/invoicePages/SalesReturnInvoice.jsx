import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateVoucher } from '../../../src/hooks/voucherHooks/useCreateVoucher';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import { useGetCustomers } from '../../hooks/customerHooks/useGetCustomers';
import { useGetProducts } from '../../hooks/productHooks/useGetProducts';
import { useGetInventoryUnits } from '../../hooks/inventoryHooks/useGetInventoryCategory';
import { useGetSalesInvoices } from '../../hooks/invoiceHooks.jsx/invoiceHooks';
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
  Plus,
  Trash2,
  Calculator,
  Globe,
  Percent,
  Package,
  Info,
  RotateCcw
} from 'lucide-react';

const CreateSalesReturn = () => {
  const [formData, setFormData] = useState({
    voucherNo: '',
    voucherDate: new Date().toISOString().split('T')[0],
    referenceNo: '',
    remarks: '',
    createdBy: '',
    documentType: '',
    documentId: '',
    salesId: '',
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
      entryType: 'Cr',
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

  const [returnItems, setReturnItems] = useState([
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
  const { mutate, isPending, isSuccess, isError, error } = useCreateVoucher();
  const { data: accountMasters, isLoading: accountsLoading } = useGetAccountMasters();
  const { data: customers, isLoading: customersLoading } = useGetCustomers();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: units, isLoading: unitsLoading } = useGetInventoryUnits();
  const { data: salesInvoices, isLoading: salesInvoicesLoading } = useGetSalesInvoices();
  const { data: jobCodes, isLoading: jobCodesLoading } = useGetInventoryUnits();

  const documentTypes = [
    'Sales Return',
    'Credit Note',
    'Return Invoice',
    'Refund Invoice',
    'Goods Return',
    'Defective Return'
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

  useEffect(() => {
    if (formData.voucherDate && formData.days > 0) {
      const returnDate = new Date(formData.voucherDate);
      const dueDate = new Date(returnDate.getTime() + (formData.days * 24 * 60 * 60 * 1000));
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.voucherDate, formData.days]);

  const calculatedTotals = useMemo(() => {
    let subtotal = 0;
    let totalVATAmount = 0;

    returnItems.forEach(item => {
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
  }, [returnItems, formData.discount]);

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
        entryType: 'Cr',
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
    const newItems = [...returnItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'price' || field === 'quantity') {
      const price = parseFloat(newItems[index].price) || 0;
      const quantity = parseFloat(newItems[index].quantity) || 1;
      newItems[index].total = price * quantity;
    }

    if (field === 'taxCode' || field === 'taxIncluded' || field === 'price' || field === 'quantity') {
      const taxRate = taxCodes.find(tax => tax.code === newItems[index].taxCode)?.rate || 0;
      const itemTotal = newItems[index].total;
      
      if (newItems[index].taxIncluded) {
        newItems[index].vatAmount = (itemTotal * taxRate) / (100 + taxRate);
      } else {
        newItems[index].vatAmount = (itemTotal * taxRate) / 100;
      }
    }

    setReturnItems(newItems);
  };

  const addItem = () => {
    setReturnItems(prev => [
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
    if (returnItems.length > 1) {
      setReturnItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedJournalLines = [...journalLines];
    if (updatedJournalLines.length > 0) {
      updatedJournalLines[0].saleItems = returnItems.map(item => ({
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
      salesId: parseInt(formData.salesId) || 0,
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
        // navigate('/sales-returns');
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
        <div className="mb-8">
          <button
            onClick={() => navigate('/sales-returns')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Returns
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Sales Return
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Process a return for previously sold items with tax adjustments</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" />
                Return Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-red-500" />
                    Voucher Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.voucherNo}
                    onChange={(e) => handleInputChange('voucherNo', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="SRV-2025-001"
                  />
                </div>

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
                    placeholder="SRET-2025-001"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    Return Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.voucherDate}
                    onChange={(e) => handleInputChange('voucherDate', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-red-500" />
                    Created By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    onChange={(e) => handleInputChange('createdBy', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter creator name"
                  />
                </div>

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

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-red-500" />
                    Original Sales Invoice <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.salesId}
                    onChange={(e) => handleInputChange('salesId', e.target.value)}
                    disabled={salesInvoicesLoading}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select original sales invoice...</option>
                    {salesInvoices?.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.voucherNo} - {invoice.referenceNo}
                      </option>
                    ))}
                  </select>
                </div>

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

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    Document ID
                  </label>
                  <input
                    type="number"
                    value={formData.documentId}
                    onChange={(e) => handleInputChange('documentId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter document ID"
                  />
                </div>

                <div className="group lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    Return Reason & Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter reason for return and any additional remarks..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-500" />
                Refund Terms
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Refund Processing Days
                  </label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => handleInputChange('days', e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                    placeholder="0"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Refund Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-red-500" />
                Currency Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Currency Rate
                  </label>
                  <input
                    type="text"
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

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  Journal Lines
                </h3>
                <button
                  type="button"
                  onClick={addJournalLine}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Master <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={line.accountMasterId}
                          onChange={(e) => handleJournalLineChange(index, 'accountMasterId', e.target.value)}
                          required
                          disabled={accountsLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                        >
                          <option value="">Select account...</option>
                          {accountMasters?.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.accountMasterName} ({account.accountId})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Entry Type
                        </label>
                        <select
                          value={line.entryType}
                          onChange={(e) => handleJournalLineChange(index, 'entryType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          {entryTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => handleJournalLineChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter description..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reference
                        </label>
                        <input
                          type="text"
                          value={line.reference}
                          onChange={(e) => handleJournalLineChange(index, 'reference', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter reference..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Code
                        </label>
                        <input
                          type="text"
                          value={line.jobCode}
                          onChange={(e) => handleJournalLineChange(index, 'jobCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter job code..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost Center Code
                        </label>
                        <input
                          type="text"
                          value={line.costCenterCode}
                          onChange={(e) => handleJournalLineChange(index, 'costCenterCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter cost center code..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Party Name
                        </label>
                        <input
                          type="text"
                          value={line.partyName}
                          onChange={(e) => handleJournalLineChange(index, 'partyName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter party name..."
                        />
                      </div>
                    </div>

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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                {returnItems.map((item, index) => (
                  <div key={index} className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
                      {returnItems.length > 1 && (
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
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          required
                          disabled={productsLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                        >
                          <option value="">Select product...</option>
                          {products?.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.code})
                            </option>
                          ))}
                        </select>
                      </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-300">
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

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-red-500" />
                Return Totals
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <span className="font-semibold text-gray-900">Grand Total:</span>
                      <span className="font-bold text-red-600">{formatCurrency(formData.grandTotal)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Net Refund Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(formData.netAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Return Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Voucher No.</p>
                <p className="text-red-900">{formData.voucherNo || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Reference</p>
                <p className="text-red-900">{formData.referenceNo || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Return Items</p>
                <p className="text-red-900">{returnItems.length} item(s)</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Journal Lines</p>
                <p className="text-red-900">{journalLines.length} line(s)</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/sales-returns')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || returnItems.length === 0}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Processing Return...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Sales Return
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Sales return has been created successfully.</p>
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

export default CreateSalesReturn;