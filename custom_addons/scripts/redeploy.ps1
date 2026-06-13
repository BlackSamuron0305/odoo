# Redeploy Odoo with UI rebuild + Community Suite apps on ui_rebuild_local
param(
    [string]$Database = "ui_rebuild_local",
    [string]$DbUser = "odoo",
    [string]$DbHost = "localhost",
    [string]$DbPassword = "odoo",
    [switch]$Install,
    [switch]$NoServer
)

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$custom = Split-Path $PSScriptRoot -Parent
$oca = Join-Path $custom "oca"

& (Join-Path $custom "scripts\clone_oca.ps1")

$paths = @(
    (Join-Path $root "odoo\addons"),
    (Join-Path $root "addons"),
    $custom,
    (Join-Path $oca "account-financial-reporting"),
    (Join-Path $oca "helpdesk"),
    (Join-Path $oca "multi-company"),
    (Join-Path $oca "server-ux"),
    (Join-Path $oca "reporting-engine"),
    (Join-Path $oca "sign")
) -join ","

$python = "C:\Users\laith\miniconda3\python.exe"
if (-not (Test-Path $python)) { $python = "python" }

$odooBin = Join-Path $root "odoo-bin"
$baseArgs = @(
    $odooBin,
    "-d", $Database,
    "--db_host=$DbHost",
    "--db_user=$DbUser",
    "--db_password=$DbPassword",
    "--addons-path=$paths"
)

if ($Install) {
    Write-Host "Installing community_suite on $Database..."
    & $python @baseArgs @("-i", "community_suite", "--stop-after-init")
} else {
    Write-Host "Upgrading community_suite + web (UI assets) on $Database..."
    & $python @baseArgs @("-u", "community_suite,web", "--stop-after-init")
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "Odoo module update failed (exit $LASTEXITCODE)"
}

Write-Host "Ensuring store apps are not pre-installed..."
& (Join-Path $PSScriptRoot "reset_store_apps.ps1") -Database $Database -DbUser $DbUser -DbHost $DbHost -DbPassword $DbPassword

if ($NoServer) {
    Write-Host "Done (server not started)."
    exit 0
}

Write-Host "Starting Odoo on http://localhost:8069 (db=$Database)..."
Write-Host "Apps menu: http://localhost:8069/odoo/apps?db=$Database"
Start-Process -FilePath $python -ArgumentList @baseArgs -WorkingDirectory $root
Write-Host "Odoo started in a new window."
