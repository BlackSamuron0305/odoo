# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Appointments",
    "version": "19.0.1.0.0",
    "category": "Marketing",
    "summary": "Online appointments scheduler",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["calendar", "website"],
    "data": [
        "security/ir.model.access.csv",
        "views/appointment_views.xml",
    ],
    "icon": "/base/static/img/icons/appointment.png",
    "application": True,
    "installable": True,
}
