# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class VoipCall(models.Model):
    _name = "voip.call"
    _description = "VoIP Call Log"
    _order = "create_date desc"

    name = fields.Char(string="Reference", required=True)
    partner_id = fields.Many2one("res.partner", string="Contact")
    phone = fields.Char(required=True)
    direction = fields.Selection([("inbound", "Inbound"), ("outbound", "Outbound")], default="outbound")
    duration = fields.Float(string="Duration (min)")
    state = fields.Selection(
        [("draft", "Draft"), ("ongoing", "Ongoing"), ("done", "Done"), ("missed", "Missed")],
        default="draft",
    )
    note = fields.Text()

    def action_done(self):
        self.write({"state": "done"})
