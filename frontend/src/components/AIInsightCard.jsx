import { useEffect, useState } from "react"
import { Lightbulb, Sparkles } from "lucide-react";

const AIInsightCard = () => {
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); 

                // const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
                
                const exampleInsights = [
                    "Anda memiliki 3 invoice yang akan jatuh tempo minggu ini",
                    "Tech Corp adalah pembayar tercepat bulan lalu",
                    "Pendapatan bulan ini 15% lebih tinggi dari rata-rata"
                ];
                setInsights(exampleInsights);
            } catch (error) {
                console.log('Failed to fetch AI Insights', error);
                setInsights([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchInsights();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
                    <p className="text-xs text-gray-500">Ringkasan cerdas untuk bisnis Anda</p>
                </div>
            </div>

            {isLoading ? (
                // Skeleton Loader
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg animate-pulse">
                            <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0 mt-1.5"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-full"></div>
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : insights.length > 0 ? (
                // Insight List
                <div className="space-y-3">
                    {insights.map((insight, index) => (
                        <div 
                            key={index}
                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></div>
                            <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                {insight}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="text-center py-8 px-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full mb-3">
                        <Lightbulb className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                        Belum ada insight
                    </p>
                    <p className="text-xs text-gray-500">
                        AI akan menganalisis data Anda segera
                    </p>
                </div>
            )}
        </div>
    )
}

export default AIInsightCard;