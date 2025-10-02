import { useEffect, useState } from "react"
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Lightbulb } from "lucide-react";


const AIInsightCard = () => {
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // Simulasi loading
                await new Promise(resolve => setTimeout(resolve, 1500)); 

                const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
                // Contoh data jika API tidak mengembalikan apa-apa:
                const exampleInsights = [
                    "Anda memiliki 3 invoice yang akan jatuh tempo minggu ini.",
                    "Klien 'Tech Corp' adalah pembayar tercepat Anda bulan lalu.",
                    "Pendapatan bulan ini 15% lebih tinggi dari rata-rata."
                ];
                setInsights(response.data.insights || exampleInsights);
            } catch (error) {
                console.log('Failed to fetch AI Insights', error);
                setInsights([]); // Set ke array kosong jika ada error
            } finally {
                setIsLoading(false);
            }
        }

        fetchInsights();
    }, []);

    return (
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
            </div>
            {isLoading ? (
                // Skeleton Loader
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                </div>
            ) : insights.length > 0 ? (
                // Daftar Insight
                <ul className="space-y-2 list-disc list-inside text-sm text-gray-600">
                    {insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                    ))}
                </ul>
            ) : (
                // Tampilan Empty State
                <p className="text-sm text-gray-500 text-center py-4">
                    Tidak ada insight baru saat ini.
                </p>
            )}
        </div>
    )
}

export default AIInsightCard;