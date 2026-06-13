# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class AmazonOrder(models.Model):
    _name = "amazon.order"
    _description = "Amazon Marketplace Order"
    _order = "create_date desc"

    name = fields.Char(string="Amazon Order ID", required=True)
    sale_order_id = fields.Many2one("sale.order", string="Sales Order")
    partner_id = fields.Many2one("res.partner", string="Customer")
    state = fields.Selection(
        [("pending", "Pending"), ("imported", "Imported"), ("shipped", "Shipped"), ("cancelled", "Cancelled")],
        default="pending",
    )
    note = fields.Text()

    def action_create_sale_order(self):
        for record in self:
            if record.sale_order_id:
                continue
            order = self.env["sale.order"].create({
                "partner_id": record.partner_id.id or self.env.ref("base.public_partner").id,
                "origin": record.name,
            })
            record.write({"sale_order_id": order.id, "state": "imported"})
