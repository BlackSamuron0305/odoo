# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Invoice Digitization",
    "version": "19.0.1.0.0",
    "category": "Accounting/Accounting",
    "summary": "Digitize vendor bills with OCR",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["account"],
    "data": [
        "security/ir.model.access.csv",
        "wizard/account_extract_wizard_views.xml",
    ],
    "icon": "/base/static/img/bill.png",
    "application": False,
    "installable": True,
}
