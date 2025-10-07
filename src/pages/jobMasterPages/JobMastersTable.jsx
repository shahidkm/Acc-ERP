import React, { useState, useMemo, useEffect } from 'react';
import { useGetJobMasters } from '../../hooks/jobMasterHooks/jobMasterHooks';
import {
  Search,
  AlertCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Calendar,
  User,
  Building,
  DollarSign,
  MapPin,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Truck,
  Plane,
  Ship,
  Archive,
  Users,
  Scale,
  Container,
  FileText,
  Target,
  TrendingUp,
  Navigation
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const JobMastersTable = () => {
  const { data: jobs, isLoading, error } = useGetJobMasters();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('jobId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [salesmanFilter, setSalesmanFilter] = useState('');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });

  const navigate = useNavigate();

  // Get job status
  const getJobStatus = (job) => {
    if (job.jobClosed) return 'closed';
    
    const today = new Date();
    const endDate = new Date(job.endDate);
    const startDate = new Date(job.startDate);
    
    if (today > endDate) return 'overdue';
    if (today >= startDate && today <= endDate) return 'active';
    if (today < startDate) return 'scheduled';
    
    return 'active';
  };

  const statusConfig = {
    'active': { 
      label: 'Active', 
      color: 'bg-orange-100 text-orange-800 border-orange-200', 
      icon: CheckCircle 
    },
    'scheduled': { 
      label: 'Scheduled', 
      color: 'bg-orange-50 text-orange-700 border-orange-200', 
      icon: Clock 
    },
    'overdue': { 
      label: 'Overdue', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    },
    'closed': { 
      label: 'Closed', 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: Archive 
    }
  };

  const filteredJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    let filtered = jobs.filter(job => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (
        job.jobCode?.toLowerCase().includes(search) ||
        job.jobName?.toLowerCase().includes(search) ||
        job.customer?.toLowerCase().includes(search) ||
        job.shipper?.toLowerCase().includes(search) ||
        job.consignee?.toLowerCase().includes(search) ||
        job.beNumber?.toLowerCase().includes(search) ||
        job.containerNumber?.toLowerCase().includes(search) ||
        job.mbL_MAWB?.toLowerCase().includes(search) ||
        job.hbL_HAWB?.toLowerCase().includes(search)
      );

      const matchesDate = !dateFilter || job.startDate?.startsWith(dateFilter);
      
      const status = getJobStatus(job);
      const matchesStatus = !statusFilter || status === statusFilter;
      
      const matchesCustomer = !customerFilter || job.customer === customerFilter;
      const matchesSalesman = !salesmanFilter || job.salesman === salesmanFilter;
      
      const minAmount = parseFloat(amountRange.min) || 0;
      const maxAmount = parseFloat(amountRange.max) || Infinity;
      const contractAmount = job.contractAmount || 0;
      const matchesAmount = contractAmount >= minAmount && contractAmount <= maxAmount;

      return matchesSearch && matchesDate && matchesStatus && matchesCustomer && matchesSalesman && matchesAmount;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date sorting
      if (sortField === 'startDate' || sortField === 'endDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (aVal instanceof Date) {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [jobs, searchTerm, sortField, sortDirection, dateFilter, statusFilter, customerFilter, salesmanFilter, amountRange]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    if (!jobs) return { total: 0, totalContract: 0, totalCost: 0, totalIncome: 0, active: 0, closed: 0, overdue: 0 };

    const total = jobs.length;
    const totalContract = jobs.reduce((sum, job) => sum + (job.contractAmount || 0), 0);
    const totalCost = jobs.reduce((sum, job) => sum + (job.openCost || 0), 0);
    const totalIncome = jobs.reduce((sum, job) => sum + (job.openIncome || 0), 0);
    const active = jobs.filter(job => getJobStatus(job) === 'active').length;
    const closed = jobs.filter(job => getJobStatus(job) === 'closed').length;
    const overdue = jobs.filter(job => getJobStatus(job) === 'overdue').length;

    return { total, totalContract, totalCost, totalIncome, active, closed, overdue };
  }, [jobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter, customerFilter, salesmanFilter, amountRange]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleCreateNew = () => {
    navigate('/create-job-master');
  };

  const handleView = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDelete = (jobId) => {
    console.log('Delete job:', jobId);
  };

  const formatCurrency = (amount) => {
    const number = parseFloat(amount) || 0;
    return `$${number.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatWeight = (weight) => {
    const number = parseFloat(weight) || 0;
    return `${number.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const uniqueCustomers = [...new Set(jobs?.map(job => job.customer).filter(Boolean))];
  const uniqueSalesmen = [...new Set(jobs?.map(job => job.salesman).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
          <span className="text-gray-600">Loading job masters...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6">
        <Sidebar />
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Job Masters</h3>
              <p className="text-red-700">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        
        {/* Header with Statistics */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#f29f67] rounded-xl shadow-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Job Masters
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage and track all logistics jobs and shipments</p>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mt-6">
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Total Jobs</div>
                    <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Contract Value</div>
                    <div className="text-lg font-bold text-[#f29f67]">{formatCurrency(stats.totalContract)}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Total Cost</div>
                    <div className="text-lg font-bold text-red-600">{formatCurrency(stats.totalCost)}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Total Income</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-[#f29f67]">Active</div>
                    <div className="text-lg font-bold text-[#f29f67]">{stats.active}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-gray-600">Closed</div>
                    <div className="text-lg font-bold text-gray-700">{stats.closed}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="text-sm text-red-600">Overdue</div>
                    <div className="text-lg font-bold text-red-700">{stats.overdue}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-orange-200 text-gray-700 font-medium rounded-xl hover:bg-orange-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:bg-[#e08d55] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search jobs, customers, codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="overdue">Overdue</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Customer Filter */}
              <div>
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value="">All Customers</option>
                  {uniqueCustomers.map(customer => (
                    <option key={customer} value={customer}>{customer}</option>
                  ))}
                </select>
              </div>

              {/* Salesman Filter */}
              <div>
                <select
                  value={salesmanFilter}
                  onChange={(e) => setSalesmanFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                >
                  <option value="">All Salesmen</option>
                  {uniqueSalesmen.map(salesman => (
                    <option key={salesman} value={salesman}>{salesman}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount Range */}
            <div className="mt-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Contract Amount Range:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Amount"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-32 px-3 py-2 border-2 border-orange-100 rounded-lg focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max Amount"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-32 px-3 py-2 border-2 border-orange-100 rounded-lg focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || dateFilter || statusFilter || customerFilter || salesmanFilter || amountRange.min || amountRange.max) && (
              <div className="mt-4 pt-4 border-t border-orange-100">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                    setStatusFilter('');
                    setCustomerFilter('');
                    setSalesmanFilter('');
                    setAmountRange({ min: '', max: '' });
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th 
                    onClick={() => handleSort('jobCode')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Job Code {getSortIcon('jobCode')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer & Details
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Routes & Transport
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Cargo Details
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('startDate')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Timeline {getSortIcon('startDate')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('contractAmount')} 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Financials {getSortIcon('contractAmount')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-50">
                {paginatedJobs.map((job, index) => {
                  const status = getJobStatus(job);
                  const statusInfo = statusConfig[status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr 
                      key={job.jobId} 
                      className={`hover:bg-orange-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'
                      }`}
                    >
                      {/* Job Code */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Briefcase className="h-4 w-4 text-[#f29f67]" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{job.jobCode}</div>
                            <div className="text-xs text-gray-500">ID: {job.jobId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Customer & Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{job.customer}</div>
                          <div className="text-gray-500 text-xs">{job.jobName}</div>
                          {job.salesman && (
                            <div className="text-[#f29f67] text-xs flex items-center gap-1 mt-1">
                              <Target className="h-3 w-3" />
                              {job.salesman}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Routes & Transport */}
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          {job.loadPort && job.dischargePort && (
                            <div className="text-gray-900 text-xs">
                              <span className="font-medium">{job.loadPort}</span> → <span className="font-medium">{job.dischargePort}</span>
                            </div>
                          )}
                          {job.flight_Vessel_Voyage && (
                            <div className="text-gray-600 text-xs flex items-center gap-1">
                              {job.flight_Vessel_Voyage.toLowerCase().includes('flight') ? 
                                <Plane className="h-3 w-3" /> : 
                                <Ship className="h-3 w-3" />
                              }
                              {job.flight_Vessel_Voyage}
                            </div>
                          )}
                          {(job.mbL_MAWB || job.hbL_HAWB) && (
                            <div className="text-xs text-[#f29f67]">
                              {job.mbL_MAWB && `MBL: ${job.mbL_MAWB}`}
                              {job.hbL_HAWB && ` HBL: ${job.hbL_HAWB}`}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Cargo Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          {job.noOfPieces > 0 && (
                            <div className="text-gray-900 text-xs flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {job.noOfPieces} pieces
                            </div>
                          )}
                          {job.grossWeight > 0 && (
                            <div className="text-gray-600 text-xs flex items-center gap-1">
                              <Scale className="h-3 w-3" />
                              {formatWeight(job.grossWeight)}
                            </div>
                          )}
                          {job.chargeableWeight > 0 && (
                            <div className="text-[#f29f67] text-xs">
                              Chg: {formatWeight(job.chargeableWeight)}
                            </div>
                          )}
                          {job.containerNumber && (
                            <div className="text-green-600 text-xs flex items-center gap-1">
                              <Container className="h-3 w-3" />
                              {job.containerNumber}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="text-gray-900 text-xs">
                            Start: {formatDate(job.startDate)}
                          </div>
                          <div className="text-gray-600 text-xs">
                            End: {formatDate(job.endDate)}
                          </div>
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="font-semibold text-gray-900 text-xs">
                            Contract: {formatCurrency(job.contractAmount)}
                          </div>
                          {job.openCost > 0 && (
                            <div className="text-red-600 text-xs">
                              Cost: {formatCurrency(job.openCost)}
                            </div>
                          )}
                          {job.openIncome > 0 && (
                            <div className="text-green-600 text-xs">
                              Income: {formatCurrency(job.openIncome)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(job.jobId)}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            title="View Job"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(job.jobId)}
                            className="inline-flex items-center px-3 py-1 bg-orange-100 text-[#f29f67] rounded-lg hover:bg-orange-200 transition-colors duration-200"
                            title="Edit Job"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.jobId)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete Job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedJobs.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-12 w-12 text-[#f29f67]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || dateFilter || statusFilter || customerFilter || salesmanFilter ? 
                  'No jobs match your current filters. Try adjusting your search criteria.' : 
                  'Get started by creating your first logistics job.'
                }
              </p>
              {!searchTerm && !dateFilter && !statusFilter && !customerFilter && !salesmanFilter && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:bg-[#e08d55] transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Job
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-4 border border-orange-100 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="text-sm border border-orange-200 rounded-lg px-2 py-1"
                >
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="inline-flex items-center px-3 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700 px-4 py-2 bg-orange-50 rounded-lg font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="inline-flex items-center px-3 py-2 border border-orange-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Panel */}
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-white rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#f29f67]" />
            Logistics Job Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67]">Comprehensive Tracking</p>
              <p className="text-gray-700 text-sm">
                Track all aspects of your logistics jobs from cargo details to financial performance across air, sea, and land transportation.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67]">Multi-Modal Support</p>
              <p className="text-gray-700 text-sm">
                Support for air freight (MAWB/HAWB), sea freight (MBL/HBL), container tracking, and various transportation modes.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67]">Financial Overview</p>
              <p className="text-gray-700 text-sm">
                Monitor contract values, costs, income, and profitability across all jobs with real-time financial tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMastersTable;