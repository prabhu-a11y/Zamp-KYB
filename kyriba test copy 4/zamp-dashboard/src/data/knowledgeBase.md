# Wio Bank Onboarding Process Documentation

## Overview
This document outlines the end-to-end automated onboarding process for Wio Bank's business account applications, integrated with Zamp Dashboard for real-time process monitoring and case management.

## Process Flow

### 1. Application Initiation
**Wio Dashboard:** User lands on welcome page and clicks "Get Started" button

**Zamp Dashboard Action:**
- New process ID is created automatically
- Case appears in "In Progress" bucket
- Status: "Wio Onboarding Application started"
- All form data saved to JSON in public folder
- All uploaded files saved with case ID reference

---

### 2. Identity Verification
**Wio Dashboard:** User provides identity information and uploads Emirates ID

**Required Information:**
- Full Name
- Email Address
- Mobile Number
- Emirates ID (image upload)
- Details extracted from Emirates ID

**Zamp Dashboard Action:**
- Status: "Identity Verification in Progress"
- Upon completion: "Identity Verification Complete"
- **Artifacts Generated:**
  - Data table with all identity fields and values
  - Emirates ID image (popup modal)

---

### 3. Eligibility Verification
**Wio Dashboard:** User selects their business documentation type and confirms industry eligibility

**User Selections:**
- "I have a Trade License" OR "I have a Freelance Permit"
- Confirmation: Not in restricted industries

**Zamp Dashboard Action:**
- Status: "Eligibility Verification in Progress"
- Upon confirmation: "Confirmed - not in restricted industries"
- Upon completion: "Eligibility Verification Complete"
- Message displays: "User has a {License Type} and is not in any restricted Industries"

---

### 4. Document Verification
**Wio Dashboard:** User provides license information for verification

**Input Options:**
- Trade License Number (for browser automation lookup)
- Trade License Upload (for OCR extraction)
- Freelance Permit Upload (for OCR extraction)

**Zamp Dashboard Action:**
- Status: "Verifying Documents"
- Upon completion: "Document Verification Complete"
- Message displays: "Applicant's Legal Type is {Legal Type}"
- **Artifacts Generated:**
  - For License Number: Browser agent video + extracted data table
  - For Document Upload: Uploaded image + extracted data table

**Key Field Extracted:** Legal Type (determines subsequent requirements)

---

### 5. Authority Verification
**Wio Dashboard:** User uploads required authority documents based on legal structure

**Document Requirements:**

**For Sole Proprietor:**
- Additional documents as required

**For LLC:**
- Additional documents as required

**Zamp Dashboard Action:**
- Status: "Authority Verification Pending"
- Upon completion: "Authority Verification Complete"
- **Artifacts Generated:**
  - All uploaded documents as clickable popup modals
  - Documents stored with case ID reference in backend

---

### 6. Business Verification
**Wio Dashboard:** User provides comprehensive business information

**Required Information:**
- Business Website
- International Operations (Yes/No + Countries)
- UAE Address

**Zamp Dashboard Action:**
- Status: "Business Verification in Progress"
- Upon completion: "Business Verification Complete"
- **Artifacts Generated:**
  - Data table with all business details fields and values

---

### 7. Financial Profiling
**Wio Dashboard:** User completes financial profile and selects banking products

**Financial Information:**
- Annual Turnover (range selection)
- Monthly Deposits (range selection)
- Monthly Withdrawals (range selection)
- Cash Deposits (percentage)
- Cash Withdrawals (percentage)

**Product Selection:**
- Local transfers
- International transfers
- Multiuser & team access
- Online payment gateway
- Invoice management
- Credit card

**Plan Selection:**
- Selected plan name (e.g., "Grow Plan")
- Monthly price

**Zamp Dashboard Action:**
- Status: "Financial Profiling in Progress"
- Upon completion: "Financial Profiling Complete"
- **Artifacts Generated:**
  - Comprehensive data table with all financial profile fields, selected products, and plan details

---

### 8. Review and Submission
**Wio Dashboard:** User reviews all provided information and submits application

**Zamp Dashboard Action:**
- Status: "Review Pending"
- Upon submission: "Review Complete. Application submitted successfully with reference number {Reference Number}"
- Case moves from "In Progress" to "Done" bucket

---

## Technical Architecture

### Data Flow
1. **Wio Dashboard** → User inputs and interactions
2. **Backend Server** → Processes data, creates process IDs, manages state
3. **Zamp Dashboard** → Real-time monitoring, artifact display, case management

### Data Storage
- **Form Data:** Saved as JSON in public folder of zamp-dashboard
- **Uploaded Files:** Saved in backend with case ID numbering
- **Artifacts:** Referenced from public folder for popup modals

### Real-Time Integration
- Process ID created immediately upon "Get Started" click
- All status updates reflected in real-time on Zamp Dashboard
- Log entries appear top-to-bottom chronologically
- Artifacts appear in Key Details panel artifact list

---

## Process States

### In Progress
- Application started through Financial Profiling Complete

### Done
- Review Complete and Application Submitted

---

## Artifacts Summary

Throughout the process, the following artifacts are generated and accessible via popup modals:

1. **Identity Verification:** Identity data table + Emirates ID image
2. **Document Verification:** License/permit image + extracted data table OR browser video + extracted data table
3. **Authority Verification:** All uploaded authority documents (clickable modals)
4. **Business Verification:** Business details data table
5. **Financial Profiling:** Financial profile + products + plan data table

All artifacts are listed in the Key Details panel on the Zamp Dashboard for easy access and reference.

---

## Integration Points

### Wio Dashboard → Zamp Dashboard
- Process initiation triggers case creation
- Each form completion triggers status update
- File uploads saved with case ID reference
- Application submission triggers case completion

### Key Integration Components
- Process ID generation and tracking
- Real-time status synchronization
- Artifact modal system
- Case state management (In Progress → Done)