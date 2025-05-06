
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
2. Build the application:
```bash
npm run build
```
3. Deploy the contents of the `dist` directory to your web server
