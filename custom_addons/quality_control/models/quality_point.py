# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class QualityPoint(models.Model):
    _name = "quality.point"
    _description = "Quality Control Point"
    _order = "name"

    name = fields.Char(required=True)
    active = fields.Boolean(default=True)
    product_ids = fields.Many2many("product.product", string="Products")
    picking_type_ids = fields.Many2many("stock.picking.type", string="Operation Types")
    note = fields.Html()
    check_ids = fields.One2many("quality.check", "point_id", string="Checks")
