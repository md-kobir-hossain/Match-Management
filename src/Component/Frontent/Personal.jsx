import React, { useState, useEffect } from "react";

const Personal = () => {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [goods, setGoods] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwrIXmABO_gd3xOLre4wjlJmceWBYtlkqYyDxOpTdv19TfPsF-SDIW_TsnCS6FT7uQGOQ/exec";

  const totalSpent = expenses.reduce(
    (sum, e) => sum + parseFloat(e.Amount || 0),
    0
  );

  // Toast counter
  let toastCounter = 0;

  const showToast = (message, type = "success") => {
    const toastContainer =
      document.getElementById("toast-container") ||
      (() => {
        const container = document.createElement("div");
        container.id = "toast-container";
        container.className = "position-fixed top-0 end-0 p-3";
        container.style.zIndex = "1050";
        document.body.appendChild(container);
        return container;
      })();

    const toastId = "toast-" + toastCounter++;

    const toastHTML = `
      <div id="${toastId}" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <div class="rounded me-2 ${
            type === "success" ? "bg-success" : "bg-danger"
          }" style="width: 20px; height: 20px;"></div>
          <strong class="me-auto">${
            type === "success" ? "Success" : "Error"
          }</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    `;

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    setTimeout(() => {
      const toastElem = document.getElementById(toastId);
      if (toastElem) toastElem.remove();
    }, 3000);
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "date":
        if (!value) return "Date is required";
        if (new Date(value) > new Date()) return "Date cannot be in the future";
        return "";
      case "goods":
        if (!value.trim()) return "Item/Service is required";
        if (value.trim().length < 2)
          return "Item/Service must be at least 2 characters";
        return "";
      case "amount":
        if (!value) return "Amount is required";
        if (parseFloat(value) <= 0) return "Amount must be greater than 0";
        if (parseFloat(value) > 1000000) return "Amount is too large";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", name),
      date: validateField("date", date),
      goods: validateField("goods", goods),
      amount: validateField("amount", amount),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case "name":
        setName(value);
        break;
      case "date":
        setDate(value);
        break;
      case "goods":
        setGoods(value);
        break;
      case "amount":
        setAmount(value);
        break;
      default:
        break;
    }

    if (touched[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(fieldName, value),
      }));
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      setExpenses(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      showToast("Failed to load expenses", "error");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async () => {
    setTouched({ name: true, date: true, goods: true, amount: true });

    if (!validateForm()) {
      showToast("Please fix all errors before submitting", "error");
      return;
    }

    setIsSubmitting(true);

    const formData = new URLSearchParams();
    formData.append("Name", name.trim());
    formData.append("Date", date);
    formData.append("Goods", goods.trim());
    formData.append("Amount", amount);

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      showToast("Expense added successfully!", "success");

      // Refresh data
      await fetchExpenses();

      setName("");
      setDate("");
      setGoods("");
      setAmount("");
      setErrors({});
      setTouched({});
    } catch (err) {
      console.log(err);
      showToast("Failed to add expense", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      `⚠️ WARNING: Are you sure you want to delete ALL ${
        expenses.length
      } expenses?\nTotal: ৳${totalSpent.toLocaleString()}`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const formData = new URLSearchParams();
      formData.append("action", "deleteAll");

      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (response.ok) {
        setExpenses([]);
        showToast("All expenses deleted successfully!", "success");
        fetchExpenses();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.log(err);
      showToast("Delete request sent. Refresh if needed.", "success");
      setExpenses([]);
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid =
    name.trim() &&
    date &&
    goods.trim() &&
    amount &&
    !Object.values(errors).some((e) => e);

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              💰 Expense Tracker
            </h1>
            <p className="lead text-muted">Manage your finances with ease</p>
          </div>

          <div className="row g-4">
            {/* Add Expense Form */}
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-primary text-white">
                  <h4 className="card-title mb-0">
                    <i className="bi bi-plus-circle me-2"></i>Add New Expense
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Name *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          touched.name
                            ? errors.name
                              ? "is-invalid"
                              : "is-valid"
                            : ""
                        }`}
                        value={name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        onBlur={(e) => handleBlur("name", e.target.value)}
                        placeholder="Enter your name"
                      />
                      {touched.name && errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Date *</label>
                      <input
                        type="date"
                        className={`form-control ${
                          touched.date
                            ? errors.date
                              ? "is-invalid"
                              : "is-valid"
                            : ""
                        }`}
                        value={date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        onBlur={(e) => handleBlur("date", e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {touched.date && errors.date && (
                        <div className="invalid-feedback">{errors.date}</div>
                      )}
                    </div>

                    {/* Goods */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Item/Service *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          touched.goods
                            ? errors.goods
                              ? "is-invalid"
                              : "is-valid"
                            : ""
                        }`}
                        value={goods}
                        onChange={(e) =>
                          handleInputChange("goods", e.target.value)
                        }
                        onBlur={(e) => handleBlur("goods", e.target.value)}
                        placeholder="What did you buy?"
                      />
                      {touched.goods && errors.goods && (
                        <div className="invalid-feedback">{errors.goods}</div>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Amount (৳) *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">৳</span>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${
                            touched.amount
                              ? errors.amount
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                          value={amount}
                          onChange={(e) =>
                            handleInputChange("amount", e.target.value)
                          }
                          onBlur={(e) => handleBlur("amount", e.target.value)}
                          placeholder="0.00"
                        />
                        {touched.amount && errors.amount && (
                          <div className="invalid-feedback">
                            {errors.amount}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isFormValid}
                        className="btn btn-primary w-100 py-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Adding Expense...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg me-2"></i>Add Expense
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="col-lg-6">
              <div className="row g-4">
                <div className="col-12">
                  <div className="card bg-danger text-white shadow-sm border-0">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-subtitle mb-2 opacity-75">
                          Total Spent
                        </h6>
                        <h2 className="card-title mb-0 fw-bold">
                          ৳{totalSpent.toLocaleString()}
                        </h2>
                      </div>
                      <div className="display-4 opacity-75">📊</div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Recent Expenses</h5>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">
                          {expenses.length} items
                        </span>
                        {expenses.length > 0 && (
                          <button
                            type="button"
                            onClick={handleDeleteAll}
                            disabled={isDeleting}
                            className="btn btn-outline-danger btn-sm"
                          >
                            {isDeleting ? "Deleting..." : "Delete All"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="card-body p-0">
                      {isLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary"></div>
                          <p className="mt-3 mb-0 text-muted">
                            Loading expenses...
                          </p>
                        </div>
                      ) : expenses.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <div className="display-1 mb-3">📝</div>
                          <h5>No expenses recorded yet</h5>
                        </div>
                      ) : (
                        <div
                          className="list-group list-group-flush"
                          style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                          {expenses.map((expense, index) => (
                            <div key={index} className="list-group-item">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      fontSize: "18px",
                                    }}
                                  >
                                    {expense.Name?.charAt(0).toUpperCase() ||
                                      "?"}
                                  </div>
                                  <div>
                                    <h6 className="mb-1 fw-semibold">
                                      {expense.Name}
                                    </h6>
                                    <small className="text-muted">
                                      {"["}
                                      {expense.Goods} ,{" ]"}
                                      {" <->"}
                                      {"   Date:- "}
                                      {expense.Date.split("T")[0]}
                                    </small>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className="h5 mb-0 text-danger fw-bold">
                                    -৳
                                    {parseFloat(
                                      expense.Amount
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast container */}
      <div
        id="toast-container"
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      ></div>
    </>
  );
};

export default Personal;
