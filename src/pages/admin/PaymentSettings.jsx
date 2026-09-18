import { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  Landmark,
  LoaderCircle,
  Save,
  ScrollText,
  UserRound,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

const API_ROOT = "https://coreops.pk/cakes/api";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    payment_method: "Advance Payment",
    bank_name: "",
    account_title: "",
    account_number: "",
    iban: "",
    instructions: "",
  });

  // ==========================================
  // GET LOGGED-IN ADMIN
  // ==========================================

  const getAdmin = () => {
    try {
      const savedAdmin = localStorage.getItem("cakeAdmin");

      if (!savedAdmin) {
        return null;
      }

      return JSON.parse(savedAdmin);
    } catch {
      return null;
    }
  };

  // ==========================================
  // LOAD PAYMENT SETTINGS
  // ==========================================

  const loadPaymentSettings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_ROOT}/PaymentSettings/get.php`,
        {
          method: "GET",
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to load payment settings."
        );
      }

      const data = result.data || {};

      setFormData({
        payment_method:
          data.payment_method || "Advance Payment",

        bank_name:
          data.bank_name || "",

        account_title:
          data.account_title || "",

        account_number:
          data.account_number || "",

        iban:
          data.iban || "",

        instructions:
          data.instructions || "",
      });
    } catch (error) {
      console.error(
        "Payment settings loading error:",
        error
      );

      toast.error(
        error.message || "Unable to load payment settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const admin = getAdmin();

    if (!admin?.id) {
      toast.error(
        "Admin session was not found. Please login again."
      );

      return;
    }

    if (!formData.bank_name.trim()) {
      toast.error("Bank or wallet name is required.");
      return;
    }

    if (!formData.account_title.trim()) {
      toast.error("Account title is required.");
      return;
    }

    if (!formData.account_number.trim()) {
      toast.error("Account number is required.");
      return;
    }

    const payload = {
      admin_id: Number(admin.id),

      payment_method:
        formData.payment_method.trim() ||
        "Advance Payment",

      bank_name:
        formData.bank_name.trim(),

      account_title:
        formData.account_title.trim(),

      account_number:
        formData.account_number.trim(),

      iban:
        formData.iban.trim(),

      instructions:
        formData.instructions.trim(),
    };

    try {
      setSaving(true);

      const response = await fetch(
        `${API_ROOT}/PaymentSettings/update.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to save payment settings."
        );
      }

      toast.success(
        "Payment settings updated successfully."
      );

      if (result.data) {
        setFormData((previous) => ({
          ...previous,

          payment_method:
            result.data.payment_method ||
            previous.payment_method,

          bank_name:
            result.data.bank_name ?? previous.bank_name,

          account_title:
            result.data.account_title ??
            previous.account_title,

          account_number:
            result.data.account_number ??
            previous.account_number,

          iban:
            result.data.iban ?? previous.iban,

          instructions:
            result.data.instructions ??
            previous.instructions,
        }));
      }
    } catch (error) {
      console.error(
        "Payment settings update error:",
        error
      );

      toast.error(
        error.message || "Unable to save payment settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <section className="admin-payment-settings-page">
        {/* HEADING */}

        <div className="admin-page-heading admin-payment-heading">
          <div>
            <span>PAYMENT MANAGEMENT</span>

            <h1>Payment Settings</h1>

            <p>
              Manage the advance payment details shown to customers
              during checkout.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="admin-payment-loading">
            <LoaderCircle size={24} />
            <span>Loading payment settings...</span>
          </div>
        ) : (
          <form
            className="admin-payment-layout"
            onSubmit={handleSubmit}
          >
            {/* FORM */}

            <div className="admin-payment-card">
              <div className="admin-payment-card-heading">
                <div className="admin-payment-heading-icon">
                  <Landmark size={20} />
                </div>

                <div>
                  <span>ACCOUNT DETAILS</span>
                  <h2>Advance Payment</h2>

                  <p>
                    These details will be displayed to customers
                    before they place an order.
                  </p>
                </div>
              </div>

              <div className="admin-payment-form-grid">
                {/* PAYMENT METHOD */}

                <div className="admin-payment-field full-field">
                  <label>Payment Method</label>

                  <div className="admin-payment-input">
                    <CreditCard size={17} />

                    <input
                      type="text"
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="Advance Payment"
                    />
                  </div>
                </div>

                {/* BANK */}

                <div className="admin-payment-field">
                  <label>Bank / Wallet Name *</label>

                  <div className="admin-payment-input">
                    <Building2 size={17} />

                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="e.g. Meezan Bank"
                    />
                  </div>
                </div>

                {/* ACCOUNT TITLE */}

                <div className="admin-payment-field">
                  <label>Account Title *</label>

                  <div className="admin-payment-input">
                    <UserRound size={17} />

                    <input
                      type="text"
                      name="account_title"
                      value={formData.account_title}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="Account holder name"
                    />
                  </div>
                </div>

                {/* ACCOUNT NUMBER */}

                <div className="admin-payment-field">
                  <label>Account Number *</label>

                  <div className="admin-payment-input">
                    <CreditCard size={17} />

                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>

                {/* IBAN */}

                <div className="admin-payment-field">
                  <label>IBAN (Optional)</label>

                  <div className="admin-payment-input">
                    <Landmark size={17} />

                    <input
                      type="text"
                      name="iban"
                      value={formData.iban}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="PK00..."
                    />
                  </div>
                </div>

                {/* INSTRUCTIONS */}

                <div className="admin-payment-field full-field">
                  <label>Payment Instructions</label>

                  <div className="admin-payment-textarea-wrapper">
                    <ScrollText size={17} />

                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      disabled={saving}
                      rows="5"
                      placeholder="Instructions shown to customers..."
                    />
                  </div>
                </div>
              </div>

              <div className="admin-payment-actions">
                <button
                  type="submit"
                  className="admin-payment-save-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="admin-payment-spinner"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Payment Details
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PREVIEW */}

            <aside className="admin-payment-preview">
              <span>CHECKOUT PREVIEW</span>

              <h2>Advance Payment</h2>

              <p>
                This is how your current payment information will
                appear to customers.
              </p>

              <div className="admin-payment-preview-details">
                <div>
                  <span>Payment Method</span>

                  <strong>
                    {formData.payment_method ||
                      "Advance Payment"}
                  </strong>
                </div>

                <div>
                  <span>Bank / Wallet</span>

                  <strong>
                    {formData.bank_name ||
                      "Not configured"}
                  </strong>
                </div>

                <div>
                  <span>Account Title</span>

                  <strong>
                    {formData.account_title ||
                      "Not configured"}
                  </strong>
                </div>

                <div>
                  <span>Account Number</span>

                  <strong>
                    {formData.account_number ||
                      "Not configured"}
                  </strong>
                </div>

                {formData.iban && (
                  <div>
                    <span>IBAN</span>
                    <strong>{formData.iban}</strong>
                  </div>
                )}
              </div>

              {formData.instructions && (
                <div className="admin-payment-preview-note">
                  <ScrollText size={16} />

                  <p>{formData.instructions}</p>
                </div>
              )}
            </aside>
          </form>
        )}
      </section>
    </>
  );
};

export default PaymentSettings;