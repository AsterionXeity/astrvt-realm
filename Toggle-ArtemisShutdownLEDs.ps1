param (
    [switch]$On,
    [switch]$Off
)

$moduleId = "shutdown-leds"
$schemaUrl = "http://localhost:9696/json-modules/$moduleId/schema"
$dataUrl = "http://localhost:9696/json-modules/$moduleId/data"
$stateFile = Join-Path $env:TEMP "artemis-shutdown-leds-state.txt"

# Determine the new state
$newState = $null
if ($On) {
    $newState = $true
} elseif ($Off) {
    $newState = $false
} else {
    # Toggle based on previous state
    $currentState = $false
    if (Test-Path $stateFile) {
        $currentState = [System.Convert]::ToBoolean((Get-Content $stateFile))
    }
    $newState = -not $currentState
}

# 1. Ensure the schema is registered (safe to call multiple times)
$schema = @{
    title = "Shutdown LEDs Module"
    type = "object"
    properties = @{
        turnOffLeds = @{ type = "boolean" }
    }
} | ConvertTo-Json -Compress

try {
    Invoke-RestMethod -Uri $schemaUrl -Method Post -Body $schema -ContentType "application/json" -ErrorAction Stop | Out-Null
} catch {
    Write-Warning "Failed to register schema. Is Artemis running and Web API enabled?"
    Write-Error $_
    exit
}

# 2. Send the data to Artemis
$data = @{
    turnOffLeds = $newState
} | ConvertTo-Json -Compress

try {
    Invoke-RestMethod -Uri $dataUrl -Method Post -Body $data -ContentType "application/json" -ErrorAction Stop | Out-Null
    
    # Save the state for the next toggle
    $newState.ToString() | Out-File -FilePath $stateFile -Encoding utf8
    
    Write-Host "Successfully toggled 'Turn off LEDs on shutdown' to: $newState" -ForegroundColor Green
} catch {
    Write-Warning "Failed to send data to Artemis."
    Write-Error $_
}
