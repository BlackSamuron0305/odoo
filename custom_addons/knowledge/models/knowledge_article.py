# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class KnowledgeArticle(models.Model):
    _name = "knowledge.article"
    _description = "Knowledge Article"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "name"

    name = fields.Char(required=True, tracking=True)
    parent_id = fields.Many2one("knowledge.article", string="Parent Article", ondelete="cascade")
    child_ids = fields.One2many("knowledge.article", "parent_id", string="Articles")
    body = fields.Html(string="Content")
    active = fields.Boolean(default=True)
    user_id = fields.Many2one("res.users", string="Owner", default=lambda self: self.env.user)
