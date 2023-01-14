@"
$((Get-Content -Raw readme/header.md).Trim())

$(Get-ChildItem readme/* -Include *.ts | ForEach-Object {
@"
## [$($_.Name)](./src/$($_.Name))

``````ts
$((Get-Content -Raw $_).Trim())
``````
"@ `
| Write-Output
})
"@
| Out-File "README.md"
