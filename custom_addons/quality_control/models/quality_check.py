# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class QualityCheck(models.Model):
    _name = "quality.check"
    _description = "Quality Check"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "id desc"

    name = fields.Char(required=True, default="New")
    point_id = fields.Many2one("quality.point", string="Control Point", required=True)
    product_id = fields.Many2one("product.product", string="Product")
    picking_id = fields.Many2one("stock.picking", string="Transfer")
    state = fields.Selection([
        ("draft", "Draft"),
        ("pass", "Passed"),
        ("fail", "Failed"),
    ], default="draft", tracking=True)
    note = fields.Text()

    def action_pass(self):
        self.write({"state": "pass"})

    def action_fail(self):
        self.write({"state": "fail"})
