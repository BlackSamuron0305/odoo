# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Phone",
    "version": "19.0.1.0.0",
    "category": "Sales/Sales",
    "summary": "Call using VoIP",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["crm", "phone_validation"],
    "data": [
        "security/ir.model.access.csv",
        "views/voip_views.xml",
    ],
    "icon": "/base/static/img/icons/voip.png",
    "application": True,
    "installable": True,
}
