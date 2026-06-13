#!/usr/bin/env python3
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)
"""Uninstall pre-installed App Store apps (run after community_suite upgrade)."""

import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT)

import odoo
from odoo import SUPERUSER_ID, api
from odoo.modules.registry import Registry

STORE_APPS = {
    "helpdesk", "account_reports", "stock_barcode", "account_extract", "sign",
    "quality_control", "account_inter_company_rules", "currency_rate_live",
    "account_budget", "maintenance_worksheet", "mrp_mps", "web_studio",
    "timesheet_grid", "accountant", "knowledge", "industry_fsm", "hr_appraisal",
    "marketing_automation", "mrp_plm", "sale_amazon", "planning",
    "sale_subscription", "voip", "appointment", "social", "mrp_workorder",
    "web_mobile", "payment_sepa_direct_debit",
}


def main():
    custom = os.path.join(ROOT, "custom_addons")
    oca = os.path.join(custom, "oca")
    addons = ",".join([
        os.path.join(ROOT, "odoo", "addons"),
        os.path.join(ROOT, "addons"),
        custom,
        os.path.join(oca, "account-financial-reporting"),
        os.path.join(oca, "helpdesk"),
        os.path.join(oca, "multi-company"),
        os.path.join(oca, "server-ux"),
        os.path.join(oca, "reporting-engine"),
        os.path.join(oca, "sign"),
    ])
    db = os.environ.get("ODOO_DB", "ui_rebuild_local")
    odoo.tools.config.parse_config([
        "-d", db,
        f"--addons-path={addons}",
        "--db_host=localhost",
        "--db_user=odoo",
        "--db_password=odoo",
    ])
    registry = Registry(db)
    with registry.cursor() as cr:
        env = api.Environment(cr, SUPERUSER_ID, {})
        Module = env["ir.module.module"].sudo()
        installed = Module.search([
            ("name", "in", list(STORE_APPS)),
            ("state", "in", ["installed", "to upgrade", "to remove"]),
        ])
        print(f"Uninstalling {len(installed)} store apps: {', '.join(installed.mapped('name'))}")
        if installed:
            installed.button_immediate_uninstall()
        from odoo.addons.community_suite.hooks import apply_community_suite, RECOMMENDED_COMMUNITY

        also_reset = Module.search([
            ("name", "in", list(RECOMMENDED_COMMUNITY)),
            ("state", "in", ["installed", "to upgrade", "to remove"]),
        ])
        if also_reset:
            print(f"Uninstalling {len(also_reset)} recommended apps: {', '.join(also_reset.mapped('name'))}")
            also_reset.button_immediate_uninstall()
        apply_community_suite(env)
        cr.commit()
    print("Store apps reset complete.")


if __name__ == "__main__":
    main()
