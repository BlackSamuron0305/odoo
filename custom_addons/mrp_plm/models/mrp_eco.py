# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class MrpEco(models.Model):
    _name = "mrp.eco"
    _description = "Engineering Change Order"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "id desc"

    name = fields.Char(required=True, tracking=True)
    product_tmpl_id = fields.Many2one("product.template", string="Product", required=True, tracking=True)
    eco_type = fields.Selection(
        [("bom", "Bill of Materials"), ("routing", "Routing"), ("both", "BoM and Routing")],
        default="bom",
        required=True,
    )
    note = fields.Html()
    state = fields.Selection(
        [("draft", "Draft"), ("confirmed", "Confirmed"), ("done", "Done"), ("cancel", "Cancelled")],
        default="draft",
        tracking=True,
    )

    def action_confirm(self):
        self.write({"state": "confirmed"})

    def action_done(self):
        self.write({"state": "done"})
