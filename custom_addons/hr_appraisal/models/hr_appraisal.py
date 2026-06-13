# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class HrAppraisal(models.Model):
    _name = "hr.appraisal"
    _description = "Employee Appraisal"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "date_close desc"

    name = fields.Char(required=True)
    employee_id = fields.Many2one("hr.employee", required=True, tracking=True)
    manager_id = fields.Many2one("hr.employee", string="Manager", tracking=True)
    date_close = fields.Date(string="Appraisal Date", tracking=True)
    note = fields.Html(string="Feedback")
    state = fields.Selection(
        [("new", "New"), ("pending", "Pending"), ("done", "Done"), ("cancel", "Cancelled")],
        default="new",
        tracking=True,
    )

    def action_done(self):
        self.write({"state": "done"})
