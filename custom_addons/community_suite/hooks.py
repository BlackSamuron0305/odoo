# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

import logging

_logger = logging.getLogger(__name__)

ICON = "/base/static/img/icons/{}"

# Enterprise replacements — available in App Store, never auto-installed.
STORE_APPS = frozenset({
    "helpdesk",
    "account_reports",
    "stock_barcode",
    "account_extract",
    "sign",
    "quality_control",
    "account_inter_company_rules",
    "currency_rate_live",
    "account_budget",
    "maintenance_worksheet",
    "mrp_mps",
    "web_studio",
    "timesheet_grid",
    "accountant",
    "knowledge",
    "industry_fsm",
    "hr_appraisal",
    "marketing_automation",
    "mrp_plm",
    "sale_amazon",
    "planning",
    "sale_subscription",
    "voip",
    "appointment",
    "social",
    "mrp_workorder",
    "web_mobile",
    "payment_sepa_direct_debit",
})

# Nice Community apps to highlight in the App Store (not installed by us).
RECOMMENDED_COMMUNITY = {
    "crm": {
        "shortdesc": "CRM",
        "summary": "Track leads and close opportunities",
    },
    "account": {
        "shortdesc": "Invoicing",
        "summary": "Invoices, payments, and accounting",
    },
    "website": {
        "shortdesc": "Website",
        "summary": "Website builder and online presence",
    },
    "purchase": {
        "shortdesc": "Purchase",
        "summary": "Purchase orders and vendor management",
    },
    "stock": {
        "shortdesc": "Inventory",
        "summary": "Manage stock and logistics",
    },
    "maintenance": {
        "shortdesc": "Maintenance",
        "summary": "Equipment maintenance and requests",
    },
    "spreadsheet_dashboard": {
        "shortdesc": "Dashboards",
        "summary": "Spreadsheet dashboards and analytics",
    },
    "project": {
        "shortdesc": "Project",
        "summary": "Plan and track projects and tasks",
    },
    "website_sale": {
        "shortdesc": "eCommerce",
        "summary": "Sell products online",
    },
    "hr": {
        "shortdesc": "Employees",
        "summary": "Centralize employee information",
    },
    "fleet": {
        "shortdesc": "Fleet",
        "summary": "Manage vehicles, costs, and contracts",
    },
    "point_of_sale": {
        "shortdesc": "Point of Sale",
        "summary": "Retail POS interface",
    },
    "survey": {
        "shortdesc": "Surveys",
        "summary": "Send surveys and analyze answers",
    },
    "im_livechat": {
        "shortdesc": "Live Chat",
        "summary": "Chat with website visitors",
    },
    "hr_recruitment": {
        "shortdesc": "Recruitment",
        "summary": "Track applicants and job openings",
    },
    "website_event": {
        "shortdesc": "Events",
        "summary": "Organize events and sell tickets",
    },
    "hr_expense": {
        "shortdesc": "Expenses",
        "summary": "Submit and approve employee expenses",
    },
}

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
    },
    "maintenance_worksheet": {
        "shortdesc": "Maintenance Worksheet",
        "summary": "Customizable worksheets on maintenance requests",
        "icon": ICON.format("industry_fsm.png"),
    },
    "web_studio": {
        "shortdesc": "Studio",
        "summary": "Create and customize applications",
        "icon": ICON.format("web_studio.png"),
    },
    "timesheet_grid": {
        "shortdesc": "Timesheets",
        "summary": "Track time and costs",
        "icon": ICON.format("timesheet_grid.png"),
    },
    "accountant": {
        "shortdesc": "Accounting",
        "summary": "Accounting, taxes, budgets, assets",
        "icon": ICON.format("account_accountant.png"),
    },
    "knowledge": {
        "shortdesc": "Knowledge",
        "summary": "Centralize, manage, share and grow your knowledge library",
        "icon": ICON.format("knowledge.png"),
    },
    "industry_fsm": {
        "shortdesc": "Field Service",
        "summary": "Schedule and track onsite operations, time and material",
        "icon": ICON.format("industry_fsm.png"),
    },
    "hr_appraisal": {
        "shortdesc": "Appraisal",
        "summary": "Assess your employees",
        "icon": ICON.format("hr_appraisal.png"),
    },
    "marketing_automation": {
        "shortdesc": "Marketing Automation",
        "summary": "Build automated mailing campaigns",
        "icon": ICON.format("marketing_automation.png"),
    },
    "mrp_plm": {
        "shortdesc": "Product Lifecycle Management (PLM)",
        "summary": "PLM, ECOs, versions",
        "icon": ICON.format("mrp_plm.png"),
    },
    "sale_amazon": {
        "shortdesc": "Amazon Connector",
        "summary": "Import Amazon orders and sync deliveries",
        "icon": ICON.format("sale_amazon.png"),
    },
    "planning": {
        "shortdesc": "Planning",
        "summary": "Manage your employees' schedule",
        "icon": ICON.format("planning.png"),
    },
    "sale_subscription": {
        "shortdesc": "Subscriptions",
        "summary": "MRR, churn, recurring payments",
        "icon": ICON.format("sale_subscription.png"),
    },
    "voip": {
        "shortdesc": "Phone",
        "summary": "Call using VoIP",
        "icon": ICON.format("voip.png"),
    },
    "appointment": {
        "shortdesc": "Appointments",
        "summary": "Online appointments scheduler",
        "icon": ICON.format("appointment.png"),
    },
    "social": {
        "shortdesc": "Social Marketing",
        "summary": "Manage your social media and website visitors",
        "icon": ICON.format("social.png"),
    },
    "mrp_workorder": {
        "shortdesc": "MRP II",
        "summary": "Work orders, planning, routing",
        "icon": ICON.format("mrp_workorder.png"),
    },
    "web_mobile": {
        "shortdesc": "Android & iPhone",
        "summary": "Support for Android and iOS apps",
        "icon": ICON.format("web_mobile.png"),
    },
    "payment_sepa_direct_debit": {
        "shortdesc": "SEPA Direct Debit Payment Provider",
        "summary": "Checkout with SEPA Direct Debit",
        "icon": ICON.format("payment_sepa_direct_debit.png"),
        "application": False,
    },
}

