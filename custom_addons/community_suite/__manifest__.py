# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0)

{
    "name": "Community Suite",
    "summary": "App Store catalog for Enterprise replacements and Community apps (no auto-install)",
    "version": "19.0.3.0.0",
    "category": "Hidden",
    "license": "LGPL-3",
    "author": "Community",
    "depends": ["base"],
    "data": [
        "data/community_suite_data.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
    "auto_install": True,
}
