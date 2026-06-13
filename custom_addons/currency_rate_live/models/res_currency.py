# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

import json
import logging
import urllib.request
from datetime import date

from odoo import api, models

_logger = logging.getLogger(__name__)


class ResCurrency(models.Model):
    _inherit = "res.currency"

    @api.model
    def _cron_update_live_rates(self):
        """Fetch EUR-based rates from Frankfurter (ECB data) and update active currencies."""
        company = self.env.company
        base = company.currency_id
        if not base:
            return
        currencies = self.search([("active", "=", True), ("id", "!=", base.id)])
        if not currencies:
            return
        symbols = ",".join(currencies.mapped("name"))
        url = f"https://api.frankfurter.app/latest?from={base.name}&to={symbols}"
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                data = json.loads(resp.read().decode())
        except Exception as exc:
            _logger.warning("Live currency rate update failed: %s", exc)
            return
        rates = data.get("rates", {})
        today = date.today()
        Rate = self.env["res.currency.rate"]
        for currency in currencies:
            rate = rates.get(currency.name)
            if not rate:
                continue
            existing = Rate.search([
                ("currency_id", "=", currency.id),
                ("name", "=", today),
                ("company_id", "in", [False, company.id]),
            ], limit=1)
            vals = {
                "currency_id": currency.id,
                "name": today,
                "rate": rate,
                "company_id": company.id,
            }
            if existing:
                existing.write({"rate": rate})
            else:
                Rate.create(vals)
        _logger.info("Updated live currency rates for %s currencies", len(rates))
