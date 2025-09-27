<#
.SYNOPSIS
生成 noname 游戏资源清单脚本

.DESCRIPTION
自动扫描上级目录资源文件并生成 asset.js
版本号通过命令行参数或提示框输入
文件输出为 UTF-8 无 BOM 格式

.USAGE
方法1：通过参数指定版本号
PS> .\generateAsset.ps1 -version "1.10.17.3"

方法2：直接运行输入版本号
PS> .\generateAsset.ps1

方法3：双击运行脚本（需创建批处理文件）
#>

param (
	[string]$version = ""
)

# 获取脚本所在位置并推导基础路径
$scriptDir = $PSScriptRoot
$basePath = Split-Path -Path $scriptDir -Parent
$outputPath = Join-Path $scriptDir "asset.js"

# 请求版本号（命令行未提供时）
if (-not $version) {
	$version = Read-Host "请设置版本号（格式如 1.10.17.3）"
}

# 检查noname目录是否存在
if (-not (Test-Path -Path $basePath -PathType Container)) {
	Write-Host "错误: 未找到上级 noname 目录 $basePath" -ForegroundColor Red
	if (-not [System.Environment]::UserInteractive) { pause }
	exit
}

$folders = "audio", "font", "image", "theme"
$excludeDirs = "audio/effect", "image/flappybird", "image/pointer"
$allFiles = [System.Collections.ArrayList]@()

foreach ($folder in $folders) {
	$folderPath = Join-Path $basePath $folder
	if (Test-Path $folderPath -PathType Container) {
		$files = Get-ChildItem -Path $folderPath -File -Recurse

		foreach ($file in $files) {
			# 转换为相对路径并替换分隔符
			$relativePath = $file.FullName.Substring($basePath.Length + 1).Replace("\", "/")

			# 排除CSS文件和特定目录
			if ($file.Extension -eq ".css") { continue }

			# 检查是否在排除目录中
			$exclude = $false
			foreach ($exDir in $excludeDirs) {
				if ($relativePath -like "$exDir/*") {
					$exclude = $true
					break
				}
			}
			if ($exclude) { continue }

			# 添加到文件列表
			[void]$allFiles.Add($relativePath)
		}
	}
}

# 使用自然排序
$allFiles = $allFiles | Sort-Object { 
	[regex]::Replace($_, '\d+', { $args[0].Value.PadLeft(20) }) 
}

# 生成JS内容
$jsContent = @(
	"/* 自动生成的资源列表 - 请勿手动修改 */",
	"window.noname_asset_list = [",
	"`t`"v$version`","
)
$allFiles | ForEach-Object {
	$jsContent += "`t`"$_`","
}
$jsContent += @(
	"];",
	"window.noname_skin_list = {};",
	""
)

# 输出到文件（强制使用UTF-8无BOM格式）
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines(
	$outputPath, 
	$jsContent, 
	$utf8NoBom
)

# 显示结果
Write-Host "✅ 资源清单生成成功！" -ForegroundColor Green
Write-Host "├─ 扫描目录: $($basePath.Replace('\', '/'))"
Write-Host "├─ 输出文件: $($outputPath.Replace('\', '/'))"
Write-Host "├─ 包含资源: $($allFiles.Count) 项"
Write-Host "└─ 设置版本: v$version"
