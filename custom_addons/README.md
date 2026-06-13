# Custom Addons — Community Enterprise Replacements

**Rule:** If a free OCA module exists → use it behind an enterprise-named **facade**. If not → **build our own**, using the **same icon** as the Enterprise app (icons are in Community at `base/static/img/icons/`).

## Architecture

```
custom_addons/
├── community_suite/      # Installs all replacements; fixes Settings toggles
├── helpdesk/             # Facade → OCA helpdesk_mgmt (icon: helpdesk.png)
├── account_reports/      # Facade → OCA account_financial_report
├── stock_barcode/        # Custom barcode app (icon: stock_barcode.png)
├── account_extract/      # Custom bill digitization (icon: bill.png)
├── currency_rate_live/   # Facade → OCA currency_rate_update (optional)
├── account_budget/       # Facade → OCA account_budget_oca (optional)
└── oca/                  # Cloned OCA repositories (do not edit)
```

## Quick start

1. Copy `odoo.conf.example` paths into your config.
2. Install the stack:

```powershell
python odoo-bin -c custom_addons\odoo.conf.example -d ui_rebuild_local -i community_suite --stop-after-init
```

3. Open **Apps** — Helpdesk, Barcode, Accounting Reports appear with **Enterprise-style icons**.

## Icon mapping

Icons come from Odoo Community (`odoo/addons/base/static/img/icons/`) — already shipped with your install, referenced in manifests as:

```python
"icon": "/base/static/img/icons/helpdesk.png"
```

| App | Module | Source | Icon |
|-----|--------|--------|------|
| Helpdesk | `helpdesk` | OCA `helpdesk_mgmt` | `helpdesk.png` |
| Accounting Reports | `account_reports` | OCA `account_financial_report` | `account_accountant.png` |
| Barcode | `stock_barcode` | Custom | `stock_barcode.png` |
| Invoice OCR | `account_extract` | Custom | `bill.png` |
| Live rates | `currency_rate_live` | OCA `currency_rate_update` | `account_accountant.png` |
| Budgets | `account_budget` | OCA `account_budget_oca` | `account_accountant.png` |

## Settings

`community_suite` replaces `widget="upgrade_boolean"` with normal booleans for Barcode, Reports, Budget, Currency, and Extract — so toggles **install our modules** instead of showing the Enterprise upsell dialog.

## OCA clone script

```powershell
Set-Location d:\odoo\custom_addons\oca
# 19.0
git clone -b 19.0 --depth 1 https://github.com/OCA/account-financial-reporting.git
git clone -b 19.0 --depth 1 https://github.com/OCA/helpdesk.git
git clone -b 19.0 --depth 1 https://github.com/OCA/server-ux.git
git clone -b 19.0 --depth 1 https://github.com/OCA/reporting-engine.git
# 18.0 (port to 19.0 as needed)
git clone -b 18.0 --depth 1 https://github.com/OCA/currency.git
git clone -b 18.0 --depth 1 https://github.com/OCA/account-budgeting.git
```

See [enterprise_alternatives.md](../enterprise_alternatives.md) for the full mapping table.
