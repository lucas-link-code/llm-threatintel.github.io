# Microsoft: More Than One Million CEO Impersonation Emails Used AI Consistent Invoice Templates for 50,000 Dollar ACH Fraud

**Date:** 2026-09-18
**Tags:** phishing

## Executive Summary

Microsoft Security Research published on 2026-09-10 that more than one million invoice fraud emails ran from 2026-08-03 to 2026-08-05, 87.7 percent to United States mailboxes, impersonating target CEOs and a fake ServiceNow annual subscription for an ACH payment of nearly 50,000 dollars. HTML comments, uniform section labels, em dashes, and banner lines were consistent with generative AI template work. Microsoft did not prove how much of each lure a model wrote. Hunt service-nowinc.com and domainlify.net. Do not treat ServiceNow as compromised.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | High volume CEO and ServiceNow impersonation invoice fraud, ACH theft |
| Actor / Attribution | Unnamed. Microsoft published no Storm or actor name. Confidence none |
| Target | Accounts payable and finance staff. IT services, business advisory, and consumer goods were the largest verticals. 87.7 percent of recipients in the United States |
| Vector | Third party email delivery services, lookalike domains registered 2026-07-31, display name spoof of CEO plus fabricated forwarded thread and invoice |
| Status | Burst observed 2026-08-03 to 2026-08-05. Lookalike domains remain indicators |
| First Observed | Domain registration 2026-07-31. Mail burst 2026-08-03 to 2026-08-05. Microsoft post 2026-09-10 |

## Detailed Findings

According to [Microsoft Security Research](https://www.microsoft.com/en-us/security/blog/2026/09/10/protecting-organizations-ai-assisted-executive-impersonation-invoice-fraud/), senders used multiple third party email service accounts. The visible From, reply to display name, and signature impersonated the target CEO, CFO, or president and approved the invoice below. Directly under the signature sat a fabricated ServiceNow Platform Annual Subscription invoice with invoice number, dates, currency, line items, and a bank transfer destination. Microsoft saw more than one financial institution across samples. The BILLED TO block swapped company and executive names while the invoice layout stayed static.

Under the invoice, two fake forwarded messages portrayed a conversation between the impersonated CEO and a ServiceNow president about purchase and implementation. Microsoft found no evidence that ServiceNow or the impersonated companies were breached. The ServiceNow president mailbox used gomez@service-nowinc.com on attacker registered service-nowinc.com, also printed on the invoice as the questions contact. domainlify.net, registered the same day, was the Reply-To domain.

Microsoft listed defender tells: spoofed thread From headers lacked transit fields, display names did not match addresses, subjects used due bill and a misspelled ACH Parment, nested replies were left aligned instead of indented, and the CEO both asked not to be copied and then sent the invoice from that same identity.

On generative AI, Microsoft cited extensive HTML comments, structured section labelling, and uniform construction across distinct target organizations, plus em dash characters and ASCII banner lines. Microsoft said those signals suggest generative AI involvement and do not independently establish how much of the campaign a model produced. [Decipher](https://decipher.sc/2026/09/14/here-come-the-ai-generated-bec-scams/) repeated the volume, verticals, 50,000 dollar ACH figure, and the two domains on 2026-09-14.

Microsoft also listed sender mailboxes on third party services, including notifications@uinsure.co.uk, info@tivityhealth.com, no-reply@lumalisboa.com, noreply@mctci.com, info@nuf.co.jp, info@lohnsteuerhilfe-aktuell-verein.de, info@tovimbatista.pt, contact@eemusicclass.co.uk, and info@lifeones.com. Those may be abused legitimate tenants or actor mail. They are documented here and are not added as domain IOCs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Gather Victim Org Information | T1591 | Public executive and vendor details used to personalize invoices |
| Acquire Infrastructure: Domains | T1583.001 | service-nowinc.com and domainlify.net registered 2026-07-31 |
| Phishing | T1566 | Million plus mails to finance staff |
| Spearphishing via Service | T1566.003 | Third party email delivery accounts |
| Masquerading | T1036 | CEO display names, signatures, ServiceNow invoice branding |
| Impersonation | T1656 | CEO, CFO, president, and ServiceNow president identities |
| Financial Theft | T1657 | ACH requests near 50,000 dollars |

## IOCs

Display values are defanged. JSON feed stores clean values.

### Domains

```
service-nowinc[.]com
domainlify[.]net
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
"service-nowinc.com" OR "domainlify.net"
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

On email gateway and Defender for Office 365, hunt ServiceNow invoice lures whose From or Reply-To uses service-nowinc.com or domainlify.net, CEO display names that do not match the envelope domain, subjects with due bill or ACH, and HTML with dense section comments plus ASCII banners. Alert when a purported forward lacks Received headers and is left aligned. Require out of band callback to a known number before any new ACH, especially near 50,000 dollars to a changed bank.

On DNS and proxy, denylist service-nowinc.com and domainlify.net. Do not denylist servicenow.com. Enable ZAP and spoof protection. Treat Microsoft sender mailboxes on third party domains as investigation leads, not as apex denylist entries.

## References

- [Microsoft Security] Protecting organizations from AI-assisted executive impersonation and invoice fraud (2026-09-10): https://www.microsoft.com/en-us/security/blog/2026/09/10/protecting-organizations-ai-assisted-executive-impersonation-invoice-fraud/
- [Decipher] Here Come the AI-Generated BEC Scams (2026-09-14): https://decipher.sc/2026/09/14/here-come-the-ai-generated-bec-scams/
