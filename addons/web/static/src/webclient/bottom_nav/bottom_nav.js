/** @odoo-module **/

import { Component, useState, useEffect } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

/**
 * Sprint 5 — PWA Bottom Navigation Bar
 * Shows on mobile (<md) in PWA standalone mode only.
 * Tabs: Home, and the first 3 installed app shortcuts + Menu.
 */
export class BottomNav extends Component {
    static template = "web.BottomNav";
    static props = {};

    setup() {
        this.menuService = useService("menu");
        this.actionService = useService("action");

        this.state = useState({
            currentAppId: null,
            keyboardVisible: false,
        });

        // Detect virtual keyboard (hide bottom nav when keyboard open)
        useEffect(() => {
            if (!window.visualViewport) return;
            const onResize = () => {
                const threshold = window.innerHeight * 0.6;
                this.state.keyboardVisible = window.visualViewport.height < threshold;
            };
            window.visualViewport.addEventListener("resize", onResize);
            return () => window.visualViewport.removeEventListener("resize", onResize);
        });
    }

    get apps() {
        const apps = this.menuService.getApps();
        // Return up to 3 apps for the tab bar (plus Home and Menu = 5 total)
        return apps.slice(0, 3);
    }

    get currentApp() {
        return this.menuService.getCurrentApp();
    }

    selectApp(app) {
        this.menuService.selectMenu(app);
        // Haptic feedback where supported
        if (navigator.vibrate) navigator.vibrate(10);
    }

    goHome() {
        this.actionService.doAction("menu");
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

registry.category("main_components").add("BottomNav", {
    Component: BottomNav,
    props: {},
});
