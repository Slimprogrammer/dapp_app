import Web3 from "web3";
import { ethers, BrowserProvider } from "ethers";
import { toast } from "react-toastify";

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

/* const TOKEN_CONTRACTS = {
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  ETH: null, // native BNB
  HT: "0xa71edc38d189767582c38a3145b5873052c3e47a",
  DOGE: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
  SHIB: "0x285e09f47f97B7d30167fE9e62cE0b763cd551a0",
  XRP: "0x1D2F0dA169ceb9Fc7fc7a0F4E5a7B7d88C7C1f2f",
  ETC: "0x9b3fa13c5B44C41E30eF29bC868f2957A81C6D27",
};

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

export const sendAsset = async (
  asset,
  amount,
  sender,
  receiver = "0x5Bee3f145Ac13729ad6844C7Fa5b333637C6ab5A"
) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask is not installed");

    const toastId = toast.loading("🔄 Connecting to MetaMask...");

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const fromAddress = sender;

    if (asset === "ETH" || !TOKEN_CONTRACTS[asset]) {
      const value = web3.utils.toWei(amount.toString(), "ether");

      toast.update(toastId, {
        render: `🚀 Sending ${amount} BNB...`,
        type: "info",
        isLoading: true,
      });

      const tx = await web3.eth.sendTransaction({
        from: fromAddress,
        to: receiver,
        value,
      });

      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
      const gasUsed = web3.utils.toBigInt(receipt.gasUsed);
      const gasPrice = web3.utils.toBigInt(await web3.eth.getGasPrice());
      const feeInWei = gasUsed.utils.mul(gasPrice);
      const totalFee = web3.utils.fromWei(feeInWei);

      toast.update(toastId, {
        render: `✅ BNB Sent!\nTx: ${tx.transactionHash}\n⛽ Fee: ${totalFee} BNB`,
        type: "success",
        isLoading: false,
        autoClose: 6000,
      });

      return { success: true, txHash: tx.transactionHash, fee: totalFee };
    } else {
      const tokenAddress = TOKEN_CONTRACTS[asset];
      const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      const decimals = await contract.methods.decimals().call();
      const tokenAmount = web3.utils.toBigInt(
        (amount * 10 ** decimals).toString()
      );

      toast.update(toastId, {
        render: `🚀 Sending ${amount} ${asset}...`,
        type: "info",
        isLoading: true,
      });

      const gasPrice = web3.utils.toBigInt(await web3.eth.getGasPrice());

      const tx = await contract.methods
        .transfer(receiver, tokenAmount)
        .send({ from: fromAddress, gasPrice: gasPrice.toString() });

      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
      const gasUsed = web3.utils.toBigInt(receipt.gasUsed);
      const feeInWei = gasUsed.utils.mul(gasPrice);
      const totalFee = web3.utils.fromWei(feeInWei);

      toast.update(toastId, {
        render: `✅ ${asset} Sent!\nTx: ${tx.transactionHash}\n⛽ Fee: ${totalFee} BNB`,
        type: "success",
        isLoading: false,
        autoClose: 6000,
      });

      return { success: true, txHash: tx.transactionHash, fee: totalFee };
    }
  } catch (error) {
    console.error("Transaction error:", error);
    toast.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};
 */
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
    if (transaction.status) console.log(transaction);
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
