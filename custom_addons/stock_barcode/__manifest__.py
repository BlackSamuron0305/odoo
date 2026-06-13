# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Barcode",
    "version": "19.0.1.0.0",
    "category": "Supply Chain/Inventory",
    "summary": "Barcode scanner for warehouses",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["stock", "barcodes", "web"],
    "data": [
        "views/stock_barcode_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "stock_barcode/static/src/**/*",
        ],
    },
    "icon": "/base/static/img/icons/stock_barcode.png",
    "application": True,
    "installable": True,
}
