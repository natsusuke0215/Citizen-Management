# PowerShell script to download and convert Roboto font to Base64
# Run: .\scripts\setup-font.ps1

Write-Host "Downloading Roboto-Regular.ttf..." -ForegroundColor Cyan

$fontUrl = "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"
$fontPath = Join-Path $PSScriptRoot "Roboto-Regular.ttf"
$outputPath = Join-Path $PSScriptRoot "font-base64-output.txt"

try {
    # Download font
    Invoke-WebRequest -Uri $fontUrl -OutFile $fontPath -UseBasicParsing
    Write-Host "Font downloaded successfully!" -ForegroundColor Green
    
    # Convert to Base64
    Write-Host "Converting to Base64..." -ForegroundColor Cyan
    $fontBytes = [IO.File]::ReadAllBytes($fontPath)
    $fontBase64 = [Convert]::ToBase64String($fontBytes)
    
    # Save to file
    [IO.File]::WriteAllText($outputPath, $fontBase64, [System.Text.Encoding]::UTF8)
    
    Write-Host "Conversion successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Output file: $outputPath" -ForegroundColor Yellow
    Write-Host "Size: $([math]::Round($fontBase64.Length / 1024, 2)) KB" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open file lib/fonts.ts"
    Write-Host "2. Replace all content in ROBOTO_REGULAR_BASE64 with content from font-base64-output.txt"
    Write-Host "3. Remove DEMO_BASE64_STRING_PLACEHOLDER lines"
    Write-Host "4. Save file and test PDF again"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual method:" -ForegroundColor Yellow
    Write-Host "1. Download font from: https://fonts.google.com/specimen/Roboto"
    Write-Host "2. Place file at: scripts/Roboto-Regular.ttf"
    Write-Host "3. Run: node scripts/convert-font.js"
    exit 1
}

