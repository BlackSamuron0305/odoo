# Enterprise Module Alternatives — Community Plan

> **Context:** Odoo 19 Community (`ui-rebuild` branch). Enterprise modules are **proprietary (OEEL)** — we do not copy their source. This document maps every paid feature to **OCA modules**, **Community modules already in-tree**, or **custom modules we build ourselves**.

---

## How Enterprise gating works in your codebase

Settings toggles with `widget="upgrade_boolean"` call `UpgradeDialog` when `odoo.info.isEnterprise` is false. The module is never installed — it is a upsell placeholder.

**Our approach:**
1. Install **OCA** replacement where it exists (AGPL/LGPL, free) behind an enterprise-named **facade module**.
2. **Build custom** modules where OCA is missing — use the **same Enterprise icon** from `base/static/img/icons/` (shipped with Community).
3. Install everything via **`community_suite`** in `custom_addons/` (Settings toggles install our apps, not upsell dialogs).
4. Use the **Flutter app** for advanced mobile workflows (`app.md`).

### Implemented in `custom_addons/`

| Enterprise name | Our module | Backend | Icon |
|-----------------|------------|---------|------|
| `helpdesk` | `helpdesk` | OCA `helpdesk_mgmt` | `helpdesk.png` |
| `account_reports` | `account_reports` | OCA `account_financial_report` | `account_accountant.png` |
| `stock_barcode` | `stock_barcode` | Custom | `stock_barcode.png` |
| `account_extract` | `account_extract` | Custom (OCR-ready wizard) | `bill.png` |
| `currency_rate_live` | `currency_rate_live` | OCA `currency_rate_update` | `account_accountant.png` |
| `account_budget` | `account_budget` | OCA `account_budget_oca` | `account_accountant.png` |

---

## Version note (Odoo 19)

| Source | Branch | Status |
|--------|--------|--------|
| Your server | **19.0** | Production target |
| OCA repos | **18.0** or **19.0** | Mixed — check each repo |
| OCA 19.0 | In migration | Some modules ready, some WIP |

**Rule:** Prefer OCA `19.0` branch when available. Otherwise port from `18.0` or wait/contribute migration.

---

## Master mapping table

### Accounting & Finance

| Enterprise module | In Community settings? | OCA / free alternative | Build custom? | Priority |
|-------------------|------------------------|------------------------|---------------|----------|
| `account_reports` | Yes | [OCA/account-financial-reporting](https://github.com/OCA/account-financial-reporting) → `account_financial_report` (**19.0** ✅) | MIS P&L: `mis_template_financial_report` (18.0, 19 WIP) | **P0** |
| `account_budget` | Yes | [OCA/account-budgeting](https://github.com/OCA/account-budgeting) → `account_budget_oca` (18.0) | Port to 19.0 | **P1** |
| `currency_rate_live` | Yes | [OCA/currency](https://github.com/OCA/currency) → `currency_rate_update` + `currency_rate_update_xe` (18.0) | Small cron addon using ECB API | **P1** |
| `account_batch_payment` | Yes | [OCA/bank-payment](https://github.com/OCA/bank-payment) → `account_payment_order` (check 19.0) | — | **P2** |
| `account_sepa_direct_debit` | Yes | OCA `account_banking_sepa_direct_debit` in bank-payment | — | **P2** |
| `account_iso20022` | Yes | OCA bank-payment ISO20022 modules | — | **P2** |
| `account_intrastat` | Yes | [OCA/intrastat-extrastat](https://github.com/OCA/intrastat-extrastat) | — | **P2** (EU only) |
| `account_extract` (OCR bills) | Yes | — | **`custom_addons/account_ocr`** — Tesseract / Google Vision / Azure DI | **P2** |
| `account_bank_statement_import_qif` | Yes | — | **`custom_addons/account_statement_import_qif`** — QIF parser | **P3** |
| `account_3way_match` | Yes (Purchase) | [OCA/purchase-workflow](https://github.com/OCA/purchase-workflow) — search `three_way` | — | **P2** |
| `account_inter_company_rules` | Yes | [OCA/multi-company](https://github.com/OCA/multi-company) → `purchase_sale_inter_company` (**19.0** ✅) | — | **P2** |

### Inventory & Manufacturing

| Enterprise module | OCA / free alternative | Build custom? | Priority |
|-------------------|------------------------|---------------|----------|
| `stock_barcode` | OCA `stock_barcodes` (16.0; **not on 18.0/19.0 default branch**) | **Flutter app** warehouse module + `custom_addons/stock_barcode_api` | **P0** |
| `quality_control` | [OCA/manufacture](https://github.com/OCA/manufacture) → `quality_control_oca` (18.0 ✅, **19.0 not listed yet**) | Port to 19.0 | **P1** |
| `quality_control_worksheet` | OCA `quality_control_oca` + custom worksheet template | Extend QC module | **P2** |
| `mrp_mps` (Master Production Schedule) | OCA `mrp_multi_level` (**19.0** ✅) — different UX, same purpose | — | **P2** |
| `maintenance_worksheet` | — | **`custom_addons/maintenance_worksheet`** — checklist on work orders | **P3** |

### Sales & Delivery

| Enterprise module | OCA / free alternative | Build custom? | Priority |
|-------------------|------------------------|---------------|----------|
| `sale_commission` | [OCA/commission](https://github.com/OCA/commission) → `sale_commission_oca` (18.0) | Port to 19.0 | **P2** |
| `sale_amazon` / `sale_shopee` | — | Marketplace APIs — high effort, vendor-specific | **P4** |
| `delivery_easypost` | — | **`custom_addons/delivery_easypost`** — EasyPost REST API | **P3** |
| `delivery_sendcloud` | — | Custom Sendcloud connector | **P3** |
| `delivery_bpost`, `shiprocket`, `starshipit`, `envia` | — | Build per carrier as needed | **P4** |
| `delivery` (base) | **Already in Community** (`addons/delivery`) | Configure + rate rules | **P0** |

### HR & Expenses

| Enterprise module | OCA / free alternative | Build custom? | Priority |
|-------------------|------------------------|---------------|----------|
| `hr_payroll_expense` | [OCA/payroll](https://github.com/OCA/payroll) (community payroll stack) | Country-specific | **P3** |
| `hr_expense_extract` (OCR) | — | Reuse `account_ocr` pipeline for receipts | **P2** |
| `hr_expense_stripe` | Community `payment_stripe` exists | Wire expense payout via Stripe Connect | **P3** |
| `hr_recruitment_extract` (CV OCR) | — | **`custom_addons/hr_recruitment_ocr`** | **P4** |

### Services & Productivity (not in settings — Enterprise-only apps)

| Enterprise app | OCA / free alternative | Build custom? | Priority |
|----------------|------------------------|---------------|----------|
| **Helpdesk** | [OCA/helpdesk](https://github.com/OCA/helpdesk) → `helpdesk_mgmt` + `helpdesk_mgmt_sla` (18.0; 19.0 WIP) | — | **P0** |
| **Sign** | [OCA/sign](https://github.com/OCA/sign) → `sign_oca` (18.0 ✅) | Port to 19.0 | **P1** |
| **Documents** | [OCA/dms](https://github.com/OCA/dms) — Document Management System | — | **P2** |
| **Field Service** | [OCA/field-service](https://github.com/OCA/field-service) | — | **P2** |
| **Marketing Automation** | [OCA/automation](https://github.com/OCA/automation) → `automation_oca` (18.0) | Less feature-rich than Enterprise | **P2** |
| **Planning / Gantt** | Community `planning` is Enterprise — use **Project + Calendar** + OCA `project_timeline` | — | **P3** |
| **Studio** | — | Custom modules in `custom_addons/` — no real substitute | **ongoing** |
| **VoIP** | — | Asterisk + custom SIP widget or external softphone | **P4** |
| **Native mobile app** | — | **Flutter app** (`app.md`) | **P0** |
| **Knowledge** | [OCA/knowledge](https://github.com/OCA/knowledge) | — | **P3** |

### POS & Appointments

| Enterprise module | Alternative | Priority |
|-------------------|-------------|----------|
| `pos_appointment` (Booking) | Community `appointment` module if available, or OCA calendar booking | **P3** |

### Timesheets

| Enterprise feature | Alternative | Priority |
|--------------------|-------------|----------|
| `reminder_allow` / timesheet reminders | Community `hr_timesheet` + cron mail template | **P3** |
| `invoice_policy` (timesheet billing) | Enterprise policy — use `sale_timesheet` Community defaults | **P2** |

### Localization (India example in your tree)

| Feature | Notes |
|---------|-------|
| `l10n_in_gst_efiling` | Enterprise India compliance — use Community `l10n_in` + manual filing or third-party |
| `l10n_in_fetch_vendor_edi` | Enterprise EDI fetch — custom GST portal integration |
| `l10n_in_enet_vendor_batch_payment` | Enterprise batch — OCA bank-payment |

---

## Recommended install order (Phase 1 — do first)

These give the most value with existing OCA 19.0 or minimal custom work:

| # | Module | Repo / path | Replaces |
|---|--------|-------------|----------|
| 1 | `account_financial_report` | OCA/account-financial-reporting @ **19.0** | `account_reports` |
| 2 | `purchase_sale_inter_company` | OCA/multi-company @ **19.0** | `account_inter_company_rules` |
| 3 | `helpdesk_mgmt` | OCA/helpdesk @ 19.0 (when ready) or 18.0 port | Helpdesk |
| 4 | `mrp_multi_level` | OCA/manufacture @ **19.0** | `mrp_mps` (partial) |
| 5 | `currency_rate_update` | OCA/currency @ 18.0 → port | `currency_rate_live` |
| 6 | `account_budget_oca` | OCA/account-budgeting @ 18.0 → port | `account_budget` |
| 7 | `sign_oca` | OCA/sign @ 18.0 → port | Sign |
| 8 | `quality_control_oca` | OCA/manufacture @ 18.0 → port | `quality_control` |
| 9 | `sale_commission_oca` | OCA/commission @ 18.0 → port | `sale_commission` |
| 10 | **`stock_barcode_api`** | **custom** + Flutter | `stock_barcode` |

---

## Custom modules to build (our code)

| Module | Replaces | Scope | Effort |
|--------|----------|-------|--------|
| `stock_barcode_api` | `stock_barcode` | JSON endpoints for pickings, scan validate, inventory | Medium — pairs with Flutter |
| `account_ocr` | `account_extract` | Upload PDF/image → OCR → draft vendor bill | Medium |
| `mobile_api` | Enterprise mobile | Bootstrap, push tokens, dashboard KPIs | Medium — pairs with Flutter |
| `account_statement_import_qif` | QIF import | Parser + wizard | Small |
| `maintenance_worksheet` | `maintenance_worksheet` | Checklist fields on maintenance requests | Small |
| `delivery_easypost` | `delivery_easypost` | Shipping label API (if you use EasyPost) | Medium |

---

## Setup: `custom_addons` + OCA

### Directory layout

```
d:\odoo\
├── addons\                  # Odoo Community (don't modify)
├── odoo\addons\             # Core base (don't modify)
└── custom_addons\           # ← OUR modules + OCA clones
    ├── README.md
    ├── oca\                 # git clone OCA repos here
    │   ├── account-financial-reporting\
    │   ├── helpdesk\
    │   ├── manufacture\
    │   └── ...
    ├── mobile_api\          # custom
    ├── stock_barcode_api\   # custom
    └── account_ocr\         # custom
```

### Odoo config

Add to your config or CLI:

```ini
addons_path = d:\odoo\odoo\addons,d:\odoo\addons,d:\odoo\custom_addons,d:\odoo\custom_addons\oca\account-financial-reporting,d:\odoo\custom_addons\oca\helpdesk\helpdesk_mgmt,...
```

Or use a single meta-path with symlinks / `oca_install` script.

### Clone OCA (19.0 where available)

```powershell
cd d:\odoo\custom_addons
mkdir oca
cd oca

git clone -b 19.0 --depth 1 https://github.com/OCA/account-financial-reporting.git
git clone -b 19.0 --depth 1 https://github.com/OCA/multi-company.git
git clone -b 19.0 --depth 1 https://github.com/OCA/manufacture.git
git clone -b 19.0 --depth 1 https://github.com/OCA/helpdesk.git

# 18.0 — port or use until 19.0 ready
git clone -b 18.0 --depth 1 https://github.com/OCA/currency.git
git clone -b 18.0 --depth 1 https://github.com/OCA/account-budgeting.git
git clone -b 18.0 --depth 1 https://github.com/OCA/sign.git
git clone -b 18.0 --depth 1 https://github.com/OCA/commission.git
git clone -b 18.0 --depth 1 https://github.com/OCA/automation.git
```

Then update `addons_path` and install via Apps menu or `-i account_financial_report`.

---

## What we will NOT do

| Action | Reason |
|--------|--------|
| Copy Odoo Enterprise source | OEEL license violation |
| Patch `upgrade_boolean` to fake Enterprise | Breaks legally, blocks real support |
| Strip license checks from Community | Same |

---

## AGPL note

Most OCA modules are **AGPL-3.0**. If you distribute a modified version or host as SaaS, you may need to provide source to users. Internal company use on your own server is typically fine — confirm with your legal counsel.

---

## Next actions

1. **Create `custom_addons/`** structure and clone P0 OCA repos (19.0).
2. **Install** `account_financial_report`, `purchase_sale_inter_company`, `mrp_multi_level`.
3. **Build** `stock_barcode_api` + `mobile_api` (unblocks Flutter app).
4. **Port** 18.0 OCA modules to 19.0 as needed (helpdesk, sign, quality, currency).
5. **Build** `account_ocr` if invoice scanning is required.

---

*See also: `app.md` (Flutter mobile plan)*