def _brand_module(mod, branding):
    values = {
        "shortdesc": branding["shortdesc"],
        "summary": branding["summary"],
        "icon": branding["icon"],
        "to_buy": False,
        "license": "LGPL-3",
    }
    if branding.get("application", True):
        values["application"] = True
    mod.write(values)


def _sanitize_external_links(env):
    """Clear module website fields that point to odoo.com or apps.odoo.com."""
    Module = env["ir.module.module"].sudo()
    odoo_markers = ("odoo.com", "odoo.de", "apps.odoo.com")
    for mod in Module.search([("website", "!=", False)]):
        website = (mod.website or "").lower()
        if any(marker in website for marker in odoo_markers):
            mod.write({"website": False})


def apply_community_suite(env):
    """Brand App Store apps, promote Community picks, hide Enterprise placeholders."""
    Module = env["ir.module.module"].sudo()

    for name, branding in MODULE_BRANDING.items():
        mod = Module.search([("name", "=", name)], limit=1)
        if not mod:
            continue
        _brand_module(mod, branding)
        _logger.info("Community Suite: branded store app %s", name)
        for dep_name in branding.get("hide_deps", []):
            dep = Module.search([("name", "=", dep_name)], limit=1)
            if dep:
                dep.write({"application": False})

    for name, branding in RECOMMENDED_COMMUNITY.items():
        mod = Module.search([("name", "=", name)], limit=1)
        if not mod:
            continue
        mod.write({
            "shortdesc": branding["shortdesc"],
            "summary": branding["summary"],
            "to_buy": False,
            "application": True,
        })
        _logger.info("Community Suite: promoted community app %s", name)

    ghosts = Module.search([
        ("to_buy", "=", True),
        ("name", "not in", list(STORE_APPS)),
    ])
    if ghosts:
        ghosts.write({"application": False})
        _logger.info(
            "Community Suite: hid %s Enterprise placeholder apps",
            len(ghosts),
        )

    _sanitize_external_links(env)


def post_init_hook(env):
    apply_community_suite(env)
