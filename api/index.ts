import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// --- Mpesa Helpers ---
const getMpesaBaseUrl = () => {
  return process.env.MPESA_ENV === "production" 
    ? "https://api.safaricom.co.ke" 
    : "https://sandbox.safaricom.co.ke";
};

const getAccessToken = async () => {
  const consumerKey = (process.env.MPESA_CONSUMER_KEY || "").trim().replace(/^["']|["']$/g, '');
  const consumerSecret = (process.env.MPESA_CONSUMER_SECRET || "").trim().replace(/^["']|["']$/g, '');
  
  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing Mpesa Consumer Key or Secret");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const baseUrl = getMpesaBaseUrl();
  
  try {
    const response = await axios.get(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error("Error getting Mpesa access token:", error.response?.data || error.message);
    throw error;
  }
};

// --- API Routes ---
app.post("/api/stk-push", async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    
    const accessToken = await getAccessToken();
    const shortcode = (process.env.MPESA_SHORTCODE || "174379").trim().replace(/^["']|["']$/g, '');
    const passkey = (process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919").trim().replace(/^["']|["']$/g, '');
    const callbackUrl = (process.env.MPESA_CALLBACK_URL || "https://example.com/api/callback").trim().replace(/^["']|["']$/g, '');
    const transactionType = (process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline").trim().replace(/^["']|["']$/g, '');
    const partyB = (process.env.MPESA_PARTY_B || shortcode).trim().replace(/^["']|["']$/g, '');
    const baseUrl = getMpesaBaseUrl();

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Format phone number to 2547XXXXXXXX
    let formattedPhone = phoneNumber.replace(/\D/g, ''); // Keep only digits
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (formattedPhone.length === 9 && (formattedPhone.startsWith('7') || formattedPhone.startsWith('1'))) {
      formattedPhone = '254' + formattedPhone;
    }

    console.log(`Initiating STK Push (${transactionType}) for ${formattedPhone} of amount ${amount} to ${shortcode} (PartyB: ${partyB})`);

    const response = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: transactionType,
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: partyB,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: "NyotaLoan",
        TransactionDesc: "Loan Processing Fee",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    const errorDetails = error.response?.data || error.message;
    console.error("STK Push error response:", JSON.stringify(errorDetails, null, 2));
    
    let friendlyMessage = "Transaction failed. Please check your credentials.";
    if (errorDetails.errorCode === "500.001.1001") {
      friendlyMessage = "Mpesa Error: Merchant does not exist. Please check if your SHORTCODE and TRANSACTION_TYPE match your Mpesa account type (Paybill vs Till).";
    } else if (errorDetails.errorMessage) {
      friendlyMessage = `Mpesa Error: ${errorDetails.errorMessage}`;
    }

    res.status(error.response?.status || 500).json({ 
      error: "Failed to initiate STK push", 
      details: errorDetails,
      message: friendlyMessage
    });
  }
});

// Callback route
app.post("/api/callback", (req, res) => {
  console.log("Mpesa Callback Received:", JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: "Success" });
});

export default app;
