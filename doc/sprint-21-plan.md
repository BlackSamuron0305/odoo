# Sprint 21 — Print Layouts & Email Templates

> Sprint Goal: Modernize Odoo's print output — QWeb report layouts, PDF invoice/order designs, printed pages — and the email template system, producing professional, brand-consistent print and email output that companies are proud to send to customers.
> Branch: `feature/sprint-21`
> Depends on: Sprint 0 (tokens), Sprint 12 (typography), Sprint 17 (portal document detail)

---

## Context

Odoo generates PDFs and sends emails constantly in business workflows: invoices, purchase orders, delivery notes, sales quotes, payment confirmations, HR payslips, manufacturing orders. These are often the only external-facing documents customers and vendors receive.

Currently, Odoo's default report layouts use a minimal Bootstrap-based HTML-to-PDF design that looks dated — similar to Microsoft Word 2007 output. The email templates are even more basic.

This sprint modernizes the **print layer** — the SCSS and XML templates that define how reports render — and the **email layout** — the HTML email wrapper templates.

**Important constraints:**
- PDF generation uses `wkhtmltopdf` (HTML→PDF). CSS support is limited: no CSS Grid, no flexbox (partially), no CSS custom properties in PDFs. SCSS must output static values, not `var(--o-*)` references.
- Email HTML must be table-based (Gmail, Outlook compatibility). No `div` layout, no CSS Grid, no external fonts.
- A build step (`tokens/build.js`) should be extended to output static SCSS values resolved from tokens for use in print/email.

**Files in scope:**
- `addons/web/static/src/css/` — look for existing report.css/scss
- `addons/base/static/src/scss/` — base report styles if present
- `addons/account/static/src/` — invoice/bill report
- `addons/web/report_templates/` — look for base report QWeb templates
- `addons/mail/templates/` — email layout templates
- `addons/mail/static/src/scss/` — email-specific SCSS

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Print/email audit | Milo | Locate all QWeb report SCSS files across: `addons/web/`, `addons/account/`, `addons/sale/`, `addons/purchase/`, `addons/stock/`, `addons/hr/`. Locate the base email template (`mail_base_message.html` or equivalent). Document all files in `doc/sprint-21-audit.md` |
| 2 | Token build — static output | Nova | Extend `tokens/build.js` to generate a third output: `tokens/_tokens.print.scss` — all token values output as **static SCSS variables** (not CSS custom properties, not `var()`). E.g., `$o-print-brand-primary: #71639e;`. These are used in print/email SCSS where CSS custom properties cannot be used |
| 3 | Report base layout | Milo | Base report SCSS (applied to all reports): page size `A4`, `margin: 15mm 18mm`. Header: company logo (left, max 60mm wide) + company name/address (right). Footer: page number (`Page X of Y`) right-aligned + company website center. Header/footer: `position: fixed` with `@page` rules |
| 4 | Report typography | Milo | Print body: `font-family: Arial, Helvetica, sans-serif` (safe for wkhtmltopdf). Base: 10pt. Headings: h1=16pt/700, h2=14pt/600, h3=12pt/600. Line-height: 1.4. All sizes in `pt` not `px` for print |
| 5 | Invoice / bill report | Milo | `addons/account/` report SCSS: Document title block (left): "INVOICE" / "BILL" in large bold. Reference number: prominent. Customer address block: clean 2-column layout (bill-to left, bill-from right). Document date, due date: clear labels. Item table: clean, minimal border (header row only). Line item: description (65%) + qty (10%) + unit price (12%) + total (13%). Subtotal / Tax / Total: right-aligned, increasing weight |
| 6 | Invoice status bands | Milo | Status banner across top of invoice: "PAID" (green diagonal band, right corner), "OVERDUE" (red band), "DRAFT" (gray band with diagonal stripes). These are purely print-CSS ribbon effects (no JS) |
| 7 | Sales quote report | Milo | Quote report: same base as invoice but with "QUOTATION" title, validity date, salesperson signature block at bottom. Product images optional (shown as 40mm × 40mm thumbnail if `show_product_image` is enabled) |
| 8 | Delivery / packing slip | Milo | Delivery note: compact (less whitespace than invoice — warehouse workers glance at it). Large barcode area (centered, 60mm × 25mm). Product table: reference / description / qty. Bold total quantities. Large "DONE" or "BACKORDER" stamp |
| 9 | Purchase order report | Milo | PO report: vendor address block. "PURCHASE ORDER" title. PO number + buyer reference. Line items same structure as invoice. "Approved By" signature field at bottom |
| 10 | Payslip report | Milo | HR payslip: employee photo + details header. Earnings / Deductions sections in two-column table. Net pay: large, boxed, right side. Hours worked summary |
| 11 | Report QR code | Milo | All reports with `QR code` fields (invoices with payment QR, delivery tracking QR): QR image centered in a clean bordered box (1px solid `$o-print-gray-300`). Below: small caption text |
| 12 | Email layout base | Milo | Email wrapper template: single-column, max-width 600px, white background, centered. Header: brand-color bar (24px) at top. Company logo: centered below header bar, max 200px wide. Footer: gray section with company name, address, unsubscribe link. All in HTML tables (not div/flex) |
| 13 | Transactional email templates | Milo | Odoo sends typed emails (Invoice ready, Quote sent, Meeting invitation, etc.). Each needs: header with email-type icon (inline SVG or emoji fallback) + title. Body: clean paragraph. CTA button: HTML table-based button, brand-primary background, white text, 18px font, 48px height, `border-radius: 6px` via inline CSS (outlook compatible). Footer: standard |
| 14 | Email button component | Milo | Reusable HTML email button (table-based for Outlook): `<table><tr><td style="background: #71639e; border-radius: 6px; padding: 14px 28px;"><a style="color: #fff; text-decoration: none; font-size: 16px; font-weight: 600;">Button Text</a></td></tr></table>`. Document the pattern for all email templates to use |
| 15 | Invoice email design | Milo | The email sent with invoice attached: invoice summary inline (not just attachment). Amount due block: large (`font-size: 28px`), brand-color. Due date: prominent. CTA: "View Invoice" → portal link. CTA: "Pay Now" → payment portal link |
| 16 | Print dark mode exclusion | Milo | Ensure `@media print` rules explicitly force white background, black text throughout the app. Some Sprint 4 dark mode styles may carry over to print. Add `@media print { body { background: white !important; color: black !important; } }` and audit all dark-mode variables for print overrides |
| 17 | Regression QA | Ivy | Generate PDFs: invoice (paid + overdue + draft), quote, delivery note, purchase order. Verify header/footer on multi-page documents. Send test emails: check in Gmail, Outlook (web), Apple Mail. Verify CTA button renders correctly. Verify print-mode `@media print` from browser |

