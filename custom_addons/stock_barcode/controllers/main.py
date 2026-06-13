# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

from odoo import http
from odoo.http import request


class StockBarcodeController(http.Controller):

    @http.route("/stock_barcode/operations", type="jsonrpc", auth="user")
    def get_operations(self, limit=50):
        return request.env["stock.picking"].barcode_get_operations(limit=limit)

    @http.route("/stock_barcode/scan", type="jsonrpc", auth="user")
    def scan(self, picking_id, barcode):
        return request.env["stock.picking"].barcode_process_scan(picking_id, barcode)

    @http.route("/stock_barcode/validate", type="jsonrpc", auth="user")
    def validate(self, picking_id):
        picking = request.env["stock.picking"].browse(picking_id).exists()
        if not picking:
            return {"error": "not_found"}
        picking.barcode_validate()
        return {"state": picking.state, "name": picking.name}
