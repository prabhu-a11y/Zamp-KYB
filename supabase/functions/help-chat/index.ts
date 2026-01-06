import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KNOWLEDGE_BASE = `
# Wio Bank Business Account Onboarding — Knowledge Base

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

| Term | Definition |
|------|------------|
| **Emirates ID** | The national identity card issued by the UAE Federal Authority for Identity and Citizenship. Required for all UAE residents. |
| **Trade License** | A legal document issued by UAE authorities (DED, free zones) permitting a business to operate specific commercial activities. |
| **Freelancer Permit** | A license allowing individuals to work independently in the UAE without forming a company. Issued by various free zones. |
| **MOA (Memorandum of Association)** | A legal document that defines the company's constitution, shareholders, and ownership structure. Required for LLCs, FZEs, and FZCOs. |
| **Partnership Deed** | A legal agreement between partners outlining ownership percentages, responsibilities, and profit-sharing arrangements. |
| **POA (Power of Attorney)** | A legal document authorizing one person to act on behalf of another (or a company) for specific purposes. |
| **Bank Mandate** | A document specifying who has authority to operate a bank account and sign on behalf of a company. |
| **KYC (Know Your Customer)** | Regulatory requirements for banks to verify the identity and background of their customers. |
| **AML (Anti-Money Laundering)** | Regulations and procedures to prevent money laundering and financial crimes. |
| **Sole Proprietorship** | A business owned and operated by a single individual with no legal distinction between owner and business. |
| **LLC (Limited Liability Company)** | A corporate structure where owners have limited personal liability for business debts. |
| **FZE (Free Zone Establishment)** | A single-shareholder company established in a UAE free zone. |
| **FZCO (Free Zone Company)** | A multi-shareholder company established in a UAE free zone. |
| **DED (Department of Economic Development)** | The mainland licensing authority in various UAE emirates. |
| **Shareholder** | A person or entity that owns shares/equity in a company. |
| **Signatory** | A person authorized to sign documents and conduct transactions on behalf of a company. |
| **OTP (One-Time Password)** | A temporary code sent via SMS or email for verification purposes. |

---

## Document Reference Guide

### Emirates ID
- Required for all applicants
- Must be valid (not expired)
- Extracts: Full Name, ID Number, Nationality, Date of Birth, Expiry Date

### Trade License
- Required for all business applicants (not freelancers)
- Must be valid (not expired)
- Extracts: Business Name, License Number, Issuing Authority, Legal Type, Activities, Expiry Date

### Freelancer Permit
- Required only for freelancers
- Must be valid (not expired)
- Extracts: Full Name, Permit Number, Issuing Authority, Activity, Expiry Date

### Memorandum of Association (MOA)
- Required for LLC, FZE, FZCO
- Extracts: Shareholder Names, Nationalities, Ownership Percentages

### Partnership Deed
- Required for Partnerships
- Extracts: Partner Names, Nationalities, Ownership Percentages

### Power of Attorney (POA)
- Required when applicant is not a shareholder/owner
- Must be signed by a shareholder, notarized, and valid

### Bank Mandate
- Required for companies with multiple shareholders (Partnership, LLC, FZCO)
- Specifies signatories and authority levels

### Proof of Address
- Required for all applicants
- Accepted: Utility bill (3 months), Bank statement (3 months), Valid tenancy contract

---

## Business Entity Types

| Type | POA Required? | Bank Mandate Required? |
|------|--------------|----------------------|
| Sole Proprietorship | Only if applicant ≠ owner | No |
| Partnership | Only if applicant ≠ partner | Yes (multiple partners) |
| LLC | Only if applicant ≠ shareholder | Only if >1 shareholder |
| FZE | Only if applicant ≠ shareholder | No (single shareholder) |
| FZCO | Only if applicant ≠ shareholder | Yes (multiple shareholders) |
| Freelancer | N/A | N/A |

---

## Onboarding Flow Summary

1. **Identity Verification** - Emirates ID verification via OTP
2. **Account Credentials** - Set up password
3. **Business Type Selection** - Trade License Holder or Freelancer
4. **Document Upload** - Trade License/Freelancer Permit, MOA/Partnership Deed
5. **Business Details** - Address, operations, activities
6. **Financial Profile** - Turnover, products, plan selection
7. **Review & Submit** - Declaration and submission

---

## Product & Plan Recommendations

### Available Products
- Local Transfers
- International Transfers
- Salary Payments (WPS)
- Business Cards
- POS Terminals
- Payment Links

### Banking Plans

**Essential Plan** - AED 99/month
- Basic banking features
- Good for simple operations

**Grow Plan** - AED 249/month (Recommended for):
- Salary payments needed
- Multiple shareholders
- Partnership/LLC/FZCO/FZE structures
- Annual turnover ≥ AED 1M
- International operations

---

## Restricted Industries

Wio Bank cannot open accounts for:
- Money exchange/currency trading
- Gambling/betting
- Cryptocurrency/virtual assets
- Adult entertainment
- Weapons/ammunition
- Tobacco products
- Precious metals/stones trading
- Political/religious organizations
- Shell companies

---

## Frequently Asked Questions

**Q: How long does the application take?**
A: 15-30 minutes for application, 2-3 business days for approval.

**Q: What if my trade license is expired?**
A: You must provide a valid, non-expired trade license.

**Q: Do I need all documents at once?**
A: Yes, have all required documents ready before starting.

**Q: Can someone else apply on behalf of my company?**
A: Yes, with a valid Power of Attorney from a shareholder.

**Q: What's the difference between Essential and Grow plans?**
A: Grow Plan offers more features for larger businesses with multiple shareholders or higher turnover.

**Q: Can I change my plan later?**
A: Plan changes can be discussed after account opening.

**Q: What if I'm not a shareholder?**
A: You'll need a Power of Attorney from a shareholder authorizing you.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    const contextSection = context ? `
${context}
` : "";

    const systemPrompt = `You are a helpful assistant for Wio Bank's business account onboarding process. Your name is "Pace Assistant".

IMPORTANT INSTRUCTIONS:
1. Use ONLY the knowledge base below to answer questions
2. If the answer is not in the knowledge base, politely say you don't have that specific information and suggest they contact Wio Bank support
3. Be concise, friendly, and professional
4. Use simple language suitable for business owners and freelancers
5. When mentioning documents, briefly explain what they are if relevant
6. Format responses with bullet points or short paragraphs for readability
7. When the user asks contextual questions like "why do I need this?", "what is this for?", or "is this normal?", use the CURRENT USER CONTEXT section to provide a personalized, specific answer
8. Reference their business type and collected data when relevant to make answers more helpful
${contextSection}
KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Help chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
