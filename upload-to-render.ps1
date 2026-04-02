$backendUrl = "https://evenix-backend.onrender.com"
$localImagesPath = "c:\Users\Utente\Documents\MonProjet\backend\uploads\images"
$uploadEndpoint = "$backendUrl/files/upload-simple"

Write-Host "Uploading images to Render backend..." -ForegroundColor Cyan
Write-Host "Endpoint: $uploadEndpoint" -ForegroundColor Gray

$images = Get-ChildItem -Path $localImagesPath -File

foreach ($image in $images) {
    $imagePath = $image.FullName
    $imageName = $image.Name
    
    Write-Host "Uploading: $imageName..." -ForegroundColor Yellow
    
    try {
        $form = @{ file = Get-Item -Path $imagePath }
        $response = Invoke-WebRequest -Uri $uploadEndpoint -Method Post -Form $form -ErrorAction Stop
        Write-Host "Success: $imageName - Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed: $imageName - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Upload complete!" -ForegroundColor Cyan
