param([string]$Database = "ui_rebuild_local")

$ErrorActionPreference = "Stop"
$custom = Split-Path $PSScriptRoot -Parent
& (Join-Path $custom "scripts\clone_oca.ps1")

$python = "C:\Users\laith\miniconda3\python.exe"
if (-not (Test-Path $python)) { $python = "python" }

$env:ODOO_DB = $Database
& $python (Join-Path $PSScriptRoot "uninstall_non_default_runner.py")
