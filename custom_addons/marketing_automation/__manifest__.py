# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Marketing Automation",
    "version": "19.0.1.0.0",
    "category": "Marketing/Email Marketing",
    "summary": "Build automated mailing campaigns",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["mass_mailing"],
    "data": [
        "security/ir.model.access.csv",
        "views/marketing_automation_views.xml",
    ],
    "icon": "/base/static/img/icons/marketing_automation.png",
    "application": True,
    "installable": True,
}
