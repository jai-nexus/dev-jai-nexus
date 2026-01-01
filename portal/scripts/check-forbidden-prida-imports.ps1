param(
    [string]$Root = "portal/portal/src"
)

$pattern = "prisma/generated/prisma|generated/prisma"

if (-not (Test-Path $Root)) {
    Write-Host "❌ Root path not found: $Root"
    exit 2
}

$hits = Get-ChildItem -Path $Root -Recurse -File -Include *.ts, *.tsx, *.js, *.jsx |
Select-String -Pattern $pattern

if ($hits) {
    Write-Host "❌ Forbidden Prisma imports detected:"
    $hits | ForEach-Object { Write-Host ("{0}:{1} {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
    exit 1
}

Write-Host "✅ OK: no forbidden Prisma imports"
exit 0
