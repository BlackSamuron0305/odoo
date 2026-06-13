# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class SocialPost(models.Model):
    _name = "social.post"
    _description = "Social Media Post"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "scheduled_date desc"

    name = fields.Char(required=True, tracking=True)
    body = fields.Html(string="Content")
    platform = fields.Selection(
        [("facebook", "Facebook"), ("twitter", "X / Twitter"), ("linkedin", "LinkedIn"), ("instagram", "Instagram")],
        default="facebook",
        required=True,
    )
    scheduled_date = fields.Datetime(string="Scheduled Date")
    state = fields.Selection(
        [("draft", "Draft"), ("scheduled", "Scheduled"), ("posted", "Posted")],
        default="draft",
        tracking=True,
    )
    utm_campaign_id = fields.Many2one("utm.campaign", string="Campaign")

    def action_schedule(self):
        self.write({"state": "scheduled"})

    def action_post(self):
        self.write({"state": "posted"})
