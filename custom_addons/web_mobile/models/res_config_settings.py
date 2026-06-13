# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    mobile_api_enabled = fields.Boolean(
        string="Mobile API",
        config_parameter="web_mobile.api_enabled",
    )
    mobile_api_url = fields.Char(
        string="Mobile API Base URL",
        config_parameter="web_mobile.api_url",
    )
