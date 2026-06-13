#!/usr/bin/env python3
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)
"""Uninstall every module that is not part of the default Odoo Community baseline."""

import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT)

import odoo
from odoo import SUPERUSER_ID, api
from odoo.modules.registry import Registry

# Only core apps that ship with a fresh Odoo database — everything else is App Store opt-in.
KEEP_APPLICATIONS = frozenset({
    "mail",      # Discuss
    "calendar",
    "contacts",
})

# Orchestrator — keep installed but hidden from app switcher.
KEEP_ALWAYS = frozenset({"community_suite"})

# OCA backends pulled in by store-app installs; never keep.
OCA_BACKENDS = frozenset({
    "helpdesk_mgmt",
    "helpdesk_product",
    "sign_oca",
    "account_financial_report",
    "purchase_sale_inter_company",
    "account_invoice_inter_company",
    "date_range",
    "date_range_account",
    "report_xlsx",
})

INSTALLED_STATES = ("installed", "to upgrade", "to remove")


def _addons_path():
    custom = os.path.join(ROOT, "custom_addons")
    oca = os.path.join(custom, "oca")
    return ",".join([
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


def _custom_module_names():
    custom = os.path.join(ROOT, "custom_addons")
    names = set()
    for entry in os.listdir(custom):
        path = os.path.join(custom, entry)
        if os.path.isdir(path) and os.path.isfile(os.path.join(path, "__manifest__.py")):
            names.add(entry)
    names -= KEEP_ALWAYS
    return names


def _uninstall(Module, names, label):
    if not names:
        return
    mods = Module.search([
        ("name", "in", list(names)),
        ("state", "in", list(INSTALLED_STATES)),
    ])
    if not mods:
        return
    print(f"Uninstalling {len(mods)} {label}: {', '.join(sorted(mods.mapped('name')))}")
    mods.button_immediate_uninstall()


def main():
    db = os.environ.get("ODOO_DB", "ui_rebuild_local")
    odoo.tools.config.parse_config([
        "-d", db,
        f"--addons-path={_addons_path()}",
        "--db_host=localhost",
        "--db_user=odoo",
        "--db_password=odoo",
    ])
    registry = Registry(db)

    from odoo.addons.community_suite.hooks import (
        RECOMMENDED_COMMUNITY,
        STORE_APPS,
        apply_community_suite,
    )

    with registry.cursor() as cr:
        env = api.Environment(cr, SUPERUSER_ID, {})
        Module = env["ir.module.module"].sudo()

        # 1) Remove non-baseline application modules (mrp, mass_mailing, sale_management, …).
        extra_apps = Module.search([
            ("application", "=", True),
            ("state", "in", list(INSTALLED_STATES)),
            ("name", "not in", list(KEEP_APPLICATIONS)),
        ])
        if extra_apps:
            print(
                f"Uninstalling {len(extra_apps)} non-default apps: "
                f"{', '.join(sorted(extra_apps.mapped('name')))}"
            )
            extra_apps.button_immediate_uninstall()

        # 2) Remove store facades, OCA backends, and custom_addons modules.
        purge = (
            set(STORE_APPS)
            | set(RECOMMENDED_COMMUNITY)
            | OCA_BACKENDS
            | _custom_module_names()
        )
        _uninstall(Module, purge, "store/OCA/custom modules")

        # 3) Second pass — anything custom/OCA still hanging on.
        still = Module.search([
            ("name", "in", list(purge)),
            ("state", "in", list(INSTALLED_STATES)),
        ])
        if still:
            print(f"Second pass uninstall: {', '.join(still.mapped('name'))}")
            still.button_immediate_uninstall()

        apply_community_suite(env)
        cr.commit()

        remaining_apps = Module.search([
            ("application", "=", True),
            ("state", "in", list(INSTALLED_STATES)),
        ])
        print("\nRemaining apps:", ", ".join(sorted(remaining_apps.mapped("name"))))
        print(f"Total installed modules: {Module.search_count([('state', 'in', list(INSTALLED_STATES))])}")

    print("Non-default purge complete.")


if __name__ == "__main__":
    main()
