import httpProxy from "http-proxy";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const API_URL = process.env.API_URL;
const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    proxy.web(
      req,
      res,
      { target: API_URL, changeOrigin: true },
      async (err) => {
        const token = await getToken({ req, raw: true });

        console.log(token);

        if (token) {
          req.headers["Authorization"] = `Bearer ${token}`;
        }

        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
};

export default handler;
