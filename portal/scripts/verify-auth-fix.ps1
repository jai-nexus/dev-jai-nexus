
$token = "devtoken123"
$url = "http://localhost:3000/api/sot-events/ingest"

$body = @(
    @{
        schema  = "sot.events.v0.1"
        eventId = "test-auth-fix-1"
        ts      = "2026-01-01T12:00:00Z"
        source  = "local.test"
        kind    = "test.ping"
        actor   = "SYSTEM"
        nhId    = "0.0"
        payload = @{}
    }
) | ConvertTo-Json -Compress

$headers = @{
    "Content-Type"       = "application/json"
    "x-sot-ingest-token" = $token
}

try {
    Write-Host "Sending Request to $url with x-sot-ingest-token..."
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Success! Response:"
    $response | Format-List
}
catch {
    Write-Error $_
    exit 1
}
