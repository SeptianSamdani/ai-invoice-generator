const { GoogleGenAI } = require('@google/genai');
const Invoice = require('../models/Invoice');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        const prompt = `
            You are an expert invoice data extraction AI. Analyze the following text and extract the relevant invoice details in JSON format. 

            The output MUST be a valid JSON object with the following fields:
            {
                "clientName": "string", 
                "email": "string (if avaliable)", 
                "address": "string (if avaliable)",
                "items": [
                    {
                        "name": "string", 
                        "quantity": "number",
                        "unitPrice": "number"
                    }
                ]
            }
            
            Here is the text to parse: 
            --- TEXT START ---
            ${text}
            --- TEXT END ---

            Extract the data and provide the JSON output only, without any additional text or explanation.
        `

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt, 
        }); 

        const responseText = response.text; 

        if (typeof responseText !== 'string') {
            
            if (typeof response.text === 'function') {
                responseText = response.text(); 
            } else {
                throw new Error('Response text is not a string or function');
            }
        }

        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim(); 

        const parsedData = JSON.parse(cleanedJSON); 

        res.status(200).json(parsedData); 
    } catch (error) {
        return res.status(500).json({ message: 'Error parsing invoice with AI', error:error.message });
    }
};

const generateReminderEmail = async (req, res) => {
    const { invoiceId } = req.body; 

    if (!invoiceId) {
        return res.status(400).json({ message: 'Invoice ID is required' }); 
    }
    
    try {
        const invoice = await Invoice.findById(invoiceId); 

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' }); 
        }

        const prompt = `
            You are a professional and polite accounting assistant. Write a friendly reminder email to a client about an overdue or upcoming invoice payment. 

            Use the following details to personalize the email: 
            - Client Name: ${invoice.billTo.clientName}
            - Invoice Number: ${invoice.invoiceNumber}
            - Amount Due: ${invoice.total.toFixed(2)}
            - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

            The tone should be friendly and clear. Keep it concise. Start the email with "Subject:", 
        `

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt, 
        }); 

        res.status(200).json({ reminderText: response.text }); 
    } catch (error) {
        return res.status(500).json({ message: 'Error generating reminder email with AI', error:error.message });
    }
}; 

const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }); 

        if (invoices.length === 0) {
            return res.status(200).json({ insights: 'No invoices available to summarize.' });
        }

        // Process and summarize data 
        const totalInvoices = invoices.length; 
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid'); 
        const unpaidInvoices = invoices.filter(inv => inv.status === 'Unpaid');
        const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0); 
        const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + inv.total, 0); 

        const dataSummary = `
            - Total Number of Invoices: ${totalInvoices}
            - Total Paid Invoices: ${paidInvoices.length}
            - Total Unpaid Invoices: ${unpaidInvoices.length}
            - Total Revenue from Paid Invoices: ${totalRevenue.toFixed(2)}
            - Total Outstanding Amount from Unpaid / Pending Invoices: ${totalOutstanding.toFixed(2)}
            - Recent Invoices (last 5): ${invoices.slice(0, 5).map(inv => `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`).join('; ')}
        `

        const prompt = `
            You are a friendly and insightful financial analyst for small businesses owner. 
            Based on the following summary of their invoice data, provide 2 - 3 concise and actionable insights. 
            Each insight should be a short string JSON array. 
            The insights should be encouraging and helpful. Do not just repeat the data. 
            For example, if there is a high outstanding amount, suggest sending reminders. If revenue is high, be encouraging. 

            Data Summary: 
            ${dataSummary}

            Return your response as a valid JSON Object with a single key "insights" which is an array of strings. 
            Example Format: { "insights": ["Your revenue is looking strong this month!", "You have 5 overdue invoices. Consider sending reminder to get paid faster" ]}
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
        return res.status(500).json({ message: 'Error to parse Invoice Data from text', error:error.message });
    }
}; 

module.exports = {
    parseInvoiceFromText, 
    generateReminderEmail, 
    getDashboardSummary
}