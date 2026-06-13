# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Field Service",
    "version": "19.0.1.0.0",
    "category": "Services/Field Service",
    "summary": "Schedule and track onsite operations, time and material",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["project", "stock"],
    "data": [
        "security/ir.model.access.csv",
        "views/fsm_views.xml",
    ],
    "icon": "/base/static/img/icons/industry_fsm.png",
    "application": True,
    "installable": True,
}
