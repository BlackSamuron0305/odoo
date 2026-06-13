# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Planning",
    "version": "19.0.1.0.0",
    "category": "Services/Project",
    "summary": "Manage your employees' schedule",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["project", "hr"],
    "data": [
        "security/ir.model.access.csv",
        "views/planning_views.xml",
    ],
    "icon": "/base/static/img/icons/planning.png",
    "application": True,
    "installable": True,
}
