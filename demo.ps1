# -------------------------------
# CONFIG
# -------------------------------
$baseUrl = "http://localhost:4000"
$email = "test@example.com"
$password = "password123"
$projectName = "My First Project"
$promptContent = "You are a helpful assistant."
$chatMessage = "Hello, AI! How are you?"

# -------------------------------
# 1️⃣ Register
# -------------------------------
try {
    $registerResponse = Invoke-RestMethod `
        -Uri "$baseUrl/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{ email = $email; password = $password } | ConvertTo-Json)

    Write-Host "✅ Registered user: $($registerResponse.email)"
} catch {
    Write-Host "⚠️ Registration failed: $($_.Exception.Response.Content.ReadAsStringAsync().Result)"
}

# -------------------------------
# 2️⃣ Login
# -------------------------------
$loginResponse = Invoke-RestMethod `
    -Uri "$baseUrl/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{ email = $email; password = $password } | ConvertTo-Json)

$token = $loginResponse.token
Write-Host "✅ Logged in. JWT token received."

$authHeader = @{ Authorization = "Bearer $token" }

# -------------------------------
# 3️⃣ Create Project
# -------------------------------
$projectResponse = Invoke-RestMethod `
    -Uri "$baseUrl/projects" `
    -Method POST `
    -Headers $authHeader `
    -ContentType "application/json" `
    -Body (@{ name = $projectName } | ConvertTo-Json)

$projectId = $projectResponse.id
Write-Host "✅ Project created: $($projectResponse.name) (ID: $projectId)"

# -------------------------------
# 4️⃣ Add Prompt
# -------------------------------
$promptResponse = Invoke-RestMethod `
    -Uri "$baseUrl/projects/$projectId/prompts" `
    -Method POST `
    -Headers $authHeader `
    -ContentType "application/json" `
    -Body (@{ content = $promptContent } | ConvertTo-Json)

Write-Host "✅ Prompt added: $($promptResponse.content)"

# -------------------------------
# 5️⃣ Chat with AI
# -------------------------------
$chatResponse = Invoke-RestMethod `
    -Uri "$baseUrl/projects/$projectId/chat" `
    -Method POST `
    -Headers $authHeader `
    -ContentType "application/json" `
    -Body (@{ message = $chatMessage } | ConvertTo-Json)

Write-Host "🤖 AI reply: $($chatResponse.reply)"
