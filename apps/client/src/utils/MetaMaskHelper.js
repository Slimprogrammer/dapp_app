import Web3 from "web3";
import { ethers, BrowserProvider } from "ethers";
import { toast } from "react-toastify";
import axios from "axios";

const ERC20_ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

const TOKEN_CONTRACTS = {
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  ETH: null,
  HT: "0x6f259637dcD74C767781e37Bc6133cd6A68aa161",
  DOGE: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
  SHIB: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  XRP: "0x1D2F0dA169ceB9Fc7b3144628dB2fcbAedD7e8E4",
  ETC: "0x6e75d1f0c1fdf3472e8df9e4d12854b0ed64b6f0",
};

export const getERC20MarketData = async (tokenName) => {
  try {
  const apiURL = tokenName === "ETH" ? "https://api.coingecko.com/api/v3/coins/ethereum" : `https://api.coingecko.com/api/v3/coins/${tokenName.toLowerCase()}`;
    const tokenInfoRes = await axios.get(apiURL);
    if (!tokenInfoRes.data) {
      throw new Error("Token not found");
    }
    // Step 1: Get token ID from contract address
    const tokenContractAddress = TOKEN_CONTRACTS[tokenName];
    const tokenId = tokenInfoRes.data.id;

    // Step 2: Get OHLC data from hourly chart (1 day)
    const marketRes = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: 1,
          interval: 'hourly'
        }
      }
    );

    const prices = marketRes.data.prices;
    const open = prices[0][1];
    const close = prices[prices.length - 1][1];
    const high = Math.max(...prices.map(p => p[1]));
    const low = Math.min(...prices.map(p => p[1]));

    // Step 3: Get real-time price
    const realTimeRes = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum`,
      {
        params: {
          contract_addresses: TOKEN_CONTRACTS[tokenName],
          vs_currencies: 'usd'
        }
      }
    );

    const currentPrice =
      realTimeRes.data[TOKEN_CONTRACTS[tokenName].toLowerCase()].usd;

    return {
      token: tokenId,
      open: open.toFixed(6),
      high: high.toFixed(6),
      low: low.toFixed(6),
      close: close.toFixed(6),
      ohlc_current: close.toFixed(6),       // From 24h hourly candles
      real_time_current: currentPrice.toFixed(6)  // Fresh real-time price
    };
  } catch (error) {
    console.error('Error fetching ERC-20 token data:', error.message);
    return null;
  }
}



export const sendToken = async (sender, receiver, asset, amount) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not detected");

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const toastId = toast.loading(
      `Sending ${amount} ${asset} to ${receiver}...`
    );

    let tx;
    if (asset === "ETH") {
      tx = await signer.sendTransaction({
        to: receiver,
        value: ethers.parseEther(amount.toString()),
      });
    } else {
      const tokenAddress = TOKEN_CONTRACTS[asset];
      if (!tokenAddress) throw new Error("Unsupported token");

      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      );
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      tx = await tokenContract.transfer(receiver, amountInWei);
    }

    toast.update(toastId, {
      render: "Transaction submitted! Waiting for confirmation...",
      type: "info",
      isLoading: true,
    });

    const receipt = await tx.wait();

    toast.update(toastId, {
      render: `✅ Transaction confirmed! Hash: ${receipt.hash.slice(0, 10)}...`,
      type: "success",
      isLoading: false,
      autoClose: 5000,
    });

    return { success: true, txHash: tx.hash };
  } catch (err) {
    console.error(err);
    toast.error(`❌ Transaction failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};


const connectWallet = async (socket) => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        const address = accounts[0];
        // set({ walletAddress: address, isConnected: true });
        // Emit wallet address to the server via Socket.io
        socket.emit("wallet_connected", { address });
        await this.getAccountInfo(address);
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  } else {
    alert("MetaMask is not installed!");
  }
};

const handlePayment = async (walletAddress) => {
  try {
    const web3 = new Web3(window.ethereum);
    const fromAddress = walletAddress;

    const amountInEth = 100; // Amount in ETH
    const amountInWei = web3.utils.toWei(amountInEth.toString(), "ether"); // Convert to Wei

    console.log("pending");

    const transaction = await web3.eth.sendTransaction({
      from: fromAddress,
      to: "0x88cfEdAfe290ca6c67ADDDE4F950Ae285041274B", // Replace with the recipient's address
      value: amountInWei,
      // gas: 21000, // Optional: Set a gas limit (or let MetaMask estimate)
      // gasPrice: web3.utils.toWei('5', 'gwei'), // Optional: Set gas price (or let MetaMask estimate)
    });
    if (transaction.status)
      console.log(transaction);
      console.log("success");
  } catch (error) {
    console.log("Error sending transaction:", error);
    console.log("failed");

    // More specific error handling (optional):
    if (error.code === 4001) {
      // User rejected transaction
      console.log("Transaction was rejected by the user.");
    } else if (error.message.includes("insufficient funds")) {
      console.log("Insufficient funds in your MetaMask wallet.");
    } else {
      console.log("An error occurred during the transaction: " + error.message);
    }
  }
};

export { connectWallet, handlePayment };
