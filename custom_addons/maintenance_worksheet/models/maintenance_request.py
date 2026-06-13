# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class MaintenanceRequest(models.Model):
    _inherit = "maintenance.request"

    worksheet = fields.Html(string="Worksheet")
    checklist_done = fields.Boolean(string="Checklist Completed", default=False)
