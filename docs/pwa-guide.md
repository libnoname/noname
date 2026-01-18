# 简介
PWA是将浏览器应用安装到桌面的技术。安装后，用户可以不看到浏览器难看的头和尾。
# 用法
1. 项目配置（本pr已完成）
2. 浏览器支持
3. *解决问题*
4. 浏览器会提供下载按钮，点击即可。
## 问题
桌面浏览器可以直接安装，移动端浏览器需https/localhost站点才支持安装。
## 解决
1. 服务端安装自签名证书，使用pwsh脚本
```pwsh
# generate-dev-cert.ps1
  param(
    [string]$ip,
    [string]$OutDir = "certs",
    [string]$Passphrase = "noname-dev"
  )

  $ErrorActionPreference = "Stop"

  function Get-LocalPrivateIPv4 {
    $candidates = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
      Where-Object {
        $_.IPAddress -match '^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)'
      } |
      Sort-Object -Property InterfaceMetric, PrefixLength

    return $candidates[0].IPAddress
  }

  if (-not $ip) {
    $ip = Get-LocalPrivateIPv4
    if (-not $ip) { throw "未找到私有网段 IPv4，请手动传入 -ip。" }
  }

  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

  $san = "2.5.29.17={text}DNS=localhost&IPAddress=$ip&IPAddress=127.0.0.1"
  $cert = New-SelfSignedCertificate `
    -Type Custom `
    -Subject "CN=noname-dev" `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -HashAlgorithm SHA256 `
    -KeyUsage DigitalSignature,KeyEncipherment `
    -TextExtension @($san) `
    -CertStoreLocation "Cert:\CurrentUser\My"

  $pwd = ConvertTo-SecureString -String $Passphrase -Force -AsPlainText
  Export-PfxCertificate -Cert $cert -FilePath "$OutDir\noname-dev.pfx" -Password $pwd | Out-Null
  Export-Certificate -Cert $cert -FilePath "$OutDir\noname-dev.cer" | Out-Null

  Write-Host "Detected IP: $ip"
  Write-Host "Generated:"
  Write-Host " - $OutDir\noname-dev.pfx"
  Write-Host " - $OutDir\noname-dev.cer"
  Write-Host "Passphrase: $Passphrase"
```
使用：
右键保存成generate-dev-cert.ps1，然后运行：
```pwsh
  powershell -ExecutionPolicy Bypass -File generate-dev-cert.ps1
```
or
```pwsh
  powershell -ExecutionPolicy Bypass -File generate-dev-cert.ps1 -ip 192.168.2.105
```
手机安装该证书。（安装也很麻烦）
2. 修改手机host文件，将localhost绑定到服务器ip，欺骗浏览器。此法也有点麻烦，且不安全！
