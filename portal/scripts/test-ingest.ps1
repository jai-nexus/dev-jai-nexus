$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:3000"
$endpoint = "$baseUrl/api/sot-events/ingest"
$token = "dev-token-123" 

# Check if server is up (basic)
try {
    $res = Invoke-WebRequest -Uri "$baseUrl/api/auth/session" -Method Get -ErrorAction SilentlyContinue
} catch {
    Write-Host "Server might not be running at $baseUrl. Please run 'pnpm dev' in another terminal." -ForegroundColor Red
    exit 1
}

Write-Host "Sending NDJSON batch..." -ForegroundColor Cyan

$ndjson = @"
{"ts":"2025-01-01T12:00:00Z","source":"smoke-test","kind":"check","eventId":"evt-001","summary":"First event"}
{"ts":"2025-01-01T12:00:01Z","source":"smoke-test","kind":"check","eventId":"evt-002","summary":"Second event"}
"@

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $ndjson -Headers @{ 
        "Authorization" = "Bearer $token"
        "Content-Type"  = "text/plain" # NDJSON is often text/plain or application/x-ndjson
    }
    Write-Host "Response:" -ForegroundColor Green
    $response | Format-List
} catch {
    Write-Host "Request failed: $_" -ForegroundColor Red
    if ($_.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        $reader.ReadToEnd()
    }
}

Write-Host "Sending Duplicate (Idempotency Check)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $ndjson -Headers @{ "Authorization" = "Bearer $token" }
    Write-Host "Response (Should update, not insert):" -ForegroundColor Green
    $response | Format-List
} catch {
    Write-Host "Request failed: $_" -ForegroundColor Red
}
