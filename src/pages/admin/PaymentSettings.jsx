// import { useEffect, useState } from "react";
// import {
//   Building2,
//   CreditCard,
//   Landmark,
//   LoaderCircle,
//   Save,
//   ScrollText,
//   UserRound,
// } from "lucide-react";

// import toast, { Toaster } from "react-hot-toast";

// const API_ROOT = "https://coreops.pk/cakes/api";

// const PaymentSettings = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     payment_method: "Advance Payment",
//     bank_name: "",
//     account_title: "",
//     account_number: "",
//     iban: "",
//     instructions: "",
//   });

//   // ==========================================
//   // GET LOGGED-IN ADMIN
//   // ==========================================

//   const getAdmin = () => {
//     try {
//       const savedAdmin = localStorage.getItem("cakeAdmin");

//       if (!savedAdmin) {
//         return null;
//       }

//       return JSON.parse(savedAdmin);
//     } catch {
//       return null;
//     }
//   };

//   // ==========================================
//   // LOAD PAYMENT SETTINGS
//   // ==========================================

//   const loadPaymentSettings = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_ROOT}/PaymentSettings/get.php`,
//         {
//           method: "GET",
//         }
//       );

//       let result;

//       try {
//         result = await response.json();
//       } catch {
//         throw new Error("Server returned an invalid response.");
//       }

//       if (!response.ok || result.status !== "success") {
//         throw new Error(
//           result.message || "Unable to load payment settings."
//         );
//       }

//       const data = result.data || {};

//       setFormData({
//         payment_method:
//           data.payment_method || "Advance Payment",

//         bank_name:
//           data.bank_name || "",

//         account_title:
//           data.account_title || "",

//         account_number:
//           data.account_number || "",

//         iban:
//           data.iban || "",

//         instructions:
//           data.instructions || "",
//       });
//     } catch (error) {
//       console.error(
//         "Payment settings loading error:",
//         error
//       );

//       toast.error(
//         error.message || "Unable to load payment settings."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPaymentSettings();
//   }, []);

//   // ==========================================
//   // HANDLE INPUT
//   // ==========================================

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // ==========================================
//   // SAVE SETTINGS
//   // ==========================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (saving) {
//       return;
//     }

//     const admin = getAdmin();

//     if (!admin?.id) {
//       toast.error(
//         "Admin session was not found. Please login again."
//       );

//       return;
//     }

//     if (!formData.bank_name.trim()) {
//       toast.error("Bank or wallet name is required.");
//       return;
//     }

//     if (!formData.account_title.trim()) {
//       toast.error("Account title is required.");
//       return;
//     }

//     if (!formData.account_number.trim()) {
//       toast.error("Account number is required.");
//       return;
//     }

//     const payload = {
//       admin_id: Number(admin.id),

//       payment_method:
//         formData.payment_method.trim() ||
//         "Advance Payment",

//       bank_name:
//         formData.bank_name.trim(),

//       account_title:
//         formData.account_title.trim(),

//       account_number:
//         formData.account_number.trim(),

//       iban:
//         formData.iban.trim(),

//       instructions:
//         formData.instructions.trim(),
//     };

//     try {
//       setSaving(true);

//       const response = await fetch(
//         `${API_ROOT}/PaymentSettings/update.php`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify(payload),
//         }
//       );

//       let result;

//       try {
//         result = await response.json();
//       } catch {
//         throw new Error("Server returned an invalid response.");
//       }

//       if (!response.ok || result.status !== "success") {
//         throw new Error(
//           result.message || "Unable to save payment settings."
//         );
//       }

//       toast.success(
//         "Payment settings updated successfully."
//       );

//       if (result.data) {
//         setFormData((previous) => ({
//           ...previous,

//           payment_method:
//             result.data.payment_method ||
//             previous.payment_method,

//           bank_name:
//             result.data.bank_name ?? previous.bank_name,

//           account_title:
//             result.data.account_title ??
//             previous.account_title,

//           account_number:
//             result.data.account_number ??
//             previous.account_number,

