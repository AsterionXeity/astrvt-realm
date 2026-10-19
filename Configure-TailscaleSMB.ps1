# Configure-TailscaleSMB.ps1
# Sets Windows Network Profiles to Private and opens Inbound Firewall for Tailscale & Local LAN
# ==============================================================================

# Ensure Administrator Rights
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[!] ERROR: Please run PowerShell as Administrator." -ForegroundColor Red
    Exit 1
}

# Set all active Network Adapters (Tailscale, Ethernet, Wi-Fi) to 'Private' network category
try {
    $profiles = Get-NetConnectionProfile
    foreach ($profile in $profiles) {
        if ($profile.NetworkCategory -ne 'Private') {
            Set-NetConnectionProfile -InterfaceAlias $profile.InterfaceAlias -NetworkCategory Private -ErrorAction Stop
            Write-Host "[+] Set network interface '$($profile.InterfaceAlias)' to Private profile." -ForegroundColor Green
        } else {
            Write-Host "[+] Interface '$($profile.InterfaceAlias)' is already set to Private profile." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "[!] Could not update network profile: $_" -ForegroundColor Yellow
}

# Create / Update Windows Firewall Rule allowing ALL inbound traffic for Tailscale Subnet (100.64.0.0/10) AND Local LAN (LocalSubnet)
$ruleName = "Tailscale and LAN Inbound (All Traffic)"
$allowedSubnets = @("100.64.0.0/10", "LocalSubnet")

# Clean up older limited rules if present
$oldRuleNames = @(
    "Tailscale SMB (Port 445) Inbound Only",
    "Tailscale and LAN SMB (Port 445) Inbound"
)
foreach ($oldName in $oldRuleNames) {
    $oldRule = Get-NetFirewallRule -DisplayName $oldName -ErrorAction SilentlyContinue
    if ($oldRule) {
        Remove-NetFirewallRule -DisplayName $oldName
    }
}

$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($existingRule) {
    Set-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol Any -RemoteAddress $allowedSubnets -Enabled True
    Write-Host "[+] Windows Firewall rule updated: ALL inbound traffic allowed for Tailscale (100.64.0.0/10) and Local LAN (LocalSubnet)" -ForegroundColor Green
} else {
    $firewallParams = @{
        DisplayName   = $ruleName
        Name          = "Tailscale_LAN_Inbound_All"
        Description   = "Allows all inbound traffic from Tailscale devices (100.64.0.0/10) and local LAN devices across all ports and protocols"
        Direction     = "Inbound"
        Action        = "Allow"
        Protocol      = "Any"
        RemoteAddress = $allowedSubnets
        Profile       = @("Private", "Public", "Domain")
        Enabled       = "True"
    }
    New-NetFirewallRule @firewallParams | Out-Null
    Write-Host "[+] Windows Firewall rule created: ALL inbound traffic allowed for Tailscale (100.64.0.0/10) and Local LAN (LocalSubnet)" -ForegroundColor Green
}
