# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

import logging

_logger = logging.getLogger(__name__)


def post_init_hook(env):
    provider = env.ref("payment.payment_provider_sepa_direct_debit", raise_if_not_found=False)
    module = env["ir.module.module"].search([("name", "=", "payment_sepa_direct_debit")], limit=1)
    if module:
        module.write({
            "shortdesc": "SEPA Direct Debit Payment Provider",
            "summary": "Checkout with SEPA Direct Debit",
            "icon": "/base/static/img/icons/payment_sepa_direct_debit.png",
            "to_buy": False,
            "license": "LGPL-3",
        })
    if provider and module:
        provider.write({"module_id": module.id, "state": "enabled"})
        _logger.info("Community Suite: enabled SEPA Direct Debit payment provider")
