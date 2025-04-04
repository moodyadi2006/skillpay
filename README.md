# SkillPay

## Overview

SkillPay is a comprehensive freelancing platform built with **Next.js** for both the backend and frontend. It integrates **Razorpay** as the payment gateway, providing a seamless experience for both freelancers and employers. The platform is designed to facilitate milestone-based payments, work verification, and dispute resolution.

## Features

### 1. Milestone-Based Payment System

- Employers can set up **payment milestones** when hiring freelancers.
- Each milestone corresponds to a specific deliverable or percentage of work completion.
- Funds are securely held in an **escrow system** until the work is verified.
- Payments can be released **automatically** or **manually** upon employer approval.

### 2. Work Verification System

- Freelancers can submit **work updates** tied to milestones.
- Employers have a **dashboard** to review and either approve or reject submitted work.
- A **feedback mechanism** allows employers to request revisions or clarifications before milestone approval.
- The system supports **automated work verification** via file uploads, screenshots, or work logs.

### 3. Dispute Resolution Mechanism

- A **chatbot named Neutra** has been implemented using the **Groq API**.
- Neutra provides **guidance** on how to handle disputes between employers and freelancers.
- It helps mediate conflicts by suggesting **fair resolutions** based on platform guidelines.

### 4. Email Verification

- **Resend Email** is used to send verification emails to users.
- Ensures secure and authenticated user registrations.

## Tech Stack

- **Frontend & Backend:** Next.js
- **Payment Gateway:** Razorpay
- **AI Chatbot:** Groq API

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skillpay.git
   cd skillpay
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env.local` file:
   ```env
   MONGODB_URI = your_mongodb_uri
   RESEND_API_KEY = your_resend_api_key
   NEXTAUTH_SECRET = your_secret
   RAZORPAY_PUBLIC_KEY = your_razorpay_public_key
   RAZORPAY_PRIVATE_KEY = your_razorpay_private_key
   NEXTAUTH_URL= your_nextauth_url
   GROQ_API_KEY = your_groq_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the platform.
