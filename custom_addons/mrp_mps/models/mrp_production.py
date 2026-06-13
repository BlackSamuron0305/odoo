# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class MrpProduction(models.Model):
    _inherit = "mrp.production"

    mps_priority = fields.Selection([
        ("0", "Low"),
        ("1", "Normal"),
        ("2", "High"),
    ], string="MPS Priority", default="1")
