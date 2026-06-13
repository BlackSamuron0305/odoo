# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import api, fields, models


class IrModuleModule(models.Model):
    _inherit = "ir.module.module"

    local_learn_url = fields.Char(compute="_compute_local_learn_url")

    @api.depends("name")
    def _compute_local_learn_url(self):
        for module in self:
            module.local_learn_url = (
                f"/web/apps/learn/{module.name}" if module.name else False
            )

    @api.model
    def _community_suite_apply(self):
        from odoo.addons.community_suite.hooks import apply_community_suite

        apply_community_suite(self.env)