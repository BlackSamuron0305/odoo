/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ViewButton } from "@web/views/view_button/view_button";

function moduleKanbanCard(el) {
    return el?.closest(".o_modules_kanban .o_kanban_record");
}

function isModuleInstallAction(record, clickParams) {
    return (
        record?.resModel === "ir.module.module" &&
        clickParams?.name === "button_immediate_install"
    );
}

function showInstallOverlay(card) {
    card.classList.add("o_module_installing");
    if (card.querySelector(".o_module_install_overlay")) {
        return;
    }
    const overlay = document.createElement("div");
    overlay.className = "o_module_install_overlay";
    overlay.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></i>' +
        '<span class="fw-semibold mt-2">Installing…</span>';
    card.appendChild(overlay);
}

patch(ViewButton.prototype, {
    onClick(ev, newWindow) {
        const card = moduleKanbanCard(ev.target);
        if (card && isModuleInstallAction(this.props.record, this.clickParams)) {
            showInstallOverlay(card);
        }
        return super.onClick(ev, newWindow);
    },
});
