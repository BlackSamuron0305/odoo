# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Amazon Connector",
    "version": "19.0.1.0.0",
    "category": "Sales/Sales",
    "summary": "Import Amazon orders and sync deliveries",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["sale_management", "stock"],
    "data": [
        "security/ir.model.access.csv",
        "views/sale_amazon_views.xml",
    ],
    "icon": "/base/static/img/icons/sale_amazon.png",
    "application": True,
    "installable": True,
}
