$BackendUrl = "https://evenix-backend.onrender.com"

# Mapping des anciens noms vers les nouveaux noms
$imageMapping = @{
    "event_1767731725433_f04f6f9c.jpg" = "event_1775157086525_836161b3.jpg"
    "event_1767732256076_7594c16a.jpg" = "event_1775157086865_6d869708.jpg"
    "event_1767732304324_ee1f3d49.jpg" = "event_1775157087309_16fb07a7.jpg"
    "event_1767732541267_a1d12c20.png" = "event_1775157087588_c4c89adc.png"
    "event_1767732568405_8b853f8f.jpg" = "event_1775157087962_51a16330.jpg"
}

Write-Host "Renaming uploaded images to expected names..." -ForegroundColor Green
Write-Host ""

foreach ($oldName in $imageMapping.Keys) {
    $newName = $imageMapping[$oldName]
    
    Write-Host "Renaming: $newName -> $oldName" -ForegroundColor Cyan
    
    # Utiliser curl pour faire un copy via le backend
    & "C:\Windows\System32\curl.exe" -X GET "$BackendUrl/files/$newName" -o "C:\temp\$oldName"
    
    if (Test-Path "C:\temp\$oldName") {
        Write-Host "✅ Downloaded: $oldName" -ForegroundColor Green
        
        # Upload avec l'ancien nom
        & "C:\Windows\System32\curl.exe" -F "file=@C:\temp\$oldName" "$BackendUrl/files/upload-simple"
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
