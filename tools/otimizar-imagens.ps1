param(
    [int]$MaxDimension = 1600,
    [int]$Quality = 78
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$sourceDirectory = Join-Path $PSScriptRoot '..\..\imagem'
$destinationDirectory = Join-Path $PSScriptRoot '..\assets\images'
New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]$Quality
)

Get-ChildItem -Path $sourceDirectory -Filter '*.jpg' -File | ForEach-Object {
    $destination = Join-Path $destinationDirectory $_.Name
    $sourceImage = [System.Drawing.Image]::FromFile($_.FullName)

    try {
        $scale = [Math]::Min(1.0, [double]$MaxDimension / [double][Math]::Max($sourceImage.Width, $sourceImage.Height))
        $width = [Math]::Max(1, [Math]::Round($sourceImage.Width * $scale))
        $height = [Math]::Max(1, [Math]::Round($sourceImage.Height * $scale))

        $bitmap = New-Object System.Drawing.Bitmap $width, $height
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
                $bitmap.Save($destination, $jpegCodec, $encoderParameters)
            }
            finally { $graphics.Dispose() }
        }
        finally { $bitmap.Dispose() }

        $savedKb = [Math]::Round((Get-Item $destination).Length / 1KB)
        Write-Output "$($_.Name): ${width}x${height}, $savedKb KB"
    }
    finally { $sourceImage.Dispose() }
}