---

## Work Schedule

### Phase 1: Foundation (Tasks 1–4)
- Audit, static token output, base layout, typography
- **Checkpoint commit**: `sprint-21: print foundation and token static output`

### Phase 2: Report Documents (Tasks 5–11)
- Invoice, quote, delivery, PO, payslip, QR code
- **Checkpoint commit**: `sprint-21: all report document layouts`

### Phase 3: Email System (Tasks 12–15)
- Email base, transactional templates, button, invoice email
- **Checkpoint commit**: `sprint-21: email template system`

### Phase 4: Polish & QA (Tasks 16–17)
- Print dark mode exclusion, regression QA
- **Final commit**: `sprint-21: print and email QA signoff`

---

## Design Specifications

### Print Typography (wkhtmltopdf safe)
```
Font family:  Arial, Helvetica, sans-serif
Base size:    10pt
H1:           16pt / 700
H2:           14pt / 600
H3:           12pt / 600
Line-height:  1.4
Color:        #212529 (not var(), static value)
```

### Invoice Layout Proportions
```
Page:         A4, margin: 15mm 18mm
Header:       30mm height
Logo:         max 60mm wide × 25mm tall
Title block:  1/3 page width (left)
Address block: 2/3 page width (two columns)
Table header: background #f8f9fa, border-bottom: 1px solid #dee2e6
```

### Email Max Width
```
Outer:        100% with max-width: 600px
Content:      100% with padding: 0 24px
Header bar:   100% × 24px, background: #71639e (brand-primary static)
CTA button:   Min 280px, inline-block in table cell
```

---

## Success Criteria

- [ ] `tokens/build.js` generates `_tokens.print.scss` with static variable values
- [ ] All reports have branded header (logo + company) and footer (page number)
- [ ] Invoice report has status band (PAID/OVERDUE/DRAFT)
- [ ] Invoice item table has consistent column widths and right-aligned totals
- [ ] Sales quote has signature block
- [ ] Delivery note has barcode area and large status stamp
- [ ] Email base layout is single-column, table-based, max 600px
- [ ] Transactional emails have header icon, body, and CTA button
- [ ] CTA button renders in Gmail, Outlook web, Apple Mail (Ivy verified)
- [ ] Invoice email shows amount due prominently with View/Pay CTAs
- [ ] `@media print` forces white/black regardless of dark mode
- [ ] Multi-page PDF documents have correct header/footer on all pages
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Report customizer (user-editable headers) | Feature work |
| Per-company report themes | Config feature, not visual layer |
| Marketing email templates | Different module (mass_mailing) — separate sprint |
| PDF digital signatures | Functional, not UI |
| QR payment generation logic | Backend, not UI |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-21-plan.md`. You are the dev team: **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 21: Print Layouts & Email Templates.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-21`
>
> **CRITICAL CONSTRAINT**: Print SCSS must NOT use CSS custom properties (`var(--o-*)`). wkhtmltopdf does not support them. Use the static `$o-print-*` variables generated by `tokens/build.js` (Task 2 — **Nova builds this first** before any SCSS work begins).
>
> **Email HTML**: Must be table-based for Outlook compatibility. No flexbox, no grid, no CSS custom properties. Inline styles preferred where Outlook is concerned.
>
> **Nova** owns Task 2 (token build extension). **Milo** owns all SCSS and HTML templates (Tasks 1, 3–17).
>
> Test PDFs by actually generating them — look at the PDF output in a viewer, not just the HTML source.
>
> Commit after each phase. Update `doc/sprint-21-progress.md` after each commit.
> When done: `git push origin feature/sprint-21` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Print/email audit | ⬜ Not started | |
| 2 | Token build — static output | ⬜ Not started | |
| 3 | Report base layout | ⬜ Not started | |
| 4 | Report typography | ⬜ Not started | |
| 5 | Invoice / bill report | ⬜ Not started | |
| 6 | Invoice status bands | ⬜ Not started | |
| 7 | Sales quote report | ⬜ Not started | |
| 8 | Delivery / packing slip | ⬜ Not started | |
| 9 | Purchase order report | ⬜ Not started | |
| 10 | Payslip report | ⬜ Not started | |
| 11 | Report QR code | ⬜ Not started | |
| 12 | Email layout base | ⬜ Not started | |
| 13 | Transactional email templates | ⬜ Not started | |
| 14 | Email button component | ⬜ Not started | |
| 15 | Invoice email design | ⬜ Not started | |
| 16 | Print dark mode exclusion | ⬜ Not started | |
| 17 | Regression QA | ⬜ Not started | |
