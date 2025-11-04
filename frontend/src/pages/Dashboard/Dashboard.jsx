import { FileText, Loader2, Plus, ArrowRight, TrendingUp, TrendingDown, Sparkles, Lightbulb } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Button from '../../components/ui/Button';
import moment from 'moment';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const invoices = response.data;

        const totalInvoices = invoices.length;
        const totalPaid = invoices
          .filter((inv) => inv.status === "Lunas")
          .reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Lunas")
          .reduce((acc, inv) => acc + inv.total, 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });
        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.log("Error details:", error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch AI Insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
        setInsights(response.data.insights || []);
      } catch (error) {
        console.log('Failed to fetch AI Insights', error);
        setInsights([]);
      } finally {
        setInsightsLoading(false);
      }
    };

    // Only fetch if we have invoices
    if (!loading && stats.totalInvoices > 0) {
      fetchInsights();
    } else if (!loading) {
      setInsightsLoading(false);
    }
  }, [loading, stats.totalInvoices]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsData = [
    {
      label: "Total Invoices",
      value: stats.totalInvoices,
      change: null,
      changeType: null,
      color: "blue"
    },
    {
      label: "Paid Amount",
      value: formatCurrency(stats.totalPaid),
      change: "+12.5%",
      changeType: "positive",
      color: "green"
    },
    {
      label: "Outstanding",
      value: formatCurrency(stats.totalUnpaid),
      change: stats.totalUnpaid > 0 ? "-8.2%" : null,
      changeType: stats.totalUnpaid > 0 ? "negative" : null,
      color: stats.totalUnpaid > 0 ? "red" : "gray"
    }
  ];

  const colorStyles = {
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600"
    },
    green: {
      border: "border-green-200",
      bg: "bg-green-50",
      text: "text-green-700",
      iconBg: "bg-green-100",
      iconText: "text-green-600"
    },
    red: {
      border: "border-red-200",
      bg: "bg-red-50",
      text: "text-red-700",
      iconBg: "bg-red-100",
      iconText: "text-red-600"
    },
    gray: {
      border: "border-slate-200",
      bg: "bg-slate-50",
      text: "text-slate-700",
      iconBg: "bg-slate-100",
      iconText: "text-slate-600"
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900 mb-4" />
        <p className="text-sm text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">Overview of your invoice activity</p>
        </div>
        <Button 
          onClick={() => navigate('/invoices/new')} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      {/* Info Banners */}
      {stats.totalInvoices > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Overdue Banner */}
          {recentInvoices.filter(inv => 
            moment(inv.dueDate).isBefore(moment()) && inv.status !== 'Lunas'
          ).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Overdue Invoices
                  </h3>
                  <p className="text-sm text-red-700">
                    You have {recentInvoices.filter(inv => 
                      moment(inv.dueDate).isBefore(moment()) && inv.status !== 'Lunas'
                    ).length} overdue invoice{recentInvoices.filter(inv => 
                      moment(inv.dueDate).isBefore(moment()) && inv.status !== 'Lunas'
                    ).length > 1 ? 's' : ''}. Follow up with clients to ensure timely payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {stats.totalPaid > 0 && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-900 mb-1">
                    Payment Received
                  </h3>
                  <p className="text-sm text-green-700">
                    Great! You've received {formatCurrency(stats.totalPaid)} in payments this period.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner - This Month */}
          {recentInvoices.filter(inv => 
            moment(inv.invoiceDate).isSame(moment(), 'month')
          ).length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    This Month's Activity
                  </h3>
                  <p className="text-sm text-blue-700">
                    You've created {recentInvoices.filter(inv => 
                      moment(inv.invoiceDate).isSame(moment(), 'month')
                    ).length} invoice{recentInvoices.filter(inv => 
                      moment(inv.invoiceDate).isSame(moment(), 'month')
                    ).length > 1 ? 's' : ''} this month.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => {
          const colors = colorStyles[stat.color];
          return (
            <div
              key={index}
              className={`bg-white border-2 ${colors.border} rounded-lg p-6 hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${colors.iconBg} p-3 rounded-lg`}>
                  <FileText className={`w-6 h-6 ${colors.iconText}`} />
                </div>
                {stat.change && (
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 ${colors.bg} rounded-full text-xs font-semibold ${colors.text}`}>
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Invoices Section */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
            <p className="text-sm text-slate-600 mt-0.5">Your 5 most recent invoices</p>
          </div>
          <button
            onClick={() => navigate('/invoices')}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/invoices/view/${invoice._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-xs text-slate-500">
                            {moment(invoice.invoiceDate).format("D MMM YYYY")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{invoice.billTo.clientName}</div>
                      <div className="text-xs text-slate-500">{invoice.billTo.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(invoice.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'Lunas'
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : invoice.status === 'Menunggu'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {moment(invoice.dueDate).format("D MMM YYYY")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No invoices yet
            </h3>
            <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
              Start managing your business finances by creating your first invoice
            </p>
            <Button 
              onClick={() => navigate('/invoices/new')} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Invoice
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">This Month</span>
              <span className="text-sm font-semibold text-slate-900">
                {recentInvoices.filter(inv => 
                  moment(inv.invoiceDate).isSame(moment(), 'month')
                ).length} invoices
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Overdue</span>
              <span className="text-sm font-semibold text-slate-900">
                {recentInvoices.filter(inv => 
                  moment(inv.dueDate).isBefore(moment()) && inv.status !== 'Lunas'
                ).length} invoices
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Avg. Invoice Value</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(stats.totalInvoices > 0 ? (stats.totalPaid + stats.totalUnpaid) / stats.totalInvoices : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/invoices/new')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
            >
              <span className="text-sm font-medium text-slate-900">Create Invoice</span>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/invoices')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
            >
              <span className="text-sm font-medium text-slate-900">View All Invoices</span>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
            >
              <span className="text-sm font-medium text-slate-900">Update Profile</span>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;