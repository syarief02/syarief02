$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = 'c:\Users\User\OneDrive\Desktop\Unit Penyaringan\2_Arahan Kerja 300\Level 300_Arahan Kerja\300 UP 056 Identification of Steroids in Cosmetic Products by HPLC (ASEAN Harmonised Method ACM 007).doc'
$docxPath = 'c:\Users\User\OneDrive\Desktop\Unit Penyaringan\2_Arahan Kerja 300\Level 300_Arahan Kerja\300 UP 056 Identification of Steroids in Cosmetic Products by HPLC (ASEAN Harmonised Method ACM 007).docx'
try {
    $doc = $word.Documents.Open($docPath)
    $doc.SaveAs2($docxPath, 16)
    $doc.Close()
    Write-Output "Converted 056 successfully!"
} catch {
    Write-Error $_
} finally {
    $word.Quit()
}
