# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Product Lifecycle Management (PLM)",
    "version": "19.0.1.0.0",
    "category": "Supply Chain",
    "summary": "PLM, ECOs, versions",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["mrp"],
    "data": [
        "security/ir.model.access.csv",
        "views/mrp_plm_views.xml",
    ],
    "icon": "/base/static/img/icons/mrp_plm.png",
    "application": True,
    "installable": True,
}
