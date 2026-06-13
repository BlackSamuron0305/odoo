# Clone OCA dependencies for Community Enterprise replacements (Odoo 19)
$ErrorActionPreference = "Stop"
$oca = Join-Path $PSScriptRoot "oca"
New-Item -ItemType Directory -Force -Path $oca | Out-Null
Set-Location $oca

$repos = @(
    @{Name="account-financial-reporting"; Branch="19.0"},
    @{Name="helpdesk"; Branch="19.0"},
    @{Name="multi-company"; Branch="19.0"},
    @{Name="server-ux"; Branch="19.0"},
    @{Name="reporting-engine"; Branch="19.0"},
    @{Name="sign"; Branch="19.0"}
)

foreach ($r in $repos) {
    if (-not (Test-Path $r.Name)) {
        Write-Host "Cloning $($r.Name) @ $($r.Branch)..."
        git clone -b $r.Branch --depth 1 "https://github.com/OCA/$($r.Name).git"
    }
}

Write-Host "OCA clone complete."
