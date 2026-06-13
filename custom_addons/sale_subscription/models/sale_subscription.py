# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class SaleSubscription(models.Model):
    _name = "sale.subscription"
    _description = "Sale Subscription"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "next_invoice_date"

    name = fields.Char(required=True, tracking=True)
    partner_id = fields.Many2one("res.partner", required=True, tracking=True)
    recurring_interval = fields.Integer(default=1, required=True)
    recurring_rule_type = fields.Selection(
        [("monthly", "Months"), ("yearly", "Years")],
        default="monthly",
        required=True,
    )
    next_invoice_date = fields.Date(tracking=True)
    sale_order_ids = fields.One2many("sale.order", "subscription_id", string="Sales Orders")
    state = fields.Selection(
        [("draft", "Draft"), ("in_progress", "In Progress"), ("closed", "Closed")],
        default="draft",
        tracking=True,
    )

    def action_start(self):
        self.write({"state": "in_progress"})

    def action_close(self):
        self.write({"state": "closed"})


class SaleOrder(models.Model):
    _inherit = "sale.order"

    subscription_id = fields.Many2one("sale.subscription", string="Subscription")
