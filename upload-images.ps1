$BackendUrl = "https://evenix-backend.onrender.com"
$ImagesDir = "c:\Users\Utente\Documents\MonProjet\backend\uploads\images"

Write-Host "Uploading images to backend..." -ForegroundColor Green

$images = Get-ChildItem -Path $ImagesDir -File

foreach ($image in $images) {
    $filePath = $image.FullName
    $fileName = $image.Name
    
    Write-Host "Uploading: $fileName" -ForegroundColor Cyan
    
    & "C:\Windows\System32\curl.exe" -F "file=@$filePath" "$BackendUrl/files/upload-simple"
    
    Write-Host ""
}

Write-Host "Done!" -ForegroundColor Green
