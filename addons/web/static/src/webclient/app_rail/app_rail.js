/** @odoo-module **/
/**
 * Sprint 1 — AppRailSidebar
 * Desktop icon-rail sidebar: shows app icons in a vertical strip.
 * Collapsed = 56px icon-only; hover/click = expands to 240px with app names.
 * Only visible on ≥ lg breakpoint. Reads the exact same menuService APIs as NavBar.
 */

import { Component, useState, useEffect, useExternalListener } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class AppRailSidebar extends Component {
    static template = "web.AppRailSidebar";
    static props = {};

    setup() {
        this.menuService = useService("menu");
        this.actionService = useService("action");

        this.state = useState({
            expanded: false,
        });

        // Collapse sidebar when clicking outside
        useExternalListener(window, "click", this._onWindowClick.bind(this), { capture: true });

        // Add scroll listener to navbar for frosted-glass effect
        useEffect(() => {
            this._setupScrollEffect();
            return () => this._teardownScrollEffect();
        }, () => []);
    }

    get apps() {
        return this.menuService.getApps();
    }

    get currentApp() {
        return this.menuService.getCurrentApp();
    }

    toggleExpanded() {
        this.state.expanded = !this.state.expanded;
    }

    expand() {
        this.state.expanded = true;
    }

    collapse() {
        this.state.expanded = false;
    }

    /**
     * Navigate to an app — same call as the existing NavBar.
     * @param {Object} app
     */
    async selectApp(app) {
        const currentApp = this.currentApp;
        if (currentApp && currentApp.id === app.id) {
            this.collapse();
            return;
        }
        await this.menuService.selectMenu(app);
        this.collapse();
    }

    _onWindowClick(ev) {
        if (this.state.expanded && !this.el?.contains(ev.target)) {
            this.collapse();
        }
    }

    // ── Frosted-glass scroll effect for navbar ──────────────────────────────
    _setupScrollEffect() {
        this._scrollHandler = () => {
            const navbar = document.querySelector(".o_main_navbar");
            if (!navbar) return;
            if (window.scrollY > 0) {
                navbar.classList.add("o_navbar_scrolled");
            } else {
                navbar.classList.remove("o_navbar_scrolled");
            }
        };
        window.addEventListener("scroll", this._scrollHandler, { passive: true });
        // Run once on mount
        this._scrollHandler();
    }

    _teardownScrollEffect() {
        if (this._scrollHandler) {
            window.removeEventListener("scroll", this._scrollHandler);
        }
    }
}
