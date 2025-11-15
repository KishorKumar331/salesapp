import { Platform } from 'react-native';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('₹', '₹');
};

// Helper function to format date
const getFormattedDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Generate HTML for the invoice
const generateInvoiceHtml = (invoiceData, isDomestic = true) => {
  const totalAmount = parseFloat(invoiceData?.InvoiceDetails?.TotalAmount || 0);
  const gst = parseFloat(invoiceData?.GST || 0);
  const tcs = isDomestic ? 0 : parseFloat(invoiceData?.TCS || 0);
  const grandTotal = totalAmount + gst + tcs;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${invoiceData?.TripId || ''}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .booking-confirmation {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }
        .header {
          background: #f2f8ff;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .logo img {
          height: 50px;
        }
        .header h1 {
          color: #245e8e;
          margin: 10px 0 0;
          font-size: 24px;
          text-align: right;
        }
        .booking-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 15px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .details p {
          margin: 5px 0;
          color: #333;
        }
        .gst-details {
          background: #cdf1f2;
          padding: 15px;
          border-radius: 8px;
          max-width: 300px;
        }
        .gst-details p {
          margin: 5px 0;
          font-size: 12px;
          color: #505050;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .grand-total {
          display: flex;
          justify-content: flex-end;
          margin: 20px 0;
        }
        .total-amount {
          width: 300px;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        .grand-total-row {
          font-weight: bold;
          font-size: 18px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          margin-top: 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .bank-details {
          margin-top: 20px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .bank-details h3 {
          margin-top: 0;
          color: #245e8e;
        }
        .qr-code {
          text-align: center;
          margin: 20px 0;
        }
        .qr-code img {
          max-width: 150px;
          height: auto;
        }
        .stamp {
          text-align: right;
          margin-top: 20px;
        }
        .stamp img {
          max-width: 150px;
          height: auto;
          opacity: 0.8;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="booking-confirmation">
        <header class="header">
          <div class="logo">
            <img src="https://journeyrouters.com/logo.png" alt="Journey Routers" />
          </div>
          <h1>INVOICE</h1>
        </header>

        <section class="booking-details">
          <div class="details">
            <p><strong>Invoice #:</strong> ${invoiceData?.TripId || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${invoiceData?.CustomerDetails?.Name || 'N/A'}</p>
            <p><strong>Email:</strong> ${invoiceData?.CustomerDetails?.Email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${invoiceData?.CustomerDetails?.Contact || 'N/A'}</p>
          </div>
          <div class="gst-details">
            <p><strong>Journey Routers Pvt. Ltd.</strong></p>
            <p>GST: 07AAGCJ5934M1Z3</p>
            <p>Khasra 275, 2nd Floor, Westend Marg, Saiduajlab,<br>
            Saiyad Ul Ajaib Extension, Saket,<br>
            New Delhi 110030</p>
          </div>
        </section>

        <h3>Payment Schedule</h3>
        <table>
          <thead>
            <tr>
              <th>Due Date</th>
              <th>Description</th>
              <th>Amount (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${(invoiceData?.Installments || []).map(installment => `
              <tr>
                <td>${getFormattedDate(installment.InstallmentDate)}</td>
                <td>Installment Payment</td>
                <td>${formatCurrency(installment.InstallmentAmount)}</td>
                <td>${installment.Status || 'Pending'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="grand-total">
          <div class="total-amount">
            <div class="total-row">
              <span>Package Amount:</span>
              <span>${formatCurrency(totalAmount)}</span>
            </div>
            <div class="total-row">
              <span>GST (5%):</span>
              <span>${formatCurrency(gst)}</span>
            </div>
            ${!isDomestic ? `
              <div class="total-row">
                <span>TCS (5%):</span>
                <span>${formatCurrency(tcs)}</span>
              </div>
            ` : ''}
            <div class="total-row grand-total-row">
              <span>Total Amount:</span>
              <span>${formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        <div class="bank-details">
          <h3>Bank Details</h3>
          <p><strong>Account Name:</strong> JR JOURNEY ROUTERS PVT LTD</p>
          <p><strong>Account Number:</strong> 50200105053921</p>
          <p><strong>Bank Name:</strong> HDFC Bank</p>
          <p><strong>Branch:</strong> Saket, New Delhi</p>
          <p><strong>IFSC Code:</strong> HDFC0000043</p>
          
          <div class="qr-code">
            <p>Scan & Pay</p>
            <img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/JR_QR.png" alt="Scan to Pay" />
          </div>
        </div>

        <div class="stamp">
          <img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/jrstamp.jpg" alt="Official Stamp" />
        </div>

        <div class="footer">
          <p>Thank you for choosing Journey Routers for your travel needs.</p>
          <p>For any queries, please contact us at sales@journeyrouters.com or call +91 99993 88977</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate and save PDF
const generateAndSavePdf = async (invoiceData, isDomestic = true) => {
  try {
    // Generate HTML
    const html = generateInvoiceHtml(invoiceData, isDomestic);
    
    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    
    // Generate a filename
    const filename = `Invoice_${invoiceData?.TripId || 'new'}_${new Date().getTime()}.pdf`;
    const newUri = `${FileSystem.documentDirectory}${filename}`;
    
    // Move the file to a permanent location
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });
    
    return { uri: newUri };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Share the PDF
const sharePdf = async (uri) => {
  try {
    await shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Invoice',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};

export { generateInvoiceHtml, generateAndSavePdf, sharePdf };
