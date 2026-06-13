# Reset store apps on ui_rebuild_local (uninstall pre-installed replacements)
param(
    [string]$Database = "ui_rebuild_local"
)

$ErrorActionPreference = "Stop"
$custom = Split-Path $PSScriptRoot -Parent

& (Join-Path $custom "scripts\clone_oca.ps1")

$python = "C:\Users\laith\miniconda3\python.exe"
if (-not (Test-Path $python)) { $python = "python" }

$env:ODOO_DB = $Database
& $python (Join-Path $PSScriptRoot "reset_store_apps_runner.py")
