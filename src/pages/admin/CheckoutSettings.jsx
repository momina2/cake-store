import { useEffect, useState } from "react";
import { Clock3, Truck, Plus, Trash2, Save, MessageCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_ROOT = "https://coreops.pk/cakes/api";

const CheckoutSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    timing_enabled: 1,
    timing_heading: "Preferred Delivery Time",
    timing_note: "Choose the delivery time that suits you best.",
    time_slots: [],
    delivery_enabled: 1,
    cod_enabled: 1,
    takeaway_enabled: 1,
    cod_note: "Your cake will be delivered to your address. Please share your exact location on WhatsApp.",
    takeaway_note: "You can collect your cake yourself at the selected pickup date and time.",
    delivery_mode: "included",
    delivery_charge: 0,
    delivery_note_enabled: 1,
    delivery_note: "Delivery charges are included in cake prices. To locate your delivery location, please share your location with us on WhatsApp.",
    whatsapp_number: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_ROOT}/CheckoutSettings/get.php`);
        const result = await response.json();
        if (!response.ok || result.status !== "success") throw new Error(result.message || "Unable to load settings.");
        if (result.data) setForm((old) => ({ ...old, ...result.data, time_slots: Array.isArray(result.data.time_slots) ? result.data.time_slots : [] }));
      } catch (error) {
        toast.error(error.message || "Unable to load checkout settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setValue = (name, value) => setForm((old) => ({ ...old, [name]: value }));
  const addSlot = () => setForm((old) => ({ ...old, time_slots: [...old.time_slots, ""] }));
  const updateSlot = (index, value) => setForm((old) => ({ ...old, time_slots: old.time_slots.map((slot, i) => (i === index ? value : slot)) }));
  const removeSlot = (index) => setForm((old) => ({ ...old, time_slots: old.time_slots.filter((_, i) => i !== index) }));

  const save = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_ROOT}/CheckoutSettings/save.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success") throw new Error(result.message || "Unable to save settings.");
      if (!form.id && result.id) setValue("id", Number(result.id));
      toast.success("Checkout settings saved successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to save checkout settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="checkout-settings-page"><p>Loading checkout settings...</p></div>;

  return (
    <div className="checkout-settings-page">
      <Toaster position="top-right" />
      <div className="checkout-settings-topbar">
        <div><span className="admin-section-kicker">CHECKOUT MANAGEMENT</span><h1>Checkout Settings</h1><p>Manage customer delivery timings and delivery information from one place.</p></div>
        <button className="checkout-settings-save" onClick={save} disabled={saving}><Save size={17} />{saving ? "Saving..." : "Save Changes"}</button>
      </div>

      <div className="checkout-settings-grid">
        <section className="checkout-settings-card">
          <div className="checkout-settings-card-title"><div className="checkout-settings-icon"><Clock3 size={20} /></div><div><h2>Delivery Timings</h2><p>Control the time slots shown at checkout.</p></div></div>
          <label className="checkout-settings-toggle-row"><div><strong>Show delivery timings</strong><span>Customers will choose a preferred delivery slot.</span></div><input type="checkbox" checked={Number(form.timing_enabled) === 1} onChange={(e) => setValue("timing_enabled", e.target.checked ? 1 : 0)} /></label>
          <div className="checkout-settings-field"><label>Timing Heading</label><input value={form.timing_heading || ""} onChange={(e) => setValue("timing_heading", e.target.value)} /></div>
          <div className="checkout-settings-field"><label>Timing Note</label><textarea rows="3" value={form.timing_note || ""} onChange={(e) => setValue("timing_note", e.target.value)} /></div>
          <div className="checkout-settings-slots-heading"><div><label>Available Time Slots</label><small>Add as many slots as you need.</small></div><button type="button" onClick={addSlot}><Plus size={15} /> Add Slot</button></div>
          <div className="checkout-settings-slots">
            {form.time_slots.length === 0 && <div className="checkout-settings-empty">No time slots added yet.</div>}
            {form.time_slots.map((slot, index) => <div className="checkout-settings-slot" key={index}><input placeholder="e.g. 10:00 AM - 12:00 PM" value={slot} onChange={(e) => updateSlot(index, e.target.value)} /><button type="button" onClick={() => removeSlot(index)} title="Remove slot"><Trash2 size={16} /></button></div>)}
          </div>
        </section>

        <section className="checkout-settings-card">
          <div className="checkout-settings-card-title"><div className="checkout-settings-icon"><Truck size={20} /></div><div><h2>Delivery Settings</h2><p>Control COD, Take Away and customer-facing notes.</p></div></div>
          <label className="checkout-settings-toggle-row">
            <div><strong>Cash on Delivery (COD)</strong><span>Allow customers to choose delivery to their address.</span></div>
            <input type="checkbox" checked={Number(form.cod_enabled) === 1} onChange={(e) => setValue("cod_enabled", e.target.checked ? 1 : 0)} />
          </label>
          <div className="checkout-settings-field"><label>COD / Delivery Note</label><textarea rows="4" value={form.cod_note || ""} onChange={(e) => setValue("cod_note", e.target.value)} /></div>

          <label className="checkout-settings-toggle-row">
            <div><strong>Take Away</strong><span>Allow customers to collect the cake themselves.</span></div>
            <input type="checkbox" checked={Number(form.takeaway_enabled) === 1} onChange={(e) => setValue("takeaway_enabled", e.target.checked ? 1 : 0)} />
          </label>
          <div className="checkout-settings-field"><label>Take Away / Pickup Note</label><textarea rows="4" value={form.takeaway_note || ""} onChange={(e) => setValue("takeaway_note", e.target.value)} /></div>

          <div className="checkout-settings-field"><label><MessageCircle size={15} /> WhatsApp Number</label><input placeholder="e.g. 03008811400" value={form.whatsapp_number || ""} onChange={(e) => setValue("whatsapp_number", e.target.value)} /><small>Used for COD location sharing.</small></div>
        </section>
      </div>
    </div>
  );
};

export default CheckoutSettings;
