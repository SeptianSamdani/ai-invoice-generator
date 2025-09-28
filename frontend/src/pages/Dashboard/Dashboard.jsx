import { CircleDollarSign, DollarSign, FileText, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; 
import { API_PATHS } from '../../utils/apiPaths';
import Button from '../../components/ui/Button';


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0, 
    totalPaid: 0, 
    totalUnpaid: 0
  }); 
  const [recentInvoices, setRecentInvoices] = useState([]); 
  const  [loading, setLoading] = useState(true); 
  const  navigate = useNavigate(); 

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
            .sort((a, b) => new Date(b.invoicesDate) - new Date(a.invoicesDate))
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
      value: `${stats.totalPaid.toFixed(2)}`, 
      color: "emerald"
    },
    {
      icon: CircleDollarSign, 
      label: "Total Unpaid", 
      value: `${stats.totalUnpaid.toFixed(2)}`, 
      color: "red"
    }
  ]; 

  const colorClasses = {
    blue: { bg: "bg-blue-200", text: "text-blue-600" }, 
    emerald: { bg: "bg-emerald-200", text: "text-emerald-600"}, 
    red: { bg: "bg-red-200", text: "text-red-600"}
  }; 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="">
      <div className="">
        <h2 className="">Dashboard</h2>
        <p className="">
          A quick overview of your business finance. 
        </p>
      </div>

      {/* Stats Card */}
      <div className="">
        {statsData.map((stat, index) => (
          <div 
            key={index}
            className=""
          >
            <div className="">
              <div 
                className={`flex-shrink-0 w-12 h-12 ${
                  colorClasses[stat.color].bg
                } rounded-lg flex items-center justify-center`}
              >
                <stat.icon 
                  className={`w-6 h-6 ${colorClasses[stat.color].text}`}
                />
              </div>
              <div className="">
                <div className="">
                  {stat.label}
                </div>
                <div className="">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Card */}

      {/* Recent Invoices */}
      <div className="">
        <div className="">
          <h3 className=''>
            Recent Invoices
          </h3>
          <Button variant='ghost' onClick={() => navigate('/invoices')}>
            View All
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
            
          )
        }
      </div>
    </div>
  )
}

export default Dashboard
