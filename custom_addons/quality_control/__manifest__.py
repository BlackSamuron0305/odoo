# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Quality",
    "version": "19.0.1.0.0",
    "category": "Supply Chain/Quality",
    "summary": "Quality alerts and control points",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["stock", "mail"],
    "data": [
        "security/ir.model.access.csv",
        "views/quality_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "icon": "/base/static/img/icons/quality_control.png",
    "application": True,
    "installable": True,
}
