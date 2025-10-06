# Environment Setup

## Create `.env` file

Create a `.env` file in the `frontend/edusync-web/` directory with the following content:

```env
# API URLs
# Auth Service (port 8086)
VITE_AUTH_API_URL=http://localhost:8086

# HR Service (port 8082)
VITE_HR_API_URL=http://localhost:8082

# Default API URL
VITE_API_URL=http://localhost:8082
```

## How to create the file

### Option 1: Command line
```bash
cd frontend/edusync-web

cat > .env << 'EOF'
# API URLs
VITE_AUTH_API_URL=http://localhost:8086
VITE_HR_API_URL=http://localhost:8082
VITE_API_URL=http://localhost:8082
EOF
```

### Option 2: Manually
1. Navigate to `frontend/edusync-web/`
2. Create a new file called `.env`
3. Copy the content above into the file
4. Save

The `.env` file is git-ignored, so it won't be committed to the repository.

