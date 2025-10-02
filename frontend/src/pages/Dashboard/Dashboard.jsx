import { CircleDollarSign, DollarSign, FileText, Loader2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Button from '../../components/ui/Button';
import moment from 'moment'; // <-- PASTIKAN ANDA MENGIMPOR MOMENT
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
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Paid")
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
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue"
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `$${stats.totalPaid.toFixed(2)}`,
      color: "emerald"
    },
    {
      icon: CircleDollarSign,
      label: "Total Unpaid",
      value: `$${stats.totalUnpaid.toFixed(2)}`,
      color: "red"
    }
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    red: { bg: "bg-red-100", text: "text-red-600" }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      
      {/* Stats Card */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 shadow-sm rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 ${
                  colorClasses[stat.color].bg
                } rounded-lg flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-6 h-6 ${colorClasses[stat.color].text}`}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  {stat.label}
                </div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Card */}
      <AIInsightCard />

      {/* Recent Invoices */}
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className='text-lg font-semibold text-gray-800'>
            Recent Invoices
          </h3>
          <Button variant='ghost' onClick={() => navigate('/invoices')}>
            View All
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Client</th>
                  <th scope="col" className="px-4 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-800">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'Paid'
                            ? "bg-emerald-100 text-emerald-600"
                            : invoice.status === 'Pending'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-gray-500 whitespace-nowrap'>
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full mb-4">
              <FileText className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              No Invoices Yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 mb-4">
              You haven't created any invoices yet.
            </p>
            <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;