# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

import logging

_logger = logging.getLogger(__name__)

ICON = "/base/static/img/icons/{}"

MODULE_BRANDING = {
    "helpdesk": {
        "shortdesc": "Helpdesk",
        "summary": "Track support tickets",
        "icon": ICON.format("helpdesk.png"),
        "hide_deps": ["helpdesk_mgmt"],
    },
    "account_reports": {
        "shortdesc": "Accounting Reports",
        "summary": "Financial reports, ledgers, and tax reports",
        "icon": ICON.format("account_accountant.png"),
        "hide_deps": ["account_financial_report"],
    },
    "stock_barcode": {
        "shortdesc": "Barcode",
        "summary": "Barcode scanner for warehouses",
        "icon": ICON.format("stock_barcode.png"),
    },
    "account_extract": {
        "shortdesc": "Invoice Digitization",
        "summary": "Digitize vendor bills with OCR",
        "icon": "/base/static/img/bill.png",
    },
    "currency_rate_live": {
        "shortdesc": "Live Currency Rates",
        "summary": "Automatic currency rate updates",
        "icon": ICON.format("account_accountant.png"),
    },
    "account_budget": {
        "shortdesc": "Budgets",
        "summary": "Manage financial and analytic budgets",
        "icon": ICON.format("account_accountant.png"),
    },
    "sign": {
        "shortdesc": "Sign",
        "summary": "Send documents to sign online",
        "icon": ICON.format("sign.png"),
        "hide_deps": ["sign_oca"],
    },
    "quality_control": {
        "shortdesc": "Quality",
        "summary": "Quality alerts and control points",
        "icon": ICON.format("quality_control.png"),
    },
    "account_inter_company_rules": {
        "shortdesc": "Inter Company Rules",
        "summary": "Automate inter-company purchase and sale orders",
        "icon": ICON.format("account_accountant.png"),
        "hide_deps": ["purchase_sale_inter_company"],
    },
    "mrp_mps": {
        "shortdesc": "Master Production Schedule",
        "summary": "Master production schedule and MRP planning",
        "icon": ICON.format("mrp_workorder.png"),
        "hide_deps": [],
    },
    "maintenance_worksheet": {
        "shortdesc": "Maintenance Worksheet",
        "summary": "Customizable worksheets on maintenance requests",
        "icon": ICON.format("industry_fsm.png"),
    },
}


def post_init_hook(env):
    Module = env["ir.module.module"].sudo()
    for name, branding in MODULE_BRANDING.items():
        mod = Module.search([("name", "=", name)], limit=1)
        if not mod:
            continue
        mod.write({
            "shortdesc": branding["shortdesc"],
            "summary": branding["summary"],
            "icon": branding["icon"],
            "to_buy": False,
            "license": "LGPL-3",
        })
        _logger.info("Community Suite: branded module %s", name)
        for dep_name in branding.get("hide_deps", []):
            dep = Module.search([("name", "=", dep_name)], limit=1)
            if dep:
                dep.write({"application": False})
