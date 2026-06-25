# Stride — Financial Infrastructure for the Informal Economy

> **2026 UCT Interledger Hackathon**
> Built on [OpenRemit](https://github.com/marclevin/OpenRemit) · Powered by Open Payments & the Interledger Protocol

---

## 1. The Problem

South Africa has one of the largest informal economies in the world. Domestic workers, day
labourers, spaza shop employees, and seasonal workers make up millions of working people, yet the
financial system largely ignores them. Three painful problems sit at the core of their daily lives.

### No Proof of Income

Most informal workers are paid in cash. There is no payslip, no bank record, no document they can
show a landlord, a bank, or a credit provider. Without proof of income, they cannot rent a formal
property, qualify for a loan, or access basic financial products. They are financially invisible
despite working full time.

### Stokvels Are Manual and Trust-Dependent

Stokvels are a cornerstone of South African savings culture — an estimated 11 million people
participate, saving over R50 billion annually. But almost all stokvels run on cash and verbal
agreements. The treasurer holds the money. Disputes are common. Fraud happens. There is no
transparent record of who contributed what and when. When the treasurer disappears with the pot,
there is no recourse.

### Cross-Border Money Transfer Is Exploitative

Millions of SADC migrants — from Zimbabwe, Mozambique, Lesotho, and beyond — work in South Africa
and send money home to their families. Services like Mukuru and Western Union charge between 5%
and 12% per transaction. A worker sending R1,000 home loses up to R120 to fees alone. Every month.
These are people who cannot afford to lose that money.

### The Root Cause

All three problems share a single underlying cause: there is no open, interoperable financial
infrastructure that works for people outside the formal banking system. Money moves through closed,
expensive, proprietary networks that were never designed for them.

---

## 2. The Solution: Stride

**Stride** *(isiZulu for 'money')* is a financial hub for the informal worker, built on Open
Payments and the Interledger Protocol. It gives every user a wallet address — a single, portable,
human-readable identifier — and builds three financial tools around it:

| Feature | What It Does |
|---|---|
| **Pay** | A digital payslip system so employers can pay workers with a verifiable record |
| **Save** | A stokvel manager so savings clubs can collect contributions and distribute payouts transparently |
| **Send** | A cross-border remittance tool so workers can send money home at near-zero fees |

The app's central insight is that the **same wallet address powers all three**. Nomsa, a domestic
worker in Johannesburg, receives her Friday pay via Stride — that transaction becomes her payslip.
She is in a stokvel with nine other women from her street — Stride automates the contributions and
payouts. When she is ready to send money to her mother in Harare, the same app handles it, because
Open Payments works across borders and currencies by design.

> **Tagline: "Your money, with proof."**
>
> Stride is not just a payment app. It is a financial identity tool for people the formal system
> has never seen.

---

## 3. How It Works Technically

Stride is built on top of OpenRemit, an open-source hackathon template that implements the
complete Open Payments send/receive flow using the `@interledger/open-payments` SDK. We extend it
with stokvel group logic and a payslip layer on top of the existing payment history.

### 3.1 The Open Payments Flow

Every payment in Stride — whether a gig pay, a stokvel contribution, or a remittance — follows
the same Open Payments flow:

```
  Stride App               Backend                      Open Payments Network
  ─────────────────────    ──────────────────────────   ──────────────────────
  Enter recipient          POST /api/remit/quote
  + amount + description   ├─ walletAddress.get()       ──► Resolve both wallets
                           ├─ grant.request()           ──► Incoming-payment grant
                           ├─ incomingPayment.create()  ──► Create incoming payment
                           ├─ grant.request()           ──► Quote grant
                           └─ quote.create()            ──► Fees shown upfront

  Sender approves          POST /api/remit/consent
                           ├─ grant.request()           ──► Interactive GNAP grant
                           └─ returns interactUrl

  Wallet auth redirect ──────────────────────────────► Auth server consent screen

  Callback             ──► GET /api/callback
                           ├─ grant.continue()          ──► Exchange interact_ref
                           └─ outgoingPayment.create()  ──► Funds move

  Both parties receive an immutable transaction record
```

### 3.2 The Stokvel Feature

We extend OpenRemit's database schema with two new tables:

- `stokvels` — group name, member list, contribution amount, payout schedule
- `stokvel_members` — userId, stokveldId, contribution amount, payout order

The treasurer creates a stokvel group, adds members by their wallet address or username, and sets
the monthly contribution amount. At payout time, the app uses OpenRemit's existing payment request
('ask') flow to send contribution requests to all members simultaneously, collects the payments via
Open Payments, and the treasurer triggers the payout to the nominated member for that month. Every
transaction is recorded and visible to all group members — a transparent ledger that eliminates the
trust problem at the heart of every stokvel dispute.

### 3.3 The Payslip Feature

This requires almost no new backend code. OpenRemit's existing transaction history already captures
sender, receiver, amount, date, and a description field. We make the description field mandatory
for gig payments and build a new frontend view that renders a single transaction as a formal
digital payslip: employer name, worker name, amount, date, work description, and a unique
transaction ID anchored to the Open Payments record. The worker can screenshot it or share the
link. It becomes their proof of income — backed by a real payment record, not a self-generated
document.

### 3.4 The Remittance Feature

OpenRemit was built as a remittance template. For cross-border payments we add a country and
currency selector to the quote view, surface the exchange rate clearly, and show the recipient
amount in their local currency before the user confirms. ILP's multi-hop routing handles the
currency conversion across the network. This is positioned as a version 1.1 feature demonstrated
as a talking point — the stokvel and payslip flows are the primary demo.

### Changes to OpenRemit

| File / Area | Change |
|---|---|
| `backend/src/db/schema.ts` | Add `stokvels` and `stokvel_members` tables |
| `backend/src/routes/` | Add `/api/stokvels` routes (create group, add members, send contribution requests, trigger payout) |
| `backend/src/routes/remit.ts` | Make `description` field mandatory on gig payments |
| `frontend/src/views/stokveldashboardView.ts` | New view: group dashboard showing members, contributions, payout order, audit trail |
| `frontend/src/views/payslipView.ts` | New view: renders a single transaction as a formal digital payslip |
| `frontend/src/views/quoteView.ts` | Add currency/country selector and recipient-currency display for cross-border payments |

---

## 4. Team & Division of Work

| Role | Responsibility |
|---|---|
| Backend (×2) | Fork OpenRemit, add `stokvels` + `stokvel_members` tables, build stokvel routes, wire mandatory description on gig payments |
| Frontend (×2) | Skin OpenRemit UI, build Stokvel Dashboard view, build Payslip view, polish quote/consent/status flows |
| Product & Demo (×1) | Define user personas, script demo flow, prepare pitch, set up TestNet wallets |

**Day 1 Goal:** Working backend with stokvel group logic and gig payment flow end-to-end on the
Interledger TestNet. Schema extended, all routes tested via Postman or the existing frontend by
end of day.

**Day 2 Goal:** Frontend polished and demo-ready. Payslip view and Stokvel Dashboard complete. One
full scripted run-through with the judges' scoring rubric in mind. Remittance demo prepared as a
talking point.

---

## 5. The Demo Story

### Meet Nomsa

Nomsa is a domestic worker in Johannesburg. She works five days a week for a family in Sandton.
She is in a stokvel with nine other women from her street. Her mother lives in Harare, Zimbabwe.
We demo Stride by walking through Nomsa's week.

**Friday — Pay day**
Nomsa's employer opens Stride, enters Nomsa's wallet address
(`$stride.interledger-test.dev/nomsa`), adds a description (*"House cleaning, 5 days, June week
4"*), and pays her R800. Nomsa receives a notification and views her digital payslip immediately.
She screenshots it and sends it to her landlord who has been asking for proof of income.

**Month end — Stokvel payout**
Nomsa's stokvel of 10 members is due to collect contributions. The treasurer opens the Stokvel
Dashboard, sees all 10 members listed, and clicks "Send contribution requests". Each member
receives an Open Payments payment request for R500. Eight members approve immediately from their
phones. Two are reminded the next day. When all 10 have paid, the treasurer triggers the payout —
R5,000 lands in this month's recipient's wallet within seconds, with a full audit trail every
member can see.

**Weekend — Remittance**
Nomsa wants to send R300 to her mother in Harare. She opens Stride, enters her mother's mobile
money wallet address, and sees the quote: R300 → approximately $16.20 after exchange, zero markup,
minimal network fee. She approves. The money arrives the same day.

> This story hits every rubric category: real-world impact, clear user need, technical depth
> (Open Payments used throughout), and a compelling narrative for the judges.

---

## 6. Why This Scores Well

| Rubric Category | Why Stride Delivers |
|---|---|
| **Quality of the idea** | Clear, specific problem affecting millions of South Africans. Three features unified by one coherent insight: a wallet address is a financial identity. |
| **Potential strategic impact** | 11 million stokvel participants, millions of informal workers, millions of SADC migrants — all underserved by existing fintech. Open Payments is mandatory and used throughout every feature. |
| **Implementation** | Built on OpenRemit (production-quality Open Payments template). Payslip requires minimal new backend code. Stokvel adds one logical schema extension and a reuse of the existing payment request flow. Live TestNet demo. |
| **User experience & presentation** | Nomsa's story is the demo. Judges see a real person's week, not a generic payment flow. The payslip view delivers tangible proof of value in under 10 seconds. |

---

## 7. Real-World Viability

Stride is viable beyond the hackathon. The go-to-market path is clear:

- **Domestic worker unions** — SADSAWU has 20,000+ members; partnering onboards workers and
  employers simultaneously in a single channel
- **Stokvel associations** — formal stokvel networks exist in every major South African city and
  actively seek tools that protect their members from treasurer fraud
- **Remittance corridors** — the Zimbabwe corridor alone represents hundreds of millions of rand
  annually; competitive fees are a compelling acquisition driver with no marketing spend required
- **Structural interoperability advantage** — as Open Payments adoption grows across SADC banks and
  mobile money providers, Stride's interoperability becomes a durable structural advantage over
  proprietary remittance services that depend on closed bilateral agreements
- **Revenue model** — small percentage fee on stokvel payouts (far less than the fraud losses the
  system currently prevents); premium payslip features for employers; FX margin on cross-border
  transfers

The same conditional spending architecture that enforces bursary allowances can enforce stokvel
contribution rules and employer pay obligations. The protocol is the same. The trust problem being
solved is the same. Stride is the informal economy's first programmable financial identity.

---

*Built at the 2026 UCT Interledger Bootcamp & Hackathon, Cape Town.*
*Template: [OpenRemit](https://github.com/marclevin/OpenRemit) · Protocol: [Open Payments](https://openpayments.dev) · ILP: [Interledger](https://interledger.org)*
