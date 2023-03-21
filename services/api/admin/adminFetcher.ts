import fetch from "isomorphic-fetch";
import { getSession } from "next-auth/react";

import { AdminContext } from "./adminContext";

const baseUrl = "";

export type ErrorWrapper<TError> =
  | TError
  | { status: "unknown"; payload: string };

export type AdminFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
} & AdminContext["fetcherOptions"];

export async function adminFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal,
}: AdminFetcherOptions<
  TBody,
  THeaders,
  TQueryParams,
  TPathParams
>): Promise<TData> {
  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    const session = await getSession();

    if (
      !(
        requestHeaders.hasOwnProperty("authorization") ||
        requestHeaders.hasOwnProperty("Authorization")
      )
    ) {
      requestHeaders["authorization"] = session?.token
        ? `Bearer ${session.token}`
        : "";
    }

    /**
     * As the fetch API is being used, when multipart/form-data is specified
     * the Content-Type header must be deleted so that the browser can set
     * the correct boundary.
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
     */
    if (
      requestHeaders["Content-Type"]
        .toLowerCase()
        .includes("multipart/form-data")
    ) {
      delete requestHeaders["Content-Type"];
    }

    const isFileUpload = body?.hasOwnProperty("file");
    let formData = new FormData();

    if (isFileUpload) {
      delete requestHeaders["Content-Type"];

      const { file, tags } = body as any;

      formData.append("file", file);

      if (tags) {
        formData.append("tags", tags.toString());
      }
    }

    const serializedBody = body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined;

    const response = await fetch(
      `${baseUrl}${resolveUrl(url, queryParams, pathParams)}`,
      {
        signal,
        method: method.toUpperCase(),
        body: isFileUpload ? formData : serializedBody,
        headers: requestHeaders,
      }
    );

    if (!response.ok) {
      let error: ErrorWrapper<TError>;

      try {
        error = await response.json();
      } catch (e) {
        error = {
          status: "unknown" as const,
          payload:
            e instanceof Error
              ? `Unexpected error (${e.message})`
              : "Unexpected error",
        };
      }

      throw error;
    }

    if (response.headers.get("content-type")?.includes("json")) {
      return await response.json();
    } else {
      // if it is not a json response, assume it is a blob and cast it to TData
      return (await response.blob()) as unknown as TData;
    }
  } catch (e) {
    let errorObject: Error = {
      name: "unknown" as const,
      message:
        e instanceof Error ? `Network error (${e.message})` : "Network error",
      stack: e as string,
    };
    throw errorObject;
  }
}

const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {}
) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]) + query;
};
