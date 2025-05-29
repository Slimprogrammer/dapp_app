import axios from "axios";

export const copyToClipboard = (text, name) => {
        navigator.clipboard.writeText(text)
        .then(() => {
            // Optional: Show a success message to the user
            console.log(`Copied ${name} to clipboard: ${text}`);
        })
        .catch((error) => {
            console.error("Error copying to clipboard:", error);
        });
    }


export const shortAddress = (address) => {
  try {
    return (
      address.substring(0, 4) +
      "..." +
      address.substring(address.length - 4, address.length) +
      "  "
    );
  } catch (e) {
    console.log(e.message);
  }
};

// Assuming your backend proxy is at http://localhost:5000 (or your chosen port)
// You might also use an environment variable for this: process.env.REACT_APP_PROXY_URL
const PROXY_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Or "http://localhost:5000";

// ... (copyToClipboard and shortAddress functions remain the same) ...

export const getAssetLogo = async (symbol) => {
  try {
    if (!symbol) {
      console.error("Symbol is required");
      return null;
    }

    // Call your backend proxy endpoint
    const response = await axios.get(`${PROXY_BASE_URL}/api/coindesk/asset-logo`, {
      params: { symbol: symbol.toUpperCase() } // Pass the symbol as a query parameter
    });

    // Your proxy will send back the logoUrl directly
    return response.data.logoUrl;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error fetching asset logo from proxy for ${symbol}: ${error.response?.status} - ${error.response?.statusText}`,
        error.response?.data || error.message
      );
    } else {
      console.error(`An unexpected error occurred in getAssetLogo for ${symbol}:`, error);
    }
    return null;
  }
};