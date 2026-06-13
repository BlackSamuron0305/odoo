# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import http
from odoo.http import request


class CommunityLocalController(http.Controller):

    @http.route(
        "/web/apps/learn/<string:module_name>",
        type="http",
        auth="user",
        readonly=True,
        sitemap=False,
    )
    def app_learn(self, module_name, **kw):
        module = request.env["ir.module.module"].sudo().search(
            [("name", "=", module_name)], limit=1
        )
        if not module:
            return request.not_found()
        return request.render(
            "community_suite.app_learn_page",
            {
                "module": module,
                "page_title": module.shortdesc or module_name,
            },
        )

    @http.route(
        "/web/documentation/<path:doc_path>",
        type="http",
        auth="user",
        readonly=True,
        sitemap=False,
    )
    def documentation(self, doc_path, **kw):
        return request.render(
            "community_suite.documentation_page",
            {"doc_path": doc_path},
        )
