const { GoogleGenerativeAI } = require('@google/generative-ai');
const Invoice = require('../models/Invoice');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Teks diperlukan' });
    }

    try {
        const prompt = `
            Anda adalah AI ahli dalam mengekstrak data faktur. Analisis teks berikut dan ekstrak detail faktur yang relevan dalam format JSON. 

            Output HARUS berupa objek JSON yang valid dengan kolom-kolom berikut:
            {
                "clientName": "string", 
                "email": "string (jika tersedia)", 
                "address": "string (jika tersedia)",
                "items": [
                    {
                        "name": "string", 
                        "quantity": "number",
                        "unitPrice": "number"
                    }
                ]
            }
            
            Berikut adalah teks untuk diurai: 
            --- MULAI TEKS ---
            ${text}
            --- AKHIR TEKS ---

            Ekstrak data dan berikan hanya output JSON, tanpa teks atau penjelasan tambahan.
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        if (typeof responseText !== 'string') {
            if (typeof response.text === 'function') {
                responseText = response.text(); 
            } else {
                throw new Error('Teks respons bukan string atau fungsi');
            }
        }

        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim(); 
        const parsedData = JSON.parse(cleanedJSON); 

        res.status(200).json(parsedData); 
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengurai faktur dengan AI', error:error.message });
    }
};

const generateReminderEmail = async (req, res) => {
    const { invoiceId } = req.body;

    if (!invoiceId) {
        return res.status(400).json({ message: 'ID Faktur diperlukan' }); 
    }
    
    try {
        const invoice = await Invoice.findById(invoiceId); 

        if (!invoice) {
            return res.status(404).json({ message: 'Faktur tidak ditemukan' }); 
        }

        const prompt = `
            Anda adalah asisten akuntansi yang profesional dan sopan. Tulis email pengingat yang ramah kepada klien tentang pembayaran faktur yang akan atau sudah jatuh tempo.

            Gunakan detail berikut untuk mempersonalisasi email: 
            - Nama Klien: ${invoice.billTo.clientName}
            - Nomor Faktur: ${invoice.invoiceNumber}
            - Jumlah Tagihan: ${invoice.total.toFixed(2)}
            - Tanggal Jatuh Tempo: ${new Date(invoice.dueDate).toLocaleDateString()}

            Nada email harus ramah dan jelas. Buatlah ringkas. Mulai email dengan "Subjek:", 
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        res.status(200).json({ reminderText: response.text });
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan saat membuat email pengingat dengan AI', error:error.message });
    }
}; 

const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }); 

        if (invoices.length === 0) {
            return res.status(200).json({ insights: 'Tidak ada faktur yang tersedia untuk diringkas.' });
        }

        // Proses dan ringkas data
        const totalInvoices = invoices.length; 
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid'); 
        const unpaidInvoices = invoices.filter(inv => inv.status === 'Unpaid');
        const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0); 
        const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + inv.total, 0); 

        const dataSummary = `
            - Jumlah Total Faktur: ${totalInvoices}
            - Total Faktur Lunas: ${paidInvoices.length}
            - Total Faktur Belum Lunas: ${unpaidInvoices.length}
            - Total Pendapatan dari Faktur Lunas: ${totalRevenue.toFixed(2)}
            - Total Tagihan Tertunggak dari Faktur Belum Lunas / Tertunda: ${totalOutstanding.toFixed(2)}
            - Faktur Terbaru (5 terakhir): ${invoices.slice(0, 5).map(inv => `Faktur #${inv.invoiceNumber} sebesar ${inv.total.toFixed(2)} dengan status ${inv.status}`).join('; ')}
        `;

        const prompt = `
            Anda adalah seorang analis keuangan yang ramah dan berwawasan luas untuk pemilik usaha kecil. 
            Berdasarkan ringkasan data faktur berikut, berikan 2 - 3 wawasan yang ringkas dan dapat ditindaklanjuti. 
            Setiap wawasan harus ada di dalam array JSON string. 
            Wawasan tersebut harus memberi semangat dan membantu. Jangan hanya mengulang data. 
            Sebagai contoh, jika ada jumlah tagihan yang belum dibayar tinggi, sarankan untuk mengirim pengingat. Jika pendapatan tinggi, berikan dorongan. 

            Ringkasan Data: 
            ${dataSummary}

            Kembalikan respons Anda sebagai Objek JSON yang valid dengan satu kunci "insights" yang merupakan array string. 
            Contoh Format: { "insights": ["Pendapatan Anda terlihat kuat bulan ini!", "Anda memiliki 5 faktur yang telah jatuh tempo. Pertimbangkan untuk mengirim pengingat agar dibayar lebih cepat" ]}
        `; 

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        }); 

        const responseText = response.text; 
        const cleanedData = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonData = JSON.parse(cleanedData);

        res.status(200).json({ insights: jsonData.insights });
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengurai Data Faktur dari teks', error:error.message });
    }
}; 

module.exports = {
    parseInvoiceFromText, 
    generateReminderEmail, 
    getDashboardSummary
}