# Stride - FinTech x Interledger Hackathon 2026

### Team Name: Common Cents

**Team Members:**
- Amy Felix
- Nicoroy Zwane
- Nina Meyer
- Azrah Parker
- Zaakirah Levy
- Bonolo masela

---

## Problem Statement

Millions of informal workers are paid in cash, leaving them without verifiable proof of income. This limits access to housing, credit, and financial services while manual cash transactions expose users to no proof of income and financial identity, poor transparency, and high transaction costs.

---

# Our Solution

Stride is a financial inclusion platform designed for informal workers across Southern Africa. It enables workers to receive secure digital payments, automatically generate proof of income.

The payslip feature turns OpenRemit's existing transaction record into a verifiable proof of income for informal workers. When a worker receives a payment through Stride, that completed transaction becomes a digital payslip — showing employer name, worker name, amount, date, work description, and a unique transaction ID anchored to the Open Payments record.

The worker accesses this from their income history view, which works like the payments section of a banking app: a filterable list of received payments, from which any individual transaction can be rendered as a formal payslip.

Built on the Interledger Open Payments standard, Stride provides users with a portable financial identity without requiring a traditional bank account.

---

## Open Payments Integration

Stride is built on top of **OpenRemit**, an open-source reference implementation of the Open Payments specification using the **@interledger/open-payments SDK**.

Rather than replacing OpenRemit's payment infrastructure, Stride extends it by adding:

- Automatic digital payslips generated from payment history.
- Worker profiles and payment requests.

## Open Payments Flow

Every payment within Stride follows the same Open Payments workflow:

1. The sender and receiver each have an Interledger wallet address.
2. The application requests a grant to create an incoming payment for the receiver.
3. A payment quote is generated showing the exact amount and fees before payment.
4. The sender authorises the payment through the GNAP grant flow.
5. OpenRemit creates the outgoing payment and transfers the funds.
6. Both parties receive an immutable transaction record.

---

## Tech Stack & Backend

- Node.js
- OpenRemit
- @interledger/open-payments SDK

## Standards & APIs

- Open Payments
- Interledger Protocol (ILP)
- GNAP

## Development Tools

- Git
- GitHub
- Visual Studio Code

---

# Current Features

- Digital wallet interface
- QR code payment requests
- Automatic digital payslips
- Digital worker profiles

---

# Hackathon Goals

- Build a functional MVP.
- Demonstrate Open Payments in a real-world financial inclusion use case.
- Deliver an intuitive and accessible user experience.
- Showcase secure, transparent, and affordable digital payments.
- Present a scalable solution for informal workers across Southern Africa.

---

Stride demonstrates how Open Payments can be extended beyond simple money transfers to create financial identity, transparent community savings, and affordable remittances for underserved communities.

