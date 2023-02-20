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

## Pull environment variables

Install [Vercal CLI](https://vercel.com/docs/cli) globally:

```bash
npm i -g vercel
```

[Link](https://vercel.com/docs/cli/link) the project to Vercel from the root directory:

```bash
vercel link
```

Pull environment variables to `.env.local` file.

```bash
npm run env:pull
```

Add `NEXTAUTH_URL="http://localhost:3000"` to the end of the `.env.local`.

## API Code Generation

API hooks, functions and types are genereated from the API Swagger files. APIs are seperated to `./services/api/client` and `./services/api/admin` folders.

```bash
npm run api:codegen:admin
npm run api:codegen:client
```
