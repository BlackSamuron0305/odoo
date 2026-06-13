# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import api, models


class IrModuleModule(models.Model):
    _inherit = "ir.module.module"

    @api.model
    def _community_suite_apply(self):
        from odoo.addons.community_suite.hooks import apply_community_suite

        apply_community_suite(self.env)