//           iban:
//             result.data.iban ?? previous.iban,

//           instructions:
//             result.data.instructions ??
//             previous.instructions,
//         }));
//       }
//     } catch (error) {
//       console.error(
//         "Payment settings update error:",
//         error
//       );

//       toast.error(
//         error.message || "Unable to save payment settings."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       <Toaster position="top-right" />

//       <section className="admin-payment-settings-page">
//         {/* HEADING */}

//         <div className="admin-page-heading admin-payment-heading">
//           <div>
//             <span>PAYMENT MANAGEMENT</span>

//             <h1>Payment Settings</h1>

//             <p>
//               Manage the advance payment details shown to customers
//               during checkout.
//             </p>
//           </div>
//         </div>

//         {loading ? (
//           <div className="admin-payment-loading">
//             <LoaderCircle size={24} />
//             <span>Loading payment settings...</span>
//           </div>
//         ) : (
//           <form
//             className="admin-payment-layout"
//             onSubmit={handleSubmit}
//           >
//             {/* FORM */}

//             <div className="admin-payment-card">
//               <div className="admin-payment-card-heading">
//                 <div className="admin-payment-heading-icon">
//                   <Landmark size={20} />
//                 </div>

//                 <div>
//                   <span>ACCOUNT DETAILS</span>
//                   <h2>Advance Payment</h2>

//                   <p>
//                     These details will be displayed to customers
//                     before they place an order.
//                   </p>
//                 </div>
//               </div>

//               <div className="admin-payment-form-grid">
//                 {/* PAYMENT METHOD */}

//                 <div className="admin-payment-field full-field">
//                   <label>Payment Method</label>

//                   <div className="admin-payment-input">
//                     <CreditCard size={17} />

//                     <input
//                       type="text"
//                       name="payment_method"
//                       value={formData.payment_method}
//                       onChange={handleChange}
//                       disabled={saving}
//                       placeholder="Advance Payment"
//                     />
//                   </div>
//                 </div>

//                 {/* BANK */}

//                 <div className="admin-payment-field">
//                   <label>Bank / Wallet Name *</label>

//                   <div className="admin-payment-input">
//                     <Building2 size={17} />

//                     <input
//                       type="text"
//                       name="bank_name"
//                       value={formData.bank_name}
//                       onChange={handleChange}
//                       disabled={saving}
//                       placeholder="e.g. Meezan Bank"
//                     />
//                   </div>
//                 </div>

//                 {/* ACCOUNT TITLE */}

//                 <div className="admin-payment-field">
//                   <label>Account Title *</label>

//                   <div className="admin-payment-input">
//                     <UserRound size={17} />

//                     <input
//                       type="text"
//                       name="account_title"
//                       value={formData.account_title}
//                       onChange={handleChange}
//                       disabled={saving}
//                       placeholder="Account holder name"
//                     />
//                   </div>
//                 </div>

//                 {/* ACCOUNT NUMBER */}

//                 <div className="admin-payment-field">
//                   <label>Account Number *</label>

//                   <div className="admin-payment-input">
//                     <CreditCard size={17} />

//                     <input
//                       type="text"
//                       name="account_number"
//                       value={formData.account_number}
//                       onChange={handleChange}
//                       disabled={saving}
//                       placeholder="Enter account number"
//                     />
//                   </div>
//                 </div>

//                 {/* IBAN */}

//                 <div className="admin-payment-field">
//                   <label>IBAN (Optional)</label>

//                   <div className="admin-payment-input">
//                     <Landmark size={17} />

//                     <input
//                       type="text"
//                       name="iban"
//                       value={formData.iban}
//                       onChange={handleChange}
//                       disabled={saving}
//                       placeholder="PK00..."
//                     />
//                   </div>
//                 </div>

//                 {/* INSTRUCTIONS */}

//                 <div className="admin-payment-field full-field">
//                   <label>Payment Instructions</label>

//                   <div className="admin-payment-textarea-wrapper">
//                     <ScrollText size={17} />

//                     <textarea
//                       name="instructions"
//                       value={formData.instructions}
//                       onChange={handleChange}
//                       disabled={saving}
//                       rows="5"
//                       placeholder="Instructions shown to customers..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="admin-payment-actions">
//                 <button
//                   type="submit"
//                   className="admin-payment-save-button"
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <LoaderCircle
//                         size={17}
//                         className="admin-payment-spinner"
//                       />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save size={17} />
//                       Save Payment Details
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* PREVIEW */}

//             <aside className="admin-payment-preview">
//               <span>CHECKOUT PREVIEW</span>

//               <h2>Advance Payment</h2>

//               <p>
//                 This is how your current payment information will
//                 appear to customers.
//               </p>

//               <div className="admin-payment-preview-details">
//                 <div>
//                   <span>Payment Method</span>

//                   <strong>
//                     {formData.payment_method ||
//                       "Advance Payment"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Bank / Wallet</span>

//                   <strong>
//                     {formData.bank_name ||
//                       "Not configured"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Account Title</span>

//                   <strong>
//                     {formData.account_title ||
//                       "Not configured"}
//                   </strong>
//                 </div>

//                 <div>
//                   <span>Account Number</span>

//                   <strong>
//                     {formData.account_number ||
//                       "Not configured"}
//                   </strong>
//                 </div>

//                 {formData.iban && (
//                   <div>
//                     <span>IBAN</span>
//                     <strong>{formData.iban}</strong>
//                   </div>
//                 )}
//               </div>

//               {formData.instructions && (
//                 <div className="admin-payment-preview-note">
//                   <ScrollText size={16} />

//                   <p>{formData.instructions}</p>
//                 </div>
//               )}
//             </aside>
//           </form>
//         )}
//       </section>
//     </>
//   );
// };

// export default PaymentSettings;




import { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  Landmark,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  ScrollText,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

const API_ROOT = "https://coreops.pk/cakes/api";

const emptyAccount = {
  id: 0,
  bank_name: "",
  account_title: "",
  account_number: "",
  iban: "",
  status: "Active",
};

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [deletingId, setDeletingId] = useState(0);

  const [formData, setFormData] = useState({
    payment_method: "Advance Payment",
    instructions: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [accountForm, setAccountForm] = useState(emptyAccount);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const getAdmin = () => {
    try {
      const savedAdmin = localStorage.getItem("cakeAdmin");
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  };

  const parseResponse = async (response) => {
    try {
      return await response.json();
    } catch {
      throw new Error("Server returned an invalid response.");
    }
  };

  const loadPaymentSettings = async () => {
    const response = await fetch(
      `${API_ROOT}/PaymentSettings/get.php`,
      { method: "GET" }
    );

    const result = await parseResponse(response);

    if (!response.ok || result.status !== "success") {
      throw new Error(
        result.message || "Unable to load payment settings."
      );
    }

    const data = result.data || {};

    setFormData({
      payment_method:
        data.payment_method || "Advance Payment",
      instructions: data.instructions || "",
    });
  };

  const loadAccounts = async () => {
    const response = await fetch(
      `${API_ROOT}/PaymentSettings/getAccounts.php`,
      { method: "GET" }
    );

    const result = await parseResponse(response);

    if (!response.ok || result.status !== "success") {
      throw new Error(
        result.message || "Unable to load payment accounts."
      );
    }

    setAccounts(
      Array.isArray(result.data)
        ? result.data.map((account) => ({
            ...account,
            id: Number(account.id || 0),
          }))
        : []
    );
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPaymentSettings(),
        loadAccounts(),
      ]);
    } catch (error) {
      console.error("Payment settings loading error:", error);
      toast.error(
        error.message || "Unable to load payment settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAccountChange = (event) => {
    const { name, value } = event.target;

    setAccountForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddAccount = () => {
    setAccountForm(emptyAccount);
    setShowAccountForm(true);
  };

  const openEditAccount = (account) => {
    setAccountForm({
      id: Number(account.id || 0),
      bank_name: account.bank_name || "",
      account_title: account.account_title || "",
      account_number: account.account_number || "",
      iban: account.iban || "",
      status: account.status || "Active",
    });

    setShowAccountForm(true);
  };

  const closeAccountForm = () => {
    if (savingAccount) return;
    setAccountForm(emptyAccount);
    setShowAccountForm(false);
  };

  const saveGeneralSettings = async (event) => {
    event.preventDefault();

    if (savingSettings) return;

    const admin = getAdmin();

    if (!admin?.id) {
      toast.error(
        "Admin session was not found. Please login again."
      );
      return;
    }

    try {
      setSavingSettings(true);

      const response = await fetch(
        `${API_ROOT}/PaymentSettings/update.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: Number(admin.id),
            payment_method:
              formData.payment_method.trim() ||
              "Advance Payment",
            instructions: formData.instructions.trim(),
          }),
        }
      );

      const result = await parseResponse(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to save payment settings."
        );
      }

      toast.success("Payment settings updated successfully.");

      if (result.data) {
        setFormData((previous) => ({
          ...previous,
          payment_method:
            result.data.payment_method ||
            previous.payment_method,
          instructions:
            result.data.instructions ??
            previous.instructions,
        }));
      }
    } catch (error) {
      console.error("Payment settings update error:", error);
      toast.error(
        error.message || "Unable to save payment settings."
      );
    } finally {
      setSavingSettings(false);
    }
  };

  const saveAccount = async (event) => {
    event.preventDefault();

    if (savingAccount) return;

    const admin = getAdmin();

    if (!admin?.id) {
      toast.error(
        "Admin session was not found. Please login again."
      );
      return;
    }

    if (!accountForm.bank_name.trim()) {
      toast.error("Bank or wallet name is required.");
      return;
    }

    if (!accountForm.account_title.trim()) {
      toast.error("Account title is required.");
      return;
    }

    if (!accountForm.account_number.trim()) {
      toast.error("Account number is required.");
      return;
    }

    const isEditing = Number(accountForm.id) > 0;

    const endpoint = isEditing
      ? "updateAccount.php"
      : "addAccount.php";

    const payload = {
      admin_id: Number(admin.id),
      bank_name: accountForm.bank_name.trim(),
      account_title: accountForm.account_title.trim(),
      account_number: accountForm.account_number.trim(),
      iban: accountForm.iban.trim(),
      status: accountForm.status || "Active",
    };

    if (isEditing) {
      payload.id = Number(accountForm.id);
    }

    try {
      setSavingAccount(true);

      const response = await fetch(
        `${API_ROOT}/PaymentSettings/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await parseResponse(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message ||
            `Unable to ${isEditing ? "update" : "add"} payment account.`
        );
      }

      toast.success(
        isEditing
          ? "Payment account updated successfully."
          : "Payment account added successfully."
      );

      closeAccountForm();
      await loadAccounts();
    } catch (error) {
      console.error("Payment account save error:", error);
      toast.error(
        error.message || "Unable to save payment account."
      );
    } finally {
      setSavingAccount(false);
    }
  };

  const deleteAccount = async (account) => {
    if (!account?.id || deletingId) return;

    const admin = getAdmin();

    if (!admin?.id) {
      toast.error(
        "Admin session was not found. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${account.bank_name || "this payment account"}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(Number(account.id));

      const response = await fetch(
        `${API_ROOT}/PaymentSettings/deleteAccount.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: Number(admin.id),
            id: Number(account.id),
          }),
        }
      );

      const result = await parseResponse(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to delete payment account."
        );
      }

      toast.success("Payment account deleted successfully.");
      await loadAccounts();
    } catch (error) {
      console.error("Payment account delete error:", error);
      toast.error(
        error.message || "Unable to delete payment account."
      );
    } finally {
      setDeletingId(0);
    }
  };

  const activeAccounts = accounts.filter(
    (account) => account.status === "Active"
  );

  return (
    <>
      <Toaster position="top-right" />

      <section className="admin-payment-settings-page">
        <div className="admin-page-heading admin-payment-heading">
          <div>
            <span>PAYMENT MANAGEMENT</span>
            <h1>Payment Settings</h1>
            <p>
              Manage advance payment instructions and all bank or
              wallet accounts shown to customers during checkout.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="admin-payment-loading">
            <LoaderCircle
              size={24}
              className="admin-payment-spinner"
            />
            <span>Loading payment settings...</span>
          </div>
        ) : (
          <div className="admin-payment-multi-layout">
            <div className="admin-payment-multi-main">
              <form
                className="admin-payment-card"
                onSubmit={saveGeneralSettings}
              >
                <div className="admin-payment-card-heading">
                  <div className="admin-payment-heading-icon">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <span>GENERAL SETTINGS</span>
                    <h2>Advance Payment</h2>
                    <p>
                      Configure the payment method title and common
                      instructions shown with every account.
                    </p>
                  </div>
                </div>

                <div className="admin-payment-form-grid">
                  <div className="admin-payment-field full-field">
                    <label>Payment Method</label>

                    <div className="admin-payment-input">
                      <CreditCard size={17} />
                      <input
                        type="text"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleSettingsChange}
                        disabled={savingSettings}
                        placeholder="Advance Payment"
                      />
                    </div>
                  </div>

                  <div className="admin-payment-field full-field">
                    <label>Payment Instructions</label>

                    <div className="admin-payment-textarea-wrapper">
                      <ScrollText size={17} />
                      <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleSettingsChange}
                        disabled={savingSettings}
                        rows="4"
                        placeholder="Instructions shown to customers..."
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-payment-actions">
                  <button
                    type="submit"
                    className="admin-payment-save-button"
                    disabled={savingSettings}
                  >
                    {savingSettings ? (
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
                        Save General Settings
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="admin-payment-card admin-payment-accounts-card">
                <div className="admin-payment-accounts-heading">
                  <div className="admin-payment-card-heading">
                    <div className="admin-payment-heading-icon">
                      <Landmark size={20} />
                    </div>

                    <div>
                      <span>PAYMENT ACCOUNTS</span>
                      <h2>Bank & Wallet Accounts</h2>
                      <p>
                        Add as many payment accounts as you need.
                        Only Active accounts appear at checkout.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="admin-payment-add-account"
                    onClick={openAddAccount}
                  >
                    <Plus size={17} />
                    Add Account
                  </button>
                </div>

                {accounts.length === 0 ? (
                  <div className="admin-payment-empty-accounts">
                    <Landmark size={24} />
                    <strong>No payment accounts added yet.</strong>
                    <p>
                      Add your first bank or wallet account for
                      customer payments.
                    </p>
                  </div>
                ) : (
                  <div className="admin-payment-account-list">
                    {accounts.map((account) => (
                      <div
                        className="admin-payment-account-row"
                        key={account.id}
                      >
                        <div className="admin-payment-account-icon">
                          <Landmark size={19} />
                        </div>

                        <div className="admin-payment-account-info">
                          <div className="admin-payment-account-title-row">
                            <strong>{account.bank_name}</strong>
                            <span
                              className={`admin-payment-status ${
                                account.status === "Active"
                                  ? "is-active"
                                  : "is-inactive"
                              }`}
                            >
                              {account.status}
                            </span>
                          </div>

                          <p>{account.account_title}</p>
                          <small>
                            A/C: {account.account_number}
                            {account.iban
                              ? ` · IBAN: ${account.iban}`
                              : ""}
                          </small>
                        </div>

                        <div className="admin-payment-account-actions">
                          <button
                            type="button"
                            onClick={() => openEditAccount(account)}
                            title="Edit account"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteAccount(account)}
                            disabled={
                              deletingId === Number(account.id)
                            }
                            title="Delete account"
                          >
                            {deletingId === Number(account.id) ? (
                              <LoaderCircle
                                size={16}
                                className="admin-payment-spinner"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="admin-payment-preview">
              <span>CHECKOUT PREVIEW</span>
              <h2>
                {formData.payment_method || "Advance Payment"}
              </h2>

              <p>
                Customers can transfer payment to any active account
                listed below.
              </p>

              <div className="admin-payment-preview-details">
                <div>
                  <span>Payment Method</span>
                  <strong>
                    {formData.payment_method || "Advance Payment"}
                  </strong>
                </div>

                <div>
                  <span>Active Accounts</span>
                  <strong>{activeAccounts.length}</strong>
                </div>
              </div>

              <div className="admin-payment-preview-account-list">
                {activeAccounts.length === 0 ? (
                  <div className="admin-payment-preview-empty">
                    No active payment account configured.
                  </div>
                ) : (
                  activeAccounts.map((account) => (
                    <div
                      className="admin-payment-preview-account"
                      key={account.id}
                    >
                      <strong>{account.bank_name}</strong>
                      <span>{account.account_title}</span>
                      <span>{account.account_number}</span>
                      {account.iban && (
                        <small>{account.iban}</small>
                      )}
                    </div>
                  ))
                )}
              </div>

              {formData.instructions && (
                <div className="admin-payment-preview-note">
                  <ScrollText size={16} />
                  <p>{formData.instructions}</p>
                </div>
              )}
            </aside>
          </div>
        )}

        {showAccountForm && (
          <div
            className="admin-payment-account-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeAccountForm();
              }
            }}
          >
            <form
              className="admin-payment-account-modal"
              onSubmit={saveAccount}
            >
              <div className="admin-payment-account-modal-header">
                <div>
                  <span>PAYMENT ACCOUNT</span>
                  <h2>
                    {accountForm.id
                      ? "Edit Account"
                      : "Add Account"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeAccountForm}
                  disabled={savingAccount}
                  aria-label="Close"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="admin-payment-form-grid">
                <div className="admin-payment-field full-field">
                  <label>Bank / Wallet Name *</label>
                  <div className="admin-payment-input">
                    <Building2 size={17} />
                    <input
                      type="text"
                      name="bank_name"
                      value={accountForm.bank_name}
                      onChange={handleAccountChange}
                      disabled={savingAccount}
                      placeholder="e.g. Meezan Bank"
                    />
                  </div>
                </div>

                <div className="admin-payment-field">
                  <label>Account Title *</label>
                  <div className="admin-payment-input">
                    <UserRound size={17} />
                    <input
                      type="text"
                      name="account_title"
                      value={accountForm.account_title}
                      onChange={handleAccountChange}
                      disabled={savingAccount}
                      placeholder="Account holder name"
                    />
                  </div>
                </div>

                <div className="admin-payment-field">
                  <label>Account Number *</label>
                  <div className="admin-payment-input">
                    <CreditCard size={17} />
                    <input
                      type="text"
                      name="account_number"
                      value={accountForm.account_number}
                      onChange={handleAccountChange}
                      disabled={savingAccount}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>

                <div className="admin-payment-field">
                  <label>IBAN (Optional)</label>
                  <div className="admin-payment-input">
                    <Landmark size={17} />
                    <input
                      type="text"
                      name="iban"
                      value={accountForm.iban}
                      onChange={handleAccountChange}
                      disabled={savingAccount}
                      placeholder="PK00..."
                    />
                  </div>
                </div>

                <div className="admin-payment-field">
                  <label>Status</label>
                  <div className="admin-payment-input">
                    <Landmark size={17} />
                    <select
                      name="status"
                      value={accountForm.status}
                      onChange={handleAccountChange}
                      disabled={savingAccount}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-payment-account-modal-actions">
                <button
                  type="button"
                  onClick={closeAccountForm}
                  disabled={savingAccount}
                  className="admin-payment-cancel-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-payment-save-button"
                  disabled={savingAccount}
                >
                  {savingAccount ? (
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
                      {accountForm.id
                        ? "Update Account"
                        : "Add Account"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
};

export default PaymentSettings;
