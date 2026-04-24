import { useEffect, useState } from "react";
import api from "../axios";

const SellerEarnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const loadEarnings = async () => {
    const summaryRes = await api.get("/seller/earnings/summary");
    const transactionsRes = await api.get("/seller/earnings/transactions");

    setTotalEarnings(summaryRes.data);
    setTransactions(transactionsRes.data);
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  return (
    <div className="seller-page min-vh-100 py-5">
      <div className="container">
        <h2 className="fw-bold mb-4">Seller Earnings</h2>

        <div className="card shadow border-0 rounded-4 mb-4">
          <div className="card-body">
            <h4 className="fw-semibold">
              Total Net Earnings:
              <span className="ms-2 text-success fw-bold">
                ₹{totalEarnings}
              </span>
            </h4>
          </div>
        </div>

        <div className="card shadow border-0 rounded-4">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table theme-table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Order ID</th>
                    <th>Gross</th>
                    <th>Commission</th>
                    <th>Net</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td>{txn.id}</td>
                      <td>{txn.order?.id}</td>

                      <td>₹{txn.grossAmount}</td>

                      <td className="text-danger">
                        ₹{txn.commissionAmount}
                      </td>

                      <td className="fw-semibold text-success">
                        ₹{txn.netAmount}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            txn.status === "SUCCESS"
                              ? "bg-success"
                              : txn.status === "PENDING"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>

                      <td className="theme-muted">
                        {txn.transactionDate}
                      </td>
                    </tr>
                  ))}

                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center theme-muted py-4">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;