$src = "C:\Users\finkk\.gemini\antigravity\brain\5832af2b-9100-4e29-bb3b-19a750c94941"
$dst = "d:\laragon\www\DonatVerse-main\img"

Copy-Item "$src\choco_donut_new_1776902294383.png"      "$dst\choco.png"      -Force
Copy-Item "$src\strawberry_donut_new_1776902332376.png" "$dst\strawberry.png" -Force
Copy-Item "$src\blueberry_donut_new_1776902361793.png"  "$dst\blueberry.png"  -Force
Copy-Item "$dst\greentea.png" "$dst\matcha.png" -Force

Write-Host "Done!" -ForegroundColor Green
