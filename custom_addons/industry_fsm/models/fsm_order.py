# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class FsmOrder(models.Model):
    _name = "fsm.order"
    _description = "Field Service Order"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "scheduled_date desc, id desc"

    name = fields.Char(required=True, default="New", copy=False)
    partner_id = fields.Many2one("res.partner", string="Customer", required=True, tracking=True)
    project_id = fields.Many2one("project.project", string="Project")
    task_id = fields.Many2one("project.task", string="Task")
    user_id = fields.Many2one("res.users", string="Assigned To", tracking=True)
    scheduled_date = fields.Datetime(string="Scheduled Date", tracking=True)
    description = fields.Html()
    state = fields.Selection(
        [
            ("draft", "New"),
            ("scheduled", "Scheduled"),
            ("in_progress", "In Progress"),
            ("done", "Done"),
            ("cancelled", "Cancelled"),
        ],
        default="draft",
        tracking=True,
    )

    def action_schedule(self):
        self.write({"state": "scheduled"})

    def action_start(self):
        self.write({"state": "in_progress"})

    def action_done(self):
        self.write({"state": "done"})
