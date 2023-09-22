## Project Setup

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Set environment variables

Add `.env.local` file to the directory with the following structure:

```
API_URL="https://api-dev.tekuno.app"
ADMIN_SWAGGER_URL="$API_URL/swagger-json"
CLIENT_SWAGGER_URL="$API_URL/swagger-user-json"
GOOGLE_CLIENT_ID=""
GOOGLE_SECRET=""
NEXT_PUBLIC_NETWORK="testnet"
NEXTAUTH_URL="http://localhost:3000"
```

Google secrets have to be set manually from the Google Test account.

NEXTAUTH_SECRET is not needed during the development, but if needed can be generated with

```bash
openssl rand -base64 32
```

## API Code Generation

API hooks, functions and types are genereated from the API Swagger files. APIs are seperated to `./services/api/client` and `./services/api/admin` folders.

```bash
npm run api:codegen:admin
npm run api:codegen:client
```

## Project URLs

[Development](https://development-tekuno-app.vercel.app/)

[Staging](https://staging-tekuno-app.vercel.app/)

[Production](https://use.tekuno.app/)
