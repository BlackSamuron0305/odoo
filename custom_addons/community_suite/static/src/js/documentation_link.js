/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { DocumentationLink } from "@web/views/widgets/documentation_link/documentation_link";
import { session } from "@web/session";
import { rewriteOdooUrl } from "./local_links";

const LINK_REGEX = /^https?:\/\//;

patch(DocumentationLink.prototype, {
    get url() {
        const path = this.props.path;
        if (LINK_REGEX.test(path)) {
            return rewriteOdooUrl(path);
        }
        const serverVersion = session.server_version_info.includes("final")
            ? `${session.server_version_info[0]}.${session.server_version_info[1]}`.replace(
                  "~",
                  "-"
              )
            : "master";
        return `/web/documentation/${serverVersion}${path}`;
    },
});
