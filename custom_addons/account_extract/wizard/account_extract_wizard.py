# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

import base64

from odoo import _, fields, models
from odoo.exceptions import UserError


class AccountExtractWizard(models.TransientModel):
    _name = "account.extract.wizard"
    _description = "Digitize Vendor Bill"

    file_data = fields.Binary(string="Bill", required=True)
    file_name = fields.Char(string="Filename")
    partner_id = fields.Many2one("res.partner", string="Vendor")
    reference = fields.Char(string="Bill Reference")
    amount = fields.Monetary(string="Total")
    currency_id = fields.Many2one(
        "res.currency",
        string="Currency",
        default=lambda self: self.env.company.currency_id,
    )

    def action_create_bill(self):
        self.ensure_one()
        if not self.file_data:
            raise UserError(_("Please upload a bill document."))

        move = self.env["account.move"].create({
            "move_type": "in_invoice",
            "partner_id": self.partner_id.id,
            "ref": self.reference or self.file_name,
            "invoice_line_ids": [(0, 0, {
                "name": self.reference or _("Digitized vendor bill"),
                "quantity": 1,
                "price_unit": self.amount or 0.0,
            })] if self.amount else [],
        })

        self.env["ir.attachment"].create({
            "name": self.file_name or "vendor_bill",
            "type": "binary",
            "datas": self.file_data,
            "res_model": "account.move",
            "res_id": move.id,
            "mimetype": self._guess_mimetype(),
        })

        return {
            "type": "ir.actions.act_window",
            "name": _("Vendor Bill"),
            "res_model": "account.move",
            "res_id": move.id,
            "view_mode": "form",
            "target": "current",
        }

    def _guess_mimetype(self):
        name = (self.file_name or "").lower()
        if name.endswith(".pdf"):
            return "application/pdf"
        if name.endswith(".png"):
            return "image/png"
        if name.endswith((".jpg", ".jpeg")):
            return "image/jpeg"
        return "application/octet-stream"
