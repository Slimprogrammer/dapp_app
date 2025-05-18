import React from 'react'
import { handlePayment } from '../utils/MetaMaskHelper';
import { useConnectionStore } from "../store/useConnectionStore";

export default function AppNavBar() {
    const {
        socketConnected,
        metamaskConnected,
        walletAddress,
        socket_error,
        wallet_error,
        countdown,
    } = useConnectionStore();
    const [transactionState, setTransactionState] = React.useState(null);
   
    React.useEffect(() => {
        if (transactionState === "pending") {
            console.log("Transaction is pending...");
        } else if (transactionState === "success") {
            console.log("Transaction was successful!");
        } else if (transactionState === "failed") {
            console.log("Transaction failed.");
        }
    });
    const handlePaymentClick = async () => {
        if (walletAddress) {
            await handlePayment(walletAddress, setTransactionState);
        } else {
            console.error("Wallet address is not available.");
        }
    };
  return (
      <div>
          <h1>App NavBar</h1>
          
            <button onClick={handlePaymentClick}>Make Payment</button>

            {transactionState && (
                <div>
                    <p>Transaction Status: {transactionState}</p>
                </div>
            )}
      </div>
  )
}
