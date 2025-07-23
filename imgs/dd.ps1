# Obtener archivos en el directorio actual
$archivos = Get-ChildItem -File | Select-Object -ExpandProperty Name

# Crear archivo CSV con encabezado
"NombreArchivo" | Out-File -Encoding UTF8 archivos.csv

# Agregar nombres al archivo CSV
$archivos | ForEach-Object {
    $_ | Out-File -Append -Encoding UTF8 archivos.csv
}