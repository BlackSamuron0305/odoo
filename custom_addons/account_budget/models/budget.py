# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class CommunityBudget(models.Model):
    _name = "community.budget"
    _description = "Community Budget"
    _order = "date_from desc, id desc"

    name = fields.Char(required=True)
    date_from = fields.Date(required=True)
    date_to = fields.Date(required=True)
    company_id = fields.Many2one("res.company", default=lambda self: self.env.company, required=True)
    line_ids = fields.One2many("community.budget.line", "budget_id", string="Budget Lines")
    state = fields.Selection([
        ("draft", "Draft"),
        ("confirmed", "Confirmed"),
        ("done", "Done"),
    ], default="draft")
    total_planned = fields.Monetary(compute="_compute_totals", currency_field="currency_id")
    currency_id = fields.Many2one(related="company_id.currency_id")

    def _compute_totals(self):
        for budget in self:
            budget.total_planned = sum(budget.line_ids.mapped("planned_amount"))

    def action_confirm(self):
        self.write({"state": "confirmed"})

    def action_done(self):
        self.write({"state": "done"})


class CommunityBudgetLine(models.Model):
    _name = "community.budget.line"
    _description = "Community Budget Line"

    budget_id = fields.Many2one("community.budget", required=True, ondelete="cascade")
    name = fields.Char(required=True)
    account_id = fields.Many2one("account.account", string="Account")
    analytic_account_id = fields.Many2one("account.analytic.account", string="Analytic Account")
    planned_amount = fields.Monetary(currency_field="currency_id")
    currency_id = fields.Many2one(related="budget_id.currency_id")
