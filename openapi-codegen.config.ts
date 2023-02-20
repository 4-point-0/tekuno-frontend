import env from "@next/env";
import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";

const projectDir = process.cwd();
env.loadEnvConfig(projectDir);

export default defineConfig({
  tekunoAdmin: {
    from: {
      source: "url",
      url: `${process.env.ADMIN_SWAGGER_URL}`,
    },
    outputDir: "services/api/admin",
    to: async (context) => {
      const filenamePrefix = "admin";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
  tekunoClient: {
    from: {
      source: "url",
      url: `${process.env.CLIENT_SWAGGER_URL}`,
    },
    outputDir: "services/api/client",
    to: async (context) => {
      const filenamePrefix = "client";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
