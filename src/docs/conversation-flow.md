# Business Bank Account Onboarding Flow

## Overview

This document specifies the complete onboarding flow for a business bank account opening demo. The flow demonstrates AI-enabled document extraction and dynamic screens based on user inputs.

---

## Screen Inventory

| Screen ID | Screen Name                               | Condition to Display                            |
| --------- | ----------------------------------------- | ----------------------------------------------- |
| 1.1       | Full Name Input                           | Start                                           |
| 1.2       | Email Input                               | After 1.1                                       |
| 1.3       | Email OTP Verification                    | After 1.2                                       |
| 1.4       | Phone Input                               | After 1.3                                       |
| 1.5       | Phone OTP Verification                    | After 1.4                                       |
| 1.6       | Password Creation                         | After 1.5                                       |
| 1.7       | Emirates ID Upload                        | After 1.6                                       |
| 1.8       | Emirates ID Extraction Confirmation       | After 1.7                                       |
| 2.1       | Business Type Selection                   | After 1.8                                       |
| 2.2       | Restricted Industries Modal               | After 2.1                                       |
| 3.1       | Trade License Upload                      | If business_type = "trade_license"              |
| 3.2       | Trade License Extraction Confirmation     | After 3.1                                       |
| 3.3       | Freelancer Permit Upload                  | If business_type = "freelancer"                 |
| 3.4       | Freelancer Permit Extraction Confirmation | After 3.3                                       |
| 3.5       | MOA Upload                                | If legal_type IN ["llc", "fzco", "fze"]         |
| 3.6       | Partnership Deed Upload                   | If legal_type = "partnership"                   |
| 3.7       | Shareholder Extraction Confirmation       | After 3.5 or 3.6                                |
| 4.1       | Authorization Summary - Shareholder/Owner | If verified_name matches shareholder/owner      |
| 4.2       | Authorization Summary - Non-Shareholder   | If verified_name does not match any shareholder |
| 4.3       | POA Upload                                | If requiresPOA = true                           |
| 4.4       | POA Extraction Confirmation               | After 4.3                                       |
| 4.5       | Bank Mandate Upload                       | If requiresBankMandate = true                   |
| 4.6       | Proof of Address Upload                   | After authorization documents                   |
| 5.1       | Online Presence Question                  | After 4.6                                       |
| 5.2       | Website URL Input                         | If online_presence = yes                        |
| 5.3       | International Operations Question         | After 5.1 or 5.2                                |
| 5.4       | Operating Countries Selection             | If international_ops = yes                      |
| 5.5       | Physical Presence Abroad Question         | After 5.4                                       |
| 5.6       | Physical Address in UAE Question          | After 5.3 or 5.5                                |
| 5.7       | Business Address Input                    | If physical_address_uae = yes                   |
| 6.1       | Annual Turnover                           | After 5.6 or 5.7                                |
| 6.2       | Sources of Funds                          | After 6.1                                       |
| 6.3       | Monthly Deposits                          | After 6.2                                       |
| 6.4       | Monthly Withdrawals                       | After 6.3                                       |
| 6.5       | Cash Deposit Percentage                   | After 6.4                                       |
| 6.6       | Cash Withdrawal Percentage                | After 6.5                                       |
| 6.7       | Product Recommendations                   | After 6.6                                       |
| 6.8       | Plan Recommendation                       | After 6.7                                       |
| 7.1       | Review Pane                               | After 6.8                                       |
| 7.2       | Declaration                               | After 7.1                                       |
| 7.3       | Success                                   | After 7.2                                       |

---

## Step 1: Identity Verification

### Screen 1.1: Full Name Input

**Question:** "What is your full name?"
**Input:** Text field
**Next:** → 1.2

### Screen 1.2: Email Input

**Question:** "What is your email address?"
**Input:** Email field
**Next:** → 1.3

### Screen 1.3: Email OTP Verification

**Display:** "We've sent a 6-digit code to [email]. Please enter it below."
**Input:** 6-digit OTP field
**Next:** → 1.4

### Screen 1.4: Phone Input

**Question:** "What is your mobile number?"
**Input:** Phone field with +971 prefix
**Next:** → 1.5

### Screen 1.5: Phone OTP Verification

**Display:** "We've sent a 6-digit code to [phone]. Please enter it below."
**Input:** 6-digit OTP field
**Next:** → 1.6

### Screen 1.6: Password Creation

**Question:** "Create a password for your account"
**Input:** Password field with confirmation
**Requirements shown:** Min 8 characters, 1 uppercase, 1 number
**Next:** → 1.7

### Screen 1.7: Emirates ID Upload

**Question:** "Please upload your Emirates ID"
**Input:** File upload (drag & drop or browse)
**Accepted formats:** PDF, JPG, PNG
**Next:** → 1.8

### Screen 1.8: Emirates ID Extraction Confirmation

**Display:** "We extracted the following from your Emirates ID. Please confirm:"

| Field         | Extracted Value |
| ------------- | --------------- |
| Full Name     | [extracted]     |
| ID Number     | [extracted]     |
| Nationality   | [extracted]     |
| Date of Birth | [extracted]     |
| Expiry Date   | [extracted]     |

**Input:** Editable fields + Confirm button
**Next:** → 2.1

---

## Step 2: Eligibility Check

### Screen 2.1: Business Type Selection

**Question:** "What kind of business are you opening an account for?"
**Input:** Two selection cards:

- "I have a Trade License"
- "I'm a Freelancer"

**Next:** → 2.2

### Screen 2.2: Restricted Industries Modal

**Type:** Modal overlay
**Title:** "Before we continue..."
**Content:**
"We're unable to open accounts for businesses in the following industries:

- Jewelry and precious metals trading
- Cryptocurrency and virtual assets
- Money exchange and remittance
- Gambling and gaming
- Weapons and ammunition
- Adult entertainment"

**Input:** Checkbox: "I confirm my business is not in any of these industries"
**Actions:** "Continue" button
**Next:**

- If business_type = "trade_license" → 3.1
- If business_type = "freelancer" → 3.3

---

## Step 3: Document Upload & Verification

### Screen 3.1: Trade License Upload

**Condition:** business_type = "trade_license"
**Question:** "Please upload your Trade License"
**Input:** File upload
**Next:** → 3.2

### Screen 3.2: Trade License Extraction Confirmation

**Display:** "We extracted the following from your Trade License:"

| Field             | Extracted Value |
| ----------------- | --------------- |
| Business Name     | [extracted]     |
| License Number    | [extracted]     |
| Issuing Authority | [extracted]     |
| Legal Type        | [extracted]     |
| Activities        | [extracted]     |
| Expiry Date       | [extracted]     |

**Input:** Editable fields + Confirm button
**Next:**

- If legal_type = "sole_proprietorship" → 4.1 or 4.2 (based on name match)
- If legal_type = "partnership" → 3.6
- If legal_type IN ["llc", "fzco", "fze"] → 3.5

### Screen 3.3: Freelancer Permit Upload

**Condition:** business_type = "freelancer"
**Question:** "Please upload your Freelancer Permit"
**Input:** File upload
**Next:** → 3.4

### Screen 3.4: Freelancer Permit Extraction Confirmation

**Display:** "We extracted the following from your Freelancer Permit:"

| Field             | Extracted Value |
| ----------------- | --------------- |
| Full Name         | [extracted]     |
| Permit Number     | [extracted]     |
| Issuing Authority | [extracted]     |
| Activity          | [extracted]     |
| Expiry Date       | [extracted]     |

**Input:** Editable fields + Confirm button
**Next:** → 4.1

### Screen 3.5: MOA Upload

**Condition:** legal_type IN ["llc", "fzco", "fze"]
**Question:** "Please upload your Memorandum of Association (MOA)"
**Input:** File upload
**Next:** → 3.7

### Screen 3.6: Partnership Deed Upload

**Condition:** legal_type = "partnership"
**Question:** "Please upload your Partnership Deed"
**Input:** File upload
**Next:** → 3.7

### Screen 3.7: Shareholder Extraction Confirmation

**Display:** "We extracted the following shareholders:"

| Name        | Nationality | Ownership   |
| ----------- | ----------- | ----------- |
| [extracted] | [extracted] | [extracted] |

**Input:** Editable table + Confirm button

**On Confirm — Name Matching Logic:**
Compare verified_name (from Screen 1.8) against each shareholder name in the table.

- If a match is found:
  - Set matched_shareholder_name = that shareholder's name
  - Set matched_shareholder_ownership = that shareholder's ownership %
  - → Go to 4.1
- If no match is found:
  - → Go to 4.2

---

## Step 4: Authorization

### Screen 4.1: Authorization Summary - Shareholder/Owner

**Condition:** verified_name matches shareholder or owner

**Display (Dynamic - build from previous inputs):**

Opening line:

```
You are [verified_name from Screen 1.8], [role] at [company_name from Screen 3.2], which is a [legal_type from Screen 3.2].
```

Where [role] is determined by:

- If business_type = "freelancer" → "the permit holder"
- If legal_type = "sole_proprietorship" → "the owner"
- If legal_type IN ["partnership", "llc", "fzco", "fze"] → "a shareholder with [matched_shareholder_ownership from Screen 3.7]% ownership"

Then show document requirements with reasons:

**Power of Attorney section:**

```
✓ Power of Attorney: Not required
[If freelancer]: You are the permit holder, so you have full authority over this account.
[If sole_proprietorship]: You're the owner of this business, so you have the authority to open this account.
[If partnership/llc/fzco/fze]: You're listed as a shareholder of this company, so you have the authority to open this account.
```

**Bank Mandate section:**

```
[If business_type = "freelancer"]:
✓ Bank Mandate: Not required
As a freelancer, you are the sole operator of your business.

[If legal_type = "sole_proprietorship"]:
✓ Bank Mandate: Not required
As the sole owner, you have full signing authority.

[If legal_type IN ["partnership", "llc", "fzco", "fze"] AND shareholder_count = 1]:
✓ Bank Mandate: Not required
As the sole shareholder, you have full signing authority.

[If legal_type IN ["partnership", "llc", "fzco", "fze"] AND shareholder_count > 1]:
• Bank Mandate: Required
Since your company has multiple shareholders, we need a document that specifies who can operate the account and sign on its behalf.
```

**Next:**

- If requiresBankMandate = true → 4.5
- If requiresBankMandate = false → 4.6

---

### Screen 4.2: Authorization Summary - Non-Shareholder

**Condition:** verified_name does not match any shareholder

**Display (Dynamic - build from previous inputs):**

Opening line:

```
You are [verified_name from Screen 1.8], and you're opening an account for [company_name from Screen 3.2], which is a [legal_type from Screen 3.2].

We noticed you're not listed as a shareholder of this company. That's okay — we'll just need some additional documents.
```

**Power of Attorney section:**

```
• Power of Attorney: Required
Since you're not a shareholder, we need a POA signed by one of the listed shareholders ([list shareholder names from Screen 3.7]) authorizing you to act on behalf of the company.
```

**Bank Mandate section:**

```
[If shareholder_count = 1]:
✓ Bank Mandate: Not required
The company has a single shareholder, so no mandate is needed.

[If shareholder_count > 1]:
• Bank Mandate: Required
Since this company has multiple shareholders, we need a document that specifies who can operate the account and sign on its behalf.
```

**Next:** → 4.3

### Screen 4.3: POA Upload

**Condition:** requiresPOA = true
**Question:** "Please upload your Power of Attorney"
**Helper text:** "The POA must be signed by a shareholder and must authorize you to act on behalf of the company."
**Input:** File upload
**Next:** → 4.4

### Screen 4.4: POA Extraction Confirmation

**Display:** "We extracted the following from your POA:"

| Field                | Extracted Value |
| -------------------- | --------------- |
| Granted By (Grantor) | [extracted]     |
| Granted To (Grantee) | [extracted]     |
| Scope                | [extracted]     |
| Date Issued          | [extracted]     |
| Expiry Date          | [extracted]     |
| Notarized            | [extracted]     |

**Input:** Editable fields + Confirm button
**Next:**

- If requiresBankMandate = true → 4.5
- If requiresBankMandate = false → 4.6

### Screen 4.5: Bank Mandate Upload

**Condition:** requiresBankMandate = true
**Question:** "Please upload your Bank Mandate"
**Helper text:** "This document specifies who has signing authority for the account."
**Input:** File upload
**Next:** → 4.6

### Screen 4.6: Proof of Address Upload

**Question:** "Please upload your Proof of Address"
**Helper text:** "Accepted: Utility bill, bank statement (within 3 months), or valid tenancy contract"
**Input:** File upload
**Next:** → 5.1

---

## Step 5: Business Details

### Screen 5.1: Online Presence Question

**Question:** "Does your business have an online presence?"
**Input:** Yes / No buttons
**Next:**

- If Yes → 5.2
- If No → 5.3

### Screen 5.2: Website URL Input

**Condition:** online_presence = yes
**Question:** "What is your website URL?"
**Input:** URL field
**Next:** → 5.3

### Screen 5.3: International Operations Question

**Question:** "Does your business operate in countries outside the UAE?"
**Input:** Yes / No buttons
**Next:**

- If Yes → 5.4
- If No → 5.6

### Screen 5.4: Operating Countries Selection

**Condition:** international_ops = yes
**Question:** "Which countries do you operate in?"
**Input:** Multi-select dropdown with country list
**Next:** → 5.5

### Screen 5.5: Physical Presence Abroad Question

**Condition:** international_ops = yes
**Question:** "Do you have a branch or physical presence in these countries?"
**Input:** Yes / No buttons
**Next:** → 5.6

### Screen 5.6: Physical Address in UAE Question

**Question:** "Do you have a physical business address in the UAE?"
**Input:** Yes / No buttons
**Next:**

- If Yes → 5.7
- If No → 6.1

### Screen 5.7: Business Address Input

**Condition:** physical_address_uae = yes
**Question:** "What is your business address?"
**Input:** Text area (multi-line)
**Next:** → 6.1

---

## Step 6: Financial Profile & Products

### Screen 6.1: Annual Turnover

**Question:** "What is your expected annual turnover?"
**Input:** Bracket selection:

- Less than AED 100,000
- AED 100,000 - 500,000
- AED 500,000 - 1 million
- AED 1 million - 5 million
- AED 5 million - 10 million
- More than AED 10 million

**Next:** → 6.2

### Screen 6.2: Sources of Funds

**Question:** "What are your main sources of funds?"
**Input:** Multi-select checkboxes:

- Business Revenue
- Shareholder Capital
- Family and Friends
- Advance Payments from Customers
- Loans
- Other (shows text field if selected)

**Next:** → 6.3

### Screen 6.3: Monthly Deposits

**Question:** "What is your expected monthly deposit volume?"
**Input:** Bracket selection:

- Less than AED 50,000
- AED 50,000 - 100,000
- AED 100,000 - 500,000
- AED 500,000 - 1 million
- More than AED 1 million

**Next:** → 6.4

### Screen 6.4: Monthly Withdrawals

**Question:** "What is your expected monthly withdrawal volume?"
**Input:** Bracket selection (same options as 6.3)
**Next:** → 6.5

### Screen 6.5: Cash Deposit Percentage

**Question:** "What percentage of your deposits will be in cash?"
**Input:** Percentage slider (0% - 100%)
**Next:** → 6.6

### Screen 6.6: Cash Withdrawal Percentage

**Question:** "What percentage of your withdrawals will be in cash?"
**Input:** Percentage slider (0% - 100%)
**Next:** → 6.7

### Screen 6.7: Product Recommendations

**Question:** "Based on what you've told us, here's what we think you'll need:"

**Display (Dynamic - pre-filled based on previous inputs):**

**Always included:**

```
✓ Local transfers
  Included with all Wio accounts.
```

**If international_operations = yes (from Screen 5.3):**

```
✓ International transfers
  You mentioned operating in [operating_countries from Screen 5.4].
```

**If shareholder_count > 1 (from Screen 3.7) OR legal_type IN ["partnership", "llc", "fzco", "fze"]:**

```
✓ Multiuser & team access
  Your company has multiple shareholders, so you'll likely need team access.
```

**If online_presence = yes (from Screen 5.1):**

```
✓ Online payment gateway
  You have a website, so you may want to accept payments online.
```

**If physical_address_uae = yes (from Screen 5.6) AND license_activities contains retail/F&B/trading keywords:**

```
✓ Point of Sale terminals
  You have a physical location, so you may need to accept in-person payments.
```

**If legal_type IN ["partnership", "llc", "fzco", "fze"] AND annual_turnover > "AED 500,000 - 1 million" (from Screen 6.1):**

```
✓ Salary payments
  As a growing business, you may need to process payroll.
```

---

**Then show optional add-ons the user can select:**

"You might also be interested in:"

| Option                    | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| ○ Salary payments         | Process payroll for your team (if not already pre-selected)   |
| ○ Credit card             | A business credit card for company expenses                   |
| ○ Business loan           | Financing to grow your business                               |
| ○ Supply chain finance    | Manage supplier payments with flexible terms                  |
| ○ Invoice management      | Create and track invoices                                     |
| ○ Point of Sale terminals | Accept in-person card payments (if not already pre-selected)  |
| ○ Online payment gateway  | Accept payments on your website (if not already pre-selected) |

**Input:** Pre-selected checkboxes (editable) + optional checkboxes
**Action:** "Confirm & Continue" button
**Next:** → 6.8

---

**Product Recommendation Logic Summary:**

| Feature                 | Auto Pre-select When                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| Local transfers         | Always                                                               |
| International transfers | international_operations = yes                                       |
| Multiuser & team access | shareholder_count > 1 OR legal_type IN [partnership, llc, fzco, fze] |
| Online payment gateway  | online_presence = yes                                                |
| Point of Sale terminals | physical_address_uae = yes AND retail/F&B activity                   |
| Salary payments         | legal_type IN [partnership, llc, fzco, fze] AND turnover > AED 500K  |
| Credit card             | Never (optional only)                                                |
| Business loan           | Never (optional only)                                                |
| Supply chain finance    | Never (optional only)                                                |
| Invoice management      | Never (optional only)                                                |

**Retail/F&B Activity Keywords:**
The following keywords in `license_activities` (from Screen 3.2) trigger POS terminal pre-selection:

- retail, shop, store, trading, supermarket, grocery, restaurant, café, cafe, coffee, food, beverage, F&B, catering, bakery, pharmacy, salon, spa, fitness, gym

---

### Screen 6.8: Plan Recommendation

**Question:** "Based on your business profile, here's the plan we recommend:"

---

**Recommendation Logic (Deterministic - first match wins):**

```
IF salary_payments selected (from Screen 6.7) → Grow Plan
ELSE IF shareholder_count > 1 (from Screen 3.7) → Grow Plan
ELSE IF legal_type IN ["partnership", "llc", "fzco", "fze"] (from Screen 3.2) → Grow Plan
ELSE IF turnover_index >= 3 (from Screen 6.1) → Grow Plan
ELSE → Essential Plan
```

---

**Display:**

**Opening Line (Dynamic):**

```
[If Essential Plan]:
"We recommend the Essential Plan for your business."

[If Grow Plan]:
"We recommend the Grow Plan for your business."
```

---

**Justification Summary (Dynamic - based on user inputs):**

Display "Here's why:" followed by a summary box containing relevant points from the user's inputs:

```
[If business_type = "freelancer"]:
• You're a freelancer operating as [permit_name from Screen 3.4]

[If business_type = "trade_license"]:
• You're operating [company_name from Screen 3.2], a [legal_type from Screen 3.2]

[If shareholder_count = 1]:
• You're the sole [If freelancer: "permit holder" / If sole_prop: "owner" / else: "shareholder"]

[If shareholder_count > 1]:
• Your company has [shareholder_count] shareholders, requiring multi-user access

[If salary_payments selected]:
• You need salary payment processing for your team

[If international_operations = yes]:
• You operate internationally in [operating_countries from Screen 5.4]

[If international_operations = no]:
• Your operations are based entirely in the UAE

[If annual_turnover displayed]:
• Your expected annual turnover is [annual_turnover from Screen 6.1]

[If online_presence = yes]:
• You have an online presence at [website_url from Screen 5.2]

[If physical_address_uae = yes]:
• You have a physical business location in the UAE
```

---

**Plan Card Display:**

```
[If Essential Plan recommended]:
┌─────────────────────────────────────────────────────────────────┐
│  Essential Plan                         AED 99  PER MONTH       │
├─────────────────────────────────────────────────────────────────┤
│  👤 Best for freelancers & small businesses                     │
│  ✓ Local transfers included                                     │
│  ✓ 2 free users                                                 │
│  ✓ AED 52.50 per Swift international transfer                   │
│  ✓ No interest on Saving Spaces                                 │
│  ✓ 10 free local transfers per month                            │
├─────────────────────────────────────────────────────────────────┤
│  [ Start with Essential Plan ]                                  │
└─────────────────────────────────────────────────────────────────┘

[If Grow Plan recommended]:
┌─────────────────────────────────────────────────────────────────┐
│  Grow Plan                              AED 249  PER MONTH      │
├─────────────────────────────────────────────────────────────────┤
│  🏢 Best for medium & large businesses                          │
│  ✓ 3 salary payment files per month                             │
│  ✓ 10 free users                                                │
│  ✓ AED 26.25 per Swift international transfer                   │
│  ✓ Up to 3% interest in Saving Spaces                           │
│  ✓ Unlimited free local transfers                               │
├─────────────────────────────────────────────────────────────────┤
│  [ Start with Grow Plan ]                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

**Alternative Plan Option:**

Below the recommended plan card:

```
"Not quite right? View the other option:"

[Expandable card showing the non-recommended plan with its features]
```

---

**Input:** Select plan button (recommended pre-selected) + option to switch
**Action:** "Continue with [Selected Plan]" button
**Next:** → 7.1

---

**Plan Details Reference:**

| Feature                | Essential Plan (AED 99/month)  | Grow Plan (AED 249/month) |
| ---------------------- | ------------------------------ | ------------------------- |
| Target audience        | Freelancers & small businesses | Medium & large businesses |
| Free users             | 2                              | 10                        |
| Local transfers        | 10 free per month              | Unlimited                 |
| SWIFT transfer fee     | AED 52.50 per transfer         | AED 26.25 per transfer    |
| Saving Spaces interest | None                           | Up to 3%                  |
| Salary payment files   | Not included                   | 3 per month               |

---

## Step 7: Review & Submit

### Screen 7.1: Review Pane

**Display:** All collected information organized in sections:

**Identity**

- Name: [value]
- Email: [value]
- Phone: [value]
- Emirates ID: [value]

**Business**

- Type: [Trade License / Freelancer]
- Company/Permit Name: [value]
- License/Permit Number: [value]
- Entity Type: [value]

**Authorization**

- Your Role: [Owner / Shareholder (X%) / Authorized Representative]

**Business Details**

- Website: [value or "None"]
- International Operations: [Yes - countries / No]
- UAE Address: [value or "None"]

**Financial Profile**

- Annual Turnover: [value]
- Monthly Deposits: [value]
- Monthly Withdrawals: [value]
- Cash Deposits: [value]%
- Cash Withdrawals: [value]%

**Selected Products & Services**

- ✓ Local transfers
- ✓ [other selected products from Screen 6.7]

**Selected Plan**

- [Essential Plan / Grow Plan] - AED [99 / 249] per month

**Documents**

- ✓ Emirates ID
- ✓ Trade License / Freelancer Permit
- ✓ MOA / Partnership Deed (if applicable)
- ✓ POA (if applicable)
- ✓ Bank Mandate (if applicable)
- ✓ Proof of Address

**Actions:**

- "Edit" links next to each section
- "Continue" button

**Next:** → 7.2

### Screen 7.2: Declaration

**Display:**
"By submitting this application, I confirm that:

- All information provided is accurate and complete
- All documents uploaded are genuine and unaltered
- I am authorized to open this account on behalf of the business
- I agree to the Terms of Service and Privacy Policy"

**Input:** Checkbox to agree
**Actions:** "Submit Application" button
**Next:** → 7.3

### Screen 7.3: Success

**Display:**
"🎉 Application Submitted!

Thank you for your application. Our team will review it within 2-3 business days.

You'll receive updates at: [email]

Application Reference: [generated reference number]"

**Actions:** "Done" button

---

## Flow Conditions Reference

### requiresPOA

```
requiresPOA = true when:
- legal_type = "sole_proprietorship" AND verified_name ≠ owner_name
- legal_type IN ["partnership", "llc", "fzco", "fze"] AND verified_name ∉ shareholder_names[]
```

### requiresBankMandate

```
requiresBankMandate = true when:
- legal_type IN ["partnership", "llc", "fzco", "fze"] AND shareholder_count > 1
```

### Plan Recommendation Logic

```
IF salary_payments selected (from Screen 6.7) → Grow Plan
ELSE IF shareholder_count > 1 (from Screen 3.7) → Grow Plan
ELSE IF legal_type IN ["partnership", "llc", "fzco", "fze"] (from Screen 3.2) → Grow Plan
ELSE IF turnover_index >= 3 (from Screen 6.1) → Grow Plan
ELSE → Essential Plan
```

### Product Pre-selection Conditions

```
preselect_international_transfers = international_operations == true
preselect_multiuser = shareholder_count > 1 OR legal_type IN ["partnership", "llc", "fzco", "fze"]
preselect_payment_gateway = online_presence == true
preselect_pos = physical_address_uae == true AND containsRetailKeywords(license_activities)
preselect_salary = legal_type IN ["partnership", "llc", "fzco", "fze"] AND turnover_index >= 3
```

Where `turnover_index` maps to:

- 0: Less than AED 100,000
- 1: AED 100,000 - 500,000
- 2: AED 500,000 - 1 million
- 3: AED 1 million - 5 million
- 4: AED 5 million - 10 million
- 5: More than AED 10 million
