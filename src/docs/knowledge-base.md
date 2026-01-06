# Wio Bank Business Account Onboarding — Knowledge Base

## Table of Contents

1. [Overview](#overview)
2. [Glossary of Terms](#glossary-of-terms)
3. [Document Reference Guide](#document-reference-guide)
4. [Business Entity Types](#business-entity-types)
5. [Onboarding Flow Summary](#onboarding-flow-summary)
6. [Authorization & Signing Authority](#authorization--signing-authority)
7. [Product & Plan Recommendations](#product--plan-recommendations)
8. [Restricted Industries](#restricted-industries)
9. [Frequently Asked Questions](#frequently-asked-questions)

---

## Overview

Wio Bank is a UAE-based digital bank offering business accounts to companies and freelancers operating in the United Arab Emirates. The onboarding process is a multi-step digital application that verifies identity, collects business documentation, determines authorization requirements, and recommends appropriate banking products.

### Who Can Apply?

- **Freelancers** with a valid UAE freelancer permit
- **Business owners** with a valid UAE trade license
- Legal entity types supported: Sole Proprietorship, Partnership, LLC, FZE, FZCO

### Onboarding Duration

The digital application typically takes 15–30 minutes to complete. Account approval takes 2–3 business days after submission.

---

## Glossary of Terms

| Term                                         | Definition                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Emirates ID**                              | The national identity card issued by the UAE Federal Authority for Identity and Citizenship. Required for all UAE residents.         |
| **Trade License**                            | A legal document issued by UAE authorities (DED, free zones) permitting a business to operate specific commercial activities.        |
| **Freelancer Permit**                        | A license allowing individuals to work independently in the UAE without forming a company. Issued by various free zones.             |
| **MOA (Memorandum of Association)**          | A legal document that defines the company's constitution, shareholders, and ownership structure. Required for LLCs, FZEs, and FZCOs. |
| **Partnership Deed**                         | A legal agreement between partners outlining ownership percentages, responsibilities, and profit-sharing arrangements.               |
| **POA (Power of Attorney)**                  | A legal document authorizing one person to act on behalf of another (or a company) for specific purposes.                            |
| **Bank Mandate**                             | A document specifying who has authority to operate a bank account and sign on behalf of a company.                                   |
| **KYC (Know Your Customer)**                 | Regulatory requirements for banks to verify the identity and background of their customers.                                          |
| **AML (Anti-Money Laundering)**              | Regulations and procedures to prevent money laundering and financial crimes.                                                         |
| **Sole Proprietorship**                      | A business owned and operated by a single individual with no legal distinction between owner and business.                           |
| **LLC (Limited Liability Company)**          | A corporate structure where owners have limited personal liability for business debts.                                               |
| **FZE (Free Zone Establishment)**            | A single-shareholder company established in a UAE free zone.                                                                         |
| **FZCO (Free Zone Company)**                 | A multi-shareholder company established in a UAE free zone.                                                                          |
| **DED (Department of Economic Development)** | The mainland licensing authority in various UAE emirates.                                                                            |
| **Shareholder**                              | A person or entity that owns shares/equity in a company.                                                                             |
| **Signatory**                                | A person authorized to sign documents and conduct transactions on behalf of a company.                                               |
| **OTP (One-Time Password)**                  | A temporary code sent via SMS or email for verification purposes.                                                                    |

---

## Document Reference Guide

### 1. Emirates ID

#### What Is It?

The Emirates ID is the UAE's national identity card, issued to all citizens and residents by the Federal Authority for Identity, Citizenship, Customs and Port Security (ICP).

#### Why Is It Required?

- **Identity verification**: Confirms you are who you claim to be
- **Regulatory compliance**: UAE banking regulations require KYC verification using Emirates ID
- **Data extraction**: Provides verified personal information (name, nationality, date of birth)

#### Information Extracted

| Field         | Description                        |
| ------------- | ---------------------------------- |
| Full Name     | As registered with UAE authorities |
| ID Number     | Unique 15-digit identifier         |
| Nationality   | Country of citizenship             |
| Date of Birth | For age verification               |
| Expiry Date   | Document must be valid             |

#### Requirements

- Must be valid (not expired)
- Clear, readable scan or photo
- Both sides may be required
- Accepted formats: PDF, JPG, PNG

---

### 2. Trade License

#### What Is It?

A trade license is an official document issued by UAE authorities that permits a business to conduct specific commercial activities within a defined jurisdiction.

#### Why Is It Required?

- **Business verification**: Proves your business is legally registered in the UAE
- **Activity validation**: Confirms what your business is permitted to do
- **Entity type identification**: Determines the legal structure (LLC, sole proprietorship, etc.)
- **Compliance**: Ensures the business is not in a restricted industry

#### Who Needs It?

All business account applicants except freelancers (who provide a Freelancer Permit instead).

#### Information Extracted

| Field             | Description                                      |
| ----------------- | ------------------------------------------------ |
| Business Name     | Legal registered name of the company             |
| License Number    | Unique identifier for the trade license          |
| Issuing Authority | DED, free zone authority, etc.                   |
| Legal Type        | Sole proprietorship, LLC, partnership, FZE, FZCO |
| Activities        | Licensed business activities                     |
| Expiry Date       | Must be valid                                    |

#### Issuing Authorities

- **Mainland**: Department of Economic Development (DED) in each emirate
- **Free Zones**: DMCC, JAFZA, DIFC, ADGM, RAK FTZ, Sharjah Media City, etc.

#### Requirements

- Must be valid (not expired)
- Clear, legible copy
- All pages if multi-page document
- Accepted formats: PDF, JPG, PNG

---

### 3. Freelancer Permit

#### What Is It?

A freelancer permit (also called a freelance license or freelance visa) allows individuals to work independently in the UAE without establishing a company. It is issued by various UAE free zones.

#### Why Is It Required?

- **Identity & business verification**: Confirms you are a registered freelancer
- **Activity validation**: Shows what services you are permitted to offer
- **Sole operator confirmation**: Establishes you as the only person authorized to operate the account

#### Who Needs It?

Applicants who select "I'm a Freelancer" as their business type.

#### Information Extracted

| Field             | Description                           |
| ----------------- | ------------------------------------- |
| Full Name         | Name of the permit holder             |
| Permit Number     | Unique identifier                     |
| Issuing Authority | Free zone that issued the permit      |
| Activity          | Permitted freelance activity/services |
| Expiry Date       | Must be valid                         |

#### Common Issuing Authorities

- Dubai Media City
- Dubai Internet City
- twofour54 (Abu Dhabi)
- Sharjah Media City (Shams)
- Ajman Free Zone
- RAK Free Zone
- Fujairah Creative City

#### Requirements

- Must be valid (not expired)
- Clear, legible copy
- Accepted formats: PDF, JPG, PNG

---

### 4. Memorandum of Association (MOA)

#### What Is It?

The Memorandum of Association is a legal document that establishes a company and defines its constitution. It includes information about shareholders, share distribution, company objectives, and governance rules.

#### Why Is It Required?

- **Shareholder verification**: Identifies all owners and their ownership percentages
- **Authorization determination**: Helps determine if the applicant has authority to open the account
- **Compliance**: Required for KYC/AML regulations

#### Who Needs It?

Businesses with the following legal types:

- LLC (Limited Liability Company)
- FZE (Free Zone Establishment)
- FZCO (Free Zone Company)

#### Information Extracted

| Field                 | Description                             |
| --------------------- | --------------------------------------- |
| Shareholder Names     | All individuals/entities with ownership |
| Nationalities         | Nationality of each shareholder         |
| Ownership Percentages | Share distribution among owners         |

#### Requirements

- Certified/attested copy
- Must reflect current shareholding structure
- All pages required
- Accepted formats: PDF, JPG, PNG

---

### 5. Partnership Deed

#### What Is It?

A partnership deed is a legal agreement between two or more partners that outlines the terms of their business relationship, including ownership shares, responsibilities, profit distribution, and decision-making authority.

#### Why Is It Required?

- **Partner verification**: Identifies all partners and their stakes
- **Authorization determination**: Establishes who can act on behalf of the partnership
- **Compliance**: Required for KYC/AML regulations

#### Who Needs It?

Businesses registered as **Partnerships**.

#### Information Extracted

| Field                 | Description                            |
| --------------------- | -------------------------------------- |
| Partner Names         | All partners in the business           |
| Nationalities         | Nationality of each partner            |
| Ownership Percentages | Profit/ownership share of each partner |

#### Requirements

- Certified/attested copy
- Must be current and valid
- All pages required
- Accepted formats: PDF, JPG, PNG

---

### 6. Power of Attorney (POA)

#### What Is It?

A Power of Attorney is a legal document that authorizes one person (the "grantee" or "attorney-in-fact") to act on behalf of another person or company (the "grantor") for specified purposes.

#### Why Is It Required?

When the person applying for the account is **not** a shareholder or owner of the business, they need legal authorization to act on behalf of the company. The POA provides this authorization.

#### Who Needs It?

Applicants who meet **any** of these conditions:

- Sole proprietorship: Applicant's name does not match the owner's name
- Partnership/LLC/FZE/FZCO: Applicant's name does not appear in the shareholder list

#### Information Extracted

| Field                | Description                                       |
| -------------------- | ------------------------------------------------- |
| Granted By (Grantor) | The shareholder/owner giving authorization        |
| Granted To (Grantee) | The applicant receiving authorization             |
| Scope                | What actions the grantee is authorized to perform |
| Date Issued          | When the POA was created                          |
| Expiry Date          | When the POA expires (if applicable)              |
| Notarized            | Whether the document is notarized                 |

#### Requirements

- Must be signed by a shareholder listed in MOA/Partnership Deed
- Must explicitly authorize banking/account operations
- Should be notarized for validity
- Must be valid (not expired)
- Accepted formats: PDF, JPG, PNG

---

### 7. Bank Mandate

#### What Is It?

A bank mandate (also called a board resolution for banking or signatory authority document) specifies who has the authority to operate a company's bank account, including transaction limits and signing requirements.

#### Why Is It Required?

When a company has **multiple shareholders**, the bank needs clarity on:

- Who can authorize transactions
- Whether single or joint signatures are required
- Transaction limits for each signatory

#### Who Needs It?

Companies that meet **all** of these conditions:

- Legal type is Partnership, LLC, FZE, or FZCO
- There is more than one shareholder

#### Who Does NOT Need It?

- Freelancers (sole operator)
- Sole proprietorships (single owner)
- Companies with only one shareholder

#### Requirements

- Must be signed by shareholders/directors
- Should specify signatories and their authority levels
- Accepted formats: PDF, JPG, PNG

---

### 8. Proof of Address

#### What Is It?

A document that verifies where the applicant currently resides in the UAE.

#### Why Is It Required?

- **Regulatory compliance**: KYC requirements mandate address verification
- **Communication**: Ensures bank correspondence reaches the customer
- **Risk assessment**: Part of customer due diligence

#### Accepted Documents

| Document Type    | Requirements                                                   |
| ---------------- | -------------------------------------------------------------- |
| Utility Bill     | Electricity, water, or telecom bill dated within last 3 months |
| Bank Statement   | From any UAE bank, dated within last 3 months                  |
| Tenancy Contract | Valid Ejari or equivalent rental agreement                     |

#### Requirements

- Must show applicant's name and UAE address
- Must be dated within last 3 months (utility bills, bank statements)
- Must be currently valid (tenancy contracts)
- Accepted formats: PDF, JPG, PNG

---

## Business Entity Types

### Sole Proprietorship

| Attribute                  | Details                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| **Definition**             | A business owned by one individual with no legal separation between owner and business |
| **Shareholders**           | N/A — single owner                                                                     |
| **Required Documents**     | Emirates ID, Trade License, Proof of Address                                           |
| **POA Required?**          | Only if applicant is not the owner                                                     |
| **Bank Mandate Required?** | No                                                                                     |

### Partnership

| Attribute                  | Details                                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| **Definition**             | A business owned by two or more partners sharing profits and liabilities |
| **Shareholders**           | 2 or more partners                                                       |
| **Required Documents**     | Emirates ID, Trade License, Partnership Deed, Proof of Address           |
| **POA Required?**          | Only if applicant is not a listed partner                                |
| **Bank Mandate Required?** | Yes (multiple partners need signing authority clarity)                   |

### LLC (Limited Liability Company)

| Attribute                  | Details                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------ |
| **Definition**             | A company where shareholders have limited liability up to their capital contribution |
| **Shareholders**           | 1 or more (mainland typically requires 1+, free zones vary)                          |
| **Required Documents**     | Emirates ID, Trade License, MOA, Proof of Address                                    |
| **POA Required?**          | Only if applicant is not a listed shareholder                                        |
| **Bank Mandate Required?** | Only if more than 1 shareholder                                                      |

### FZE (Free Zone Establishment)

| Attribute                  | Details                                                     |
| -------------------------- | ----------------------------------------------------------- |
| **Definition**             | A single-shareholder company established in a UAE free zone |
| **Shareholders**           | 1 (by definition)                                           |
| **Required Documents**     | Emirates ID, Trade License, MOA, Proof of Address           |
| **POA Required?**          | Only if applicant is not the shareholder                    |
| **Bank Mandate Required?** | No (single shareholder)                                     |

### FZCO (Free Zone Company)

| Attribute                  | Details                                                    |
| -------------------------- | ---------------------------------------------------------- |
| **Definition**             | A multi-shareholder company established in a UAE free zone |
| **Shareholders**           | 2 or more                                                  |
| **Required Documents**     | Emirates ID, Trade License, MOA, Proof of Address          |
| **POA Required?**          | Only if applicant is not a listed shareholder              |
| **Bank Mandate Required?** | Yes (multiple shareholders)                                |

### Freelancer

| Attribute                  | Details                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------ |
| **Definition**             | An individual licensed to provide services independently without a company structure |
| **Shareholders**           | N/A — individual permit holder                                                       |
| **Required Documents**     | Emirates ID, Freelancer Permit, Proof of Address                                     |
| **POA Required?**          | No (permit holder has full authority)                                                |
| **Bank Mandate Required?** | No (sole operator)                                                                   |

---

## Onboarding Flow Summary

### Step 1: Identity Verification

1. Enter full name
2. Enter and verify email (OTP)
3. Enter and verify phone number (OTP)
4. Create password
5. Upload Emirates ID
6. Confirm extracted Emirates ID data

### Step 2: Eligibility Check

1. Select business type (Trade License or Freelancer)
2. Confirm business is not in restricted industries

### Step 3: Document Upload

1. Upload Trade License OR Freelancer Permit
2. Confirm extracted business data
3. If applicable: Upload MOA or Partnership Deed
4. Confirm extracted shareholder data

### Step 4: Authorization

1. System determines if applicant is shareholder/owner
2. If not: Upload Power of Attorney
3. If multiple shareholders: Upload Bank Mandate
4. Upload Proof of Address

### Step 5: Business Details

1. Online presence (website URL if yes)
2. International operations (countries if yes)
3. Physical presence abroad
4. UAE business address

### Step 6: Financial Profile

1. Expected annual turnover
2. Sources of funds
3. Monthly deposit volume
4. Monthly withdrawal volume
5. Cash deposit percentage
6. Cash withdrawal percentage
7. Review product recommendations
8. Select banking plan

### Step 7: Review & Submit

1. Review all information
2. Accept declarations
3. Submit application

---

## Authorization & Signing Authority

### How Authorization Is Determined

The system compares the **verified name** (from Emirates ID) against business ownership records:

```
IF applicant name matches owner/shareholder name:
    → Applicant is authorized
    → POA not required

IF applicant name does NOT match any owner/shareholder:
    → Applicant is NOT automatically authorized
    → POA required
```

### When POA Is Required

| Scenario                                      | POA Required? |
| --------------------------------------------- | ------------- |
| Freelancer (applicant is permit holder)       | No            |
| Sole proprietorship (applicant is owner)      | No            |
| Sole proprietorship (applicant is NOT owner)  | **Yes**       |
| Partnership (applicant is a partner)          | No            |
| Partnership (applicant is NOT a partner)      | **Yes**       |
| LLC/FZE/FZCO (applicant is a shareholder)     | No            |
| LLC/FZE/FZCO (applicant is NOT a shareholder) | **Yes**       |

### When Bank Mandate Is Required

| Scenario                   | Bank Mandate Required? |
| -------------------------- | ---------------------- |
| Freelancer                 | No                     |
| Sole proprietorship        | No                     |
| Single-shareholder LLC/FZE | No                     |
| Partnership (2+ partners)  | **Yes**                |
| LLC/FZCO (2+ shareholders) | **Yes**                |

---

## Product & Plan Recommendations

### Available Products

| Product                 | Description                              | Auto-Selected When                          |
| ----------------------- | ---------------------------------------- | ------------------------------------------- |
| Local Transfers         | Transfer money within UAE                | Always included                             |
| International Transfers | SWIFT transfers abroad                   | International operations = Yes              |
| Multi-user Access       | Multiple team members can access account | 2+ shareholders OR corporate entity         |
| Online Payment Gateway  | Accept payments on website               | Has website                                 |
| POS Terminals           | Accept in-person card payments           | Physical UAE location + retail/F&B activity |
| Salary Payments         | Process employee payroll                 | Corporate entity + turnover > AED 500K      |
| Credit Card             | Business credit card                     | Optional add-on                             |
| Business Loan           | Financing options                        | Optional add-on                             |
| Supply Chain Finance    | Supplier payment management              | Optional add-on                             |
| Invoice Management      | Create and track invoices                | Optional add-on                             |

### Retail/F&B Keywords for POS Pre-selection

If the trade license activities contain any of these keywords, POS terminals are pre-selected:

- retail, shop, store, trading, supermarket, grocery
- restaurant, café, cafe, coffee, food, beverage, F&B, catering, bakery
- pharmacy, salon, spa, fitness, gym

### Banking Plans

#### Essential Plan — AED 99/month

**Best for:** Freelancers and small businesses

| Feature                | Included               |
| ---------------------- | ---------------------- |
| Free users             | 2                      |
| Local transfers        | 10 free per month      |
| SWIFT transfer fee     | AED 52.50 per transfer |
| Saving Spaces interest | None                   |
| Salary payment files   | Not included           |

#### Grow Plan — AED 249/month

**Best for:** Medium and large businesses

| Feature                | Included               |
| ---------------------- | ---------------------- |
| Free users             | 10                     |
| Local transfers        | Unlimited              |
| SWIFT transfer fee     | AED 26.25 per transfer |
| Saving Spaces interest | Up to 3%               |
| Salary payment files   | 3 per month            |

### Plan Recommendation Logic

The system recommends **Grow Plan** if ANY of these are true:

1. Salary payments product is selected
2. Company has more than 1 shareholder
3. Legal type is Partnership, LLC, FZE, or FZCO
4. Expected annual turnover ≥ AED 1 million

Otherwise, **Essential Plan** is recommended.

---

## Restricted Industries

Wio Bank cannot open accounts for businesses in the following industries:

| Industry                                | Reason                                    |
| --------------------------------------- | ----------------------------------------- |
| **Jewelry and precious metals trading** | High risk for money laundering            |
| **Cryptocurrency and virtual assets**   | Regulatory uncertainty, high risk         |
| **Money exchange and remittance**       | Requires special licensing, high AML risk |
| **Gambling and gaming**                 | Legal restrictions in UAE                 |
| **Weapons and ammunition**              | Regulatory restrictions                   |
| **Adult entertainment**                 | Legal restrictions in UAE                 |

Applicants must confirm their business is not in any restricted industry before proceeding with the application.

---

## Frequently Asked Questions

### General Questions

**Q: How long does the application take?**
A: The digital application takes 15–30 minutes. Account approval takes 2–3 business days.

**Q: Can I save my progress and continue later?**
A: Contact Wio Bank support for information on application persistence.

**Q: What if my documents are not in English?**
A: Documents should be in English or Arabic. Translated documents may need to be attested.

### Document Questions

**Q: Why do I need to upload my Emirates ID?**
A: Emirates ID is required by UAE banking regulations for identity verification (KYC). It confirms your identity and provides verified personal information.

**Q: What is a Trade License and why is it required?**
A: A trade license is your business's legal permit to operate in the UAE. It proves your business is registered, identifies your legal structure, and confirms your permitted activities.

**Q: What's the difference between a Trade License and a Freelancer Permit?**
A: A trade license is for registered businesses (companies), while a freelancer permit is for individuals working independently. Freelancers don't have a company structure.

**Q: Why do I need to provide an MOA?**
A: The Memorandum of Association identifies all shareholders and their ownership percentages. This is required for LLCs, FZEs, and FZCOs to verify ownership and determine authorization.

**Q: When is a Power of Attorney needed?**
A: A POA is needed when the person applying for the account is not listed as an owner or shareholder. It provides legal authorization to act on behalf of the company.

**Q: Why is a Bank Mandate required for my company?**
A: When a company has multiple shareholders, the bank needs to know who can authorize transactions. The bank mandate specifies signing authority.

**Q: What documents are accepted as Proof of Address?**
A: Utility bills (within 3 months), bank statements (within 3 months), or valid tenancy contracts (Ejari).

### Authorization Questions

**Q: How do I know if I'm authorized to open the account?**
A: If your name (from Emirates ID) matches a shareholder name in the MOA/Partnership Deed, or if you're the owner/permit holder, you're authorized. Otherwise, you'll need a POA.

**Q: I'm the company manager but not a shareholder. Can I open the account?**
A: Yes, but you'll need a Power of Attorney signed by a shareholder authorizing you to open and operate the bank account.

**Q: Why doesn't my freelancer business need a Bank Mandate?**
A: As a freelancer, you're the sole operator of your business. There are no other shareholders who need signing authority.

### Product & Plan Questions

**Q: Why was Grow Plan recommended for my business?**
A: Grow Plan is recommended for businesses that need salary processing, have multiple shareholders, are structured as corporate entities (LLC, Partnership, etc.), or have turnover exceeding AED 1 million.

**Q: Can I change my plan later?**
A: Contact Wio Bank support for information on plan changes after account opening.

**Q: Why were certain products pre-selected for me?**
A: Products are pre-selected based on your business profile. For example, if you operate internationally, international transfers are pre-selected. You can modify these selections.

### Eligibility Questions

**Q: My business is in cryptocurrency. Can I open an account?**
A: No, cryptocurrency and virtual asset businesses are on the restricted industries list and cannot open accounts with Wio Bank.

**Q: I have multiple businesses. Can I open multiple accounts?**
A: Each business would require a separate application with its own trade license and documentation.

---

## Document Checklist by Business Type

### Freelancer

- [ ] Emirates ID
- [ ] Freelancer Permit
- [ ] Proof of Address

### Sole Proprietorship (Owner Applying)

- [ ] Emirates ID
- [ ] Trade License
- [ ] Proof of Address

### Sole Proprietorship (Non-Owner Applying)

- [ ] Emirates ID
- [ ] Trade License
- [ ] Power of Attorney
- [ ] Proof of Address

### Partnership / LLC / FZCO (Shareholder Applying)

- [ ] Emirates ID
- [ ] Trade License
- [ ] MOA or Partnership Deed
- [ ] Bank Mandate (if 2+ shareholders)
- [ ] Proof of Address

### Partnership / LLC / FZCO (Non-Shareholder Applying)

- [ ] Emirates ID
- [ ] Trade License
- [ ] MOA or Partnership Deed
- [ ] Power of Attorney
- [ ] Bank Mandate (if 2+ shareholders)
- [ ] Proof of Address

### FZE (Single Shareholder, Shareholder Applying)

- [ ] Emirates ID
- [ ] Trade License
- [ ] MOA
- [ ] Proof of Address

### FZE (Single Shareholder, Non-Shareholder Applying)

- [ ] Emirates ID
- [ ] Trade License
- [ ] MOA
- [ ] Power of Attorney
- [ ] Proof of Address

---

_Last Updated: December 2024_
_Version: 1.0_
