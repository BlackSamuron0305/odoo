# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import fields, models


class AppointmentType(models.Model):
    _name = "appointment.type"
    _description = "Appointment Type"
    _order = "name"

    name = fields.Char(required=True)
    duration = fields.Float(string="Duration (hours)", default=1.0)
    user_ids = fields.Many2many("res.users", string="Staff")
    active = fields.Boolean(default=True)


class CalendarEvent(models.Model):
    _inherit = "calendar.event"

    appointment_type_id = fields.Many2one("appointment.type", string="Appointment Type")
