// ========== Dashboard.jsx ==========
import { CircleDollarSign, DollarSign, FileText, Loader2, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Button from '../../components/ui/Button';
import moment from 'moment';
import AIInsightCard from '../../components/AIInsightCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
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
        setLoading(false)
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Faktur",
      value: stats.totalInvoices,
      color: "blue",
      trend: null
    },
    {
      icon: DollarSign,
      label: "Total Lunas",
      value: `Rp${stats.totalPaid.toLocaleString('id-ID')}`,
      color: "blue",
      trend: "+12%"
    },
    {
      icon: CircleDollarSign,
      label: "Total Belum Lunas",
      value: `Rp${stats.totalUnpaid.toLocaleString('id-ID')}`,
      color: "blue",
      trend: null
    }
  ];

  const colorClasses = {
    blue: { 
      bg: "bg-blue-50", 
      text: "text-blue-600",
      iconBg: "bg-blue-100"
    },
    emerald: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-600",
      iconBg: "bg-emerald-100"
    },
    gray: { 
      bg: "bg-gray-50", 
      text: "text-gray-700",
      iconBg: "bg-gray-100"
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm text-gray-500">Memuat dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Card - Improved */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`${colorClasses[stat.color].bg} p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex-shrink-0 w-12 h-12 ${
                  colorClasses[stat.color].iconBg
                } rounded-xl flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-6 h-6 ${colorClasses[stat.color].text}`}
                />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Card */}
      <AIInsightCard />

      {/* Recent Invoices - Improved */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className='text-lg font-semibold text-gray-800'>
              Faktur Terbaru
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              5 faktur terakhir yang dibuat
            </p>
          </div>
          <Button 
            variant='ghost' 
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Klien
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className='hover:bg-gray-50 cursor-pointer transition-colors'
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {invoice.billTo.clientName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {invoice.billTo.clientName}
                          </div>
                          <div className="text-xs text-gray-500">
                            #{invoice.invoiceNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rp{invoice.total.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'Lunas'
                            ? "bg-emerald-100 text-emerald-700"
                            : invoice.status === 'Menunggu'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 whitespace-nowrap'>
                      {moment(invoice.dueDate).format("D MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-6">
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gray-100 rounded-full mb-4">
              <FileText className='w-10 h-10 text-gray-400' />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Faktur
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Mulai kelola keuangan bisnis Anda dengan membuat faktur pertama
            </p>
            <Button 
              onClick={() => navigate('/invoices/new')} 
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Buat Faktur Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;