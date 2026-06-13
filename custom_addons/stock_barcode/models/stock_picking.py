# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import api, models, _
from odoo.exceptions import UserError


class StockPicking(models.Model):
    _inherit = "stock.picking"

    @api.model
    def barcode_get_operations(self, limit=50):
        """Return pending pickings for the barcode home screen."""
        domain = [
            ("state", "in", ["assigned", "confirmed", "waiting"]),
            ("picking_type_id.code", "in", ["incoming", "outgoing", "internal"]),
        ]
        pickings = self.search(domain, limit=limit, order="scheduled_date asc, id desc")
        return [
            {
                "id": p.id,
                "name": p.name,
                "partner": p.partner_id.display_name or "",
                "type": p.picking_type_id.display_name,
                "state": p.state,
                "count": len(p.move_ids),
            }
            for p in pickings
        ]

    @api.model
    def barcode_process_scan(self, picking_id, barcode):
        """Process a barcode scan on a picking: location, product, or package."""
        picking = self.browse(picking_id).exists()
        if not picking:
            raise UserError(_("Transfer not found."))
        if picking.state not in ("assigned", "confirmed", "waiting"):
            raise UserError(_("This transfer cannot be processed (state: %s).") % picking.state)

        barcode = (barcode or "").strip()
        if not barcode:
            raise UserError(_("Empty barcode."))

        # Location barcode
        location = self.env["stock.location"].search([("barcode", "=", barcode)], limit=1)
        if location:
            return {"action": "location", "name": location.display_name, "id": location.id}

        # Product / packaging barcode
        product = self.env["product.product"].search([("barcode", "=", barcode)], limit=1)
        if not product:
            packaging = self.env["product.packaging"].search([("barcode", "=", barcode)], limit=1)
            if packaging:
                product = packaging.product_id

        if product:
            move_line = picking.move_line_ids.filtered(
                lambda ml: ml.product_id == product
                and ml.quantity < ml.move_id.product_uom_qty
            )[:1]
            if not move_line:
                move_line = picking.move_line_ids.filtered(lambda ml: ml.product_id == product)[:1]
            if move_line:
                demand = move_line.move_id.product_uom_qty
                qty = move_line.quantity + 1
                if demand and qty > demand:
                    qty = demand
                move_line.quantity = qty
                return {
                    "action": "product",
                    "name": product.display_name,
                    "quantity": qty,
                    "demand": demand,
                }
            return {
                "action": "product_not_in_picking",
                "name": product.display_name,
            }

        # Picking name / reference
        if barcode == picking.name:
            return {"action": "picking", "name": picking.name}

        raise UserError(_("No matching product, location, or transfer for barcode: %s") % barcode)

    def barcode_validate(self):
        """Validate the picking from the barcode UI."""
        self.ensure_one()
        if self.state == "assigned":
            self.button_validate()
        elif self.state in ("confirmed", "waiting"):
            self.action_assign()
            if self.state == "assigned":
                self.button_validate()
        return True
