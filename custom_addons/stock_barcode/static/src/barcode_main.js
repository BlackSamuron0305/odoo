/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, onWillStart, useState } from "@odoo/owl";
import { BarcodeScanner } from "@barcodes/components/barcode_scanner";
import { rpc } from "@web/core/network/rpc";
import { _t } from "@web/core/l10n/translation";

export class StockBarcodeMain extends Component {
    static template = "stock_barcode.Main";
    static components = { BarcodeScanner };

    setup() {
        this.notification = useService("notification");
        this.state = useState({
            pickings: [],
            activePicking: null,
            lastScan: null,
            loading: true,
        });
        onWillStart(() => this.loadPickings());
    }

    async loadPickings() {
        this.state.loading = true;
        this.state.pickings = await rpc("/stock_barcode/operations");
        this.state.loading = false;
    }

    selectPicking(picking) {
        this.state.activePicking = picking;
        this.state.lastScan = null;
    }

    backToList() {
        this.state.activePicking = null;
        this.state.lastScan = null;
        this.loadPickings();
    }

    async onBarcodeScanned(barcode) {
        if (!this.state.activePicking) {
            this.notification.add(_t("Select a transfer first."), { type: "warning" });
            return;
        }
        try {
            const result = await rpc("/stock_barcode/scan", {
                picking_id: this.state.activePicking.id,
                barcode,
            });
            this.state.lastScan = result;
        } catch (e) {
            this.notification.add(e.message || _t("Scan failed."), { type: "danger" });
        }
    }

    async validatePicking() {
        if (!this.state.activePicking) {
            return;
        }
        try {
            const result = await rpc("/stock_barcode/validate", {
                picking_id: this.state.activePicking.id,
            });
            this.notification.add(
                _t("Transfer %s: %s", result.name, result.state),
                { type: "success" }
            );
            this.backToList();
        } catch (e) {
            this.notification.add(e.message || _t("Validation failed."), { type: "danger" });
        }
    }
}

registry.category("actions").add("stock_barcode_main", StockBarcodeMain);
