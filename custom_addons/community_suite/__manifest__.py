# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Community Suite",
    "summary": "App Store catalog for Enterprise replacements and Community apps (no auto-install)",
    "version": "19.0.4.2.0",
    "category": "Hidden",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["base", "web"],
    "data": [
        "views/app_learn_templates.xml",
        "views/ir_module_views.xml",
        "views/web_templates.xml",
        "data/community_suite_data.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "community_suite/static/src/xml/local_templates.xml",
            "community_suite/static/src/css/module_install.css",
            "community_suite/static/src/js/local_links.js",
            "community_suite/static/src/js/documentation_link.js",
            "community_suite/static/src/js/module_install_animation.js",
        ],
    },
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
    "auto_install": True,
}
