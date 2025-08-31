import React, { useState, useEffect } from "react";

const Personal = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwrIXmABO_gd3xOLre4wjlJmceWBYtlkqYyDxOpTdv19TfPsF-SDIW_TsnCS6FT7uQGOQ/exec";

  const fetchExpenses = async () => {
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalSpent = expenses.reduce(
    (sum, e) => sum + parseFloat(e.Amount || 0),
    0
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4">Expenses</h2>
      {isLoading ? (
        <p>Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <div>
          <ul className="list-group mb-3">
            {expenses.map((expense, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>{expense.Name}</span>
                <span>৳{parseFloat(expense.Amount).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <h4>Total Spent: ৳{totalSpent.toLocaleString()}</h4>
        </div>
      )}
    </div>
  );
};

export default Personal;
