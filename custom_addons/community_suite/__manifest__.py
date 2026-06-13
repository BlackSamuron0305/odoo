# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Community Suite",
    "summary": "Install free replacements for Enterprise apps (OCA + custom, same icons)",
    "version": "19.0.1.0.0",
    "category": "Hidden",
    "license": "LGPL-3",
    "author": "Community",
    "depends": [
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
    ],
    "data": [
        "views/res_config_settings_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
}
