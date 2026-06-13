# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "SEPA Direct Debit Payment Provider",
    "version": "19.0.1.0.0",
    "category": "Accounting/Accounting",
    "summary": "Checkout with SEPA Direct Debit",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["payment", "account"],
    "post_init_hook": "post_init_hook",
    "icon": "/base/static/img/icons/payment_sepa_direct_debit.png",
    "application": False,
    "installable": True,
}
