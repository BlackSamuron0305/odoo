# Install community_suite on a database
param(
    [string]$Database = "ui_rebuild_local",
    [string]$DbUser = "odoo",
    [string]$DbHost = "localhost",
    [string]$DbPassword = ""
)

$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$oca = Join-Path (Split-Path $PSScriptRoot -Parent) "oca"

& (Join-Path (Split-Path $PSScriptRoot -Parent) "scripts\clone_oca.ps1")

$paths = @(
    (Join-Path $root "odoo\addons"),
    (Join-Path $root "addons"),
    (Join-Path $root "custom_addons"),
    (Join-Path $oca "account-financial-reporting"),
    (Join-Path $oca "helpdesk"),
    (Join-Path $oca "multi-company"),
    (Join-Path $oca "server-ux"),
    (Join-Path $oca "reporting-engine"),
    (Join-Path $oca "sign")
) -join ","

$args = @(
    (Join-Path $root "odoo-bin"),
    "-d", $Database,
    "--db_host=$DbHost",
    "--db_user=$DbUser",
    "--addons-path=$paths",
    "-i", "community_suite",
    "--stop-after-init"
)
if ($DbPassword) { $args += "--db_password=$DbPassword" }

    Write-Host "Installing community_suite on $Database..."
    $python = "C:\Users\laith\miniconda3\python.exe"
    if (-not (Test-Path $python)) { $python = "python" }
    & $python @args
