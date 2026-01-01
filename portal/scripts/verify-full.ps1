
param (
    [string]$Port = "3001"
)

$token = "devtoken123"
$url = "http://localhost:$Port/api/sot-events/ingest"

$body = @(
    @{
        schema  = "sot.events.v0.1"
        eventId = "test-db-sync-1"
        ts      = "2026-01-01T13:00:00Z"
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
    Write-Host "Sending Request to $url ..."
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Response Recieved:"
    $response | Format-List
    
    if ($response.errors -gt 0) {
        Write-Warning "Ingest reported breakdown:"
        Write-Host "Received: $($response.received)"
        Write-Host "Inserted: $($response.inserted)"
        Write-Host "Errors:   $($response.errors)"
        if ($response.sampleErrors) {
            Write-Host "Sample Errors:" -ForegroundColor Red
            $response.sampleErrors | Format-Table
        }
    }
    else {
        Write-Host "Success! No errors reported." -ForegroundColor Green
    }

}
catch {
    Write-Error $_
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        $errBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errBody"
    }
    exit 1
}
