# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class MarketingCampaign(models.Model):
    _name = "marketing.campaign"
    _description = "Marketing Automation Campaign"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "name"

    name = fields.Char(required=True, tracking=True)
    mail_template_id = fields.Many2one("mail.template", string="Email Template", domain="[('model', '=', 'mailing.list')]")
    mailing_list_id = fields.Many2one("mailing.list", string="Mailing List")
    state = fields.Selection(
        [("draft", "Draft"), ("running", "Running"), ("done", "Done")],
        default="draft",
        tracking=True,
    )
    participant_count = fields.Integer(compute="_compute_participant_count")

    def _compute_participant_count(self):
        for campaign in self:
            campaign.participant_count = len(campaign.mailing_list_id.contact_ids) if campaign.mailing_list_id else 0

    def action_start(self):
        self.write({"state": "running"})

    def action_done(self):
        self.write({"state": "done"})
