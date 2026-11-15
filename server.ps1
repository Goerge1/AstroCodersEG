$port   = 8080
$url    = "http://localhost:$port/"
$folder = $PSScriptRoot
if (-not $folder) { $folder = Get-Location }

# ── Load .env secrets (server-side only) ────────────────────────────
$envFile          = Join-Path $folder ".env"
$SUPABASE_URL     = ""
$SUPABASE_ANON_KEY = ""

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*SUPABASE_URL\s*=\s*(.+)') {
            $SUPABASE_URL = $Matches[1].Trim()
        }
        if ($_ -match '^\s*SUPABASE_ANON_KEY\s*=\s*(.+)') {
            $SUPABASE_ANON_KEY = $Matches[1].Trim()
        }
    }
}

# ── Build the __ENV__ snippet using double quotes inside the script tag ──
# We use a here-string so single-quotes in the JS do not break PowerShell parsing
$envSnippet = @"
<script>window.__ENV__={"SUPABASE_URL":"$SUPABASE_URL","SUPABASE_ANON_KEY":"$SUPABASE_ANON_KEY"};</script>
"@
$envSnippet = $envSnippet.Trim()

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "Astro World Server running at: $url" -ForegroundColor Green
    Write-Host "ENV secrets injected at serve-time (not in source files)." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray
    Write-Host "==========================================================" -ForegroundColor Cyan
    Start-Process $url

    while ($listener.IsListening) {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }

        # ── Block sensitive files ──────────────────────────────────────
        $lower = $path.ToLower()
        if ($lower.StartsWith(".env") -or $lower -eq "schema.sql" -or $lower -eq ".gitignore") {
            $response.StatusCode = 403
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            $response.Close()
            continue
        }

        # ── High-Fidelity Neural TTS Proxy ─────────────────────────────
        if ($lower -eq "api/tts") {
            $q  = $request.QueryString["q"]
            $tl = $request.QueryString["tl"]
            if ([string]::IsNullOrEmpty($tl)) { $tl = "ar" }
            if (-not [string]::IsNullOrEmpty($q)) {
                try {
                    $ttsUrl = "https://translate.google.com/translate_tts?ie=UTF-8&q=$([System.Uri]::EscapeDataString($q))&tl=$tl&client=tw-ob"
                    $wc = New-Object System.Net.WebClient
                    $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    $audioBytes = $wc.DownloadData($ttsUrl)
                    $response.ContentType = "audio/mpeg"
                    $response.ContentLength64 = $audioBytes.Length
                    $response.OutputStream.Write($audioBytes, 0, $audioBytes.Length)
                } catch {
                    $response.StatusCode = 502
                }
            } else {
                $response.StatusCode = 400
            }
            $response.Close()
            continue
        }

        $filePath = Join-Path $folder $path

        if ($filePath -and (Test-Path $filePath -PathType Leaf)) {
            $ext  = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html"  { "text/html; charset=utf-8" }
                ".css"   { "text/css; charset=utf-8" }
                ".js"    { "application/javascript; charset=utf-8" }
                ".mjs"   { "application/javascript; charset=utf-8" }
                ".json"  { "application/json; charset=utf-8" }
                ".png"   { "image/png" }
                ".jpg"   { "image/jpeg" }
                ".jpeg"  { "image/jpeg" }
                ".svg"   { "image/svg+xml" }
                ".webp"  { "image/webp" }
                Default  { "application/octet-stream" }
            }

            if ($ext -eq ".html") {
                # Inject __ENV__ before </head> if present
                $html  = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
                if ($html.Contains("</head>")) {
                    $inject = $envSnippet + "`n</head>"
                    $html  = $html.Replace("</head>", $inject)
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
            } else {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
            }

            $response.ContentType     = $mime
            $response.ContentLength64 = $bytes.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        }
        $response.Close()
    }
} catch {
    Write-Host "Server loop error: $_" -ForegroundColor Yellow
} finally {
    $listener.Stop()
}
 