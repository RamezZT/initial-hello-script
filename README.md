
# Charity Platform

## Environment Setup

Before running the application, create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://your-api-url.com
```

For local development, you can use:

```
VITE_API_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment

1. Create a `.env` file with the appropriate `VITE_API_URL` for your production environment
2. Build the application with type checking disabled for faster builds:
```bash
npm run build
```
3. Deploy the contents of the `dist` directory to your web server

### Quick Deployment with Error Suppression

If you're encountering build errors but need to deploy quickly:

```bash
# Build with all type checking and linting disabled
VITE_DISABLE_TYPE_CHECK=true npm run build
```

This will produce a build even if there are TypeScript errors.
