"use client";

import { FormEvent, useState } from "react";

const stats = [
  ["Today’s sales", "RM 0.00", "Record the first receipt"],
  ["Low-stock items", "0", "No data yet"],
  ["Pending purchase orders", "0", "No data yet"],
  ["Stock counts today", "0", "No data yet"]
];

export default function Home() {
  const [notice, setNotice] = useState("");
  async function recordReceipt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/receipts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    setNotice(response.ok ? "Receipt recorded successfully." : "Could not record receipt. Complete Supabase setup first.");
    if (response.ok) event.currentTarget.reset();
  }
  return <main>
    <header><div><p className="eyebrow">JILID ENAM · SEKsyEN 6, SHAH ALAM</p><h1>Operations dashboard</h1></div><span className="live">● Live operations</span></header>
    <nav><a className="active">Overview</a><a>Inventory</a><a>Purchasing</a><a>Receipts</a><a>Team</a><a>Payroll</a></nav>
    <section className="grid">{stats.map(([label, value, hint]) => <article className="card" key={label}><p>{label}</p><strong>{value}</strong><small>{hint}</small></article>)}</section>
    <section className="two-column">
      <article className="panel"><div className="panel-title"><div><p className="eyebrow">MANUAL BILLING</p><h2>Record a receipt</h2></div></div>
        <form onSubmit={recordReceipt}>
          <label>Receipt number<input name="receipt_number" placeholder="e.g. POS-2026-001" required /></label>
          <label>Total (RM)<input name="total_amount" type="number" min="0" step="0.01" placeholder="0.00" required /></label>
          <label>Payment method<select name="payment_method"><option>Cash</option><option>Card</option><option>DuitNow QR</option><option>Online transfer</option></select></label>
          <label>Notes<input name="notes" placeholder="Optional" /></label>
          <button type="submit">Save receipt</button>{notice && <p className="notice">{notice}</p>}
        </form>
      </article>
      <article className="panel"><p className="eyebrow">TELEGRAM OPERATIONS</p><h2>Ready to connect your team</h2><ol><li>Inventory: <code>/stockcount</code>, <code>/purchase</code>, <code>/wastage</code></li><li>HR: <code>/in</code>, <code>/out</code>, <code>/leave</code>, <code>/claim</code></li><li>Managers approve requests from the dashboard or bot.</li></ol><p className="muted">The webhook is included at <code>/api/telegram/webhook</code>. Add its secret in Vercel before enabling it.</p></article>
    </section>
  </main>;
}
