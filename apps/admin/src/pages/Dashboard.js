import React from 'react'
import { useConnectionStore } from "../store/useConnectionStore";
export default function Dashboard() {
  const {
      user,
    } = useConnectionStore();
  return (
    <div>
      <div>Dashboard</div>
      {user && (
        <div className="mt-4">
          <p>
            <strong>Wallet:</strong> {user.wallet_address}
          </p>
          <p>
            <strong>Joined:</strong> {user.hasJoined() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Created At:</strong> {user.getFormattedCreateTime()}
          </p>
        </div>
      )}
    </div>
  );
}
