# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class PlanningSlot(models.Model):
    _name = "planning.slot"
    _description = "Planning Shift"
    _order = "start_datetime desc"

    name = fields.Char(required=True)
    employee_id = fields.Many2one("hr.employee", string="Employee", required=True)
    project_id = fields.Many2one("project.project", string="Project")
    role = fields.Char(string="Role")
    start_datetime = fields.Datetime(required=True)
    end_datetime = fields.Datetime(required=True)
    state = fields.Selection(
        [("draft", "Draft"), ("published", "Published")],
        default="draft",
    )

    def action_publish(self):
        self.write({"state": "published"})
