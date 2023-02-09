/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import * as reactQuery from "@tanstack/react-query";
import { useClientContext, ClientContext } from "./clientContext";
import type * as Fetcher from "./clientFetcher";
import { clientFetch } from "./clientFetcher";
import type * as Schemas from "./clientSchemas";

export type UserNftControllerFindAllQueryParams = {
  user_id: string;
  name?: string;
  nft_type_id?: string;
  offset?: number;
  limit?: number;
};

export type UserNftControllerFindAllError = Fetcher.ErrorWrapper<undefined>;

export type UserNftControllerFindAllResponse = {
  total: number;
  limit: number;
  offset: number;
  count: number;
  results: Schemas.UserNftDto[];
};

export type UserNftControllerFindAllVariables = {
  queryParams: UserNftControllerFindAllQueryParams;
} & ClientContext["fetcherOptions"];

export const fetchUserNftControllerFindAll = (
  variables: UserNftControllerFindAllVariables,
  signal?: AbortSignal
) =>
  clientFetch<
    UserNftControllerFindAllResponse,
    UserNftControllerFindAllError,
    undefined,
    {},
    UserNftControllerFindAllQueryParams,
    {}
  >({ url: "/api/v1/user-nft", method: "get", ...variables, signal });

export const useUserNftControllerFindAll = <
  TData = UserNftControllerFindAllResponse
>(
  variables: UserNftControllerFindAllVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      UserNftControllerFindAllResponse,
      UserNftControllerFindAllError,
      TData
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useClientContext(options);
  return reactQuery.useQuery<
    UserNftControllerFindAllResponse,
    UserNftControllerFindAllError,
    TData
  >(
    queryKeyFn({
      path: "/api/v1/user-nft",
      operationId: "userNftControllerFindAll",
      variables,
    }),
    ({ signal }) =>
      fetchUserNftControllerFindAll(
        { ...fetcherOptions, ...variables },
        signal
      ),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type UserNftControllerFindOnePathParams = {
  userId: string;
  nftId: string;
};

export type UserNftControllerFindOneError = Fetcher.ErrorWrapper<undefined>;

export type UserNftControllerFindOneVariables = {
  pathParams: UserNftControllerFindOnePathParams;
} & ClientContext["fetcherOptions"];

export const fetchUserNftControllerFindOne = (
  variables: UserNftControllerFindOneVariables,
  signal?: AbortSignal
) =>
  clientFetch<
    Schemas.UserNftDto,
    UserNftControllerFindOneError,
    undefined,
    {},
    {},
    UserNftControllerFindOnePathParams
  >({
    url: "/api/v1/user-nft/{userId}/{nftId}",
    method: "get",
    ...variables,
    signal,
  });

export const useUserNftControllerFindOne = <TData = Schemas.UserNftDto>(
  variables: UserNftControllerFindOneVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Schemas.UserNftDto,
      UserNftControllerFindOneError,
      TData
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useClientContext(options);
  return reactQuery.useQuery<
    Schemas.UserNftDto,
    UserNftControllerFindOneError,
    TData
  >(
    queryKeyFn({
      path: "/api/v1/user-nft/{user_id}/{nft_id}",
      operationId: "userNftControllerFindOne",
      variables,
    }),
    ({ signal }) =>
      fetchUserNftControllerFindOne(
        { ...fetcherOptions, ...variables },
        signal
      ),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type ChainControllerFindAllQueryParams = {
  name?: string;
  offset?: number;
  limit?: number;
};

export type ChainControllerFindAllError = Fetcher.ErrorWrapper<undefined>;

export type ChainControllerFindAllResponse = {
  total: number;
  limit: number;
  offset: number;
  count: number;
  results: Schemas.ChainDto[];
};

export type ChainControllerFindAllVariables = {
  queryParams?: ChainControllerFindAllQueryParams;
} & ClientContext["fetcherOptions"];

export const fetchChainControllerFindAll = (
  variables: ChainControllerFindAllVariables,
  signal?: AbortSignal
) =>
  clientFetch<
    ChainControllerFindAllResponse,
    ChainControllerFindAllError,
    undefined,
    {},
    ChainControllerFindAllQueryParams,
    {}
  >({ url: "/api/v1/chain", method: "get", ...variables, signal });

export const useChainControllerFindAll = <
  TData = ChainControllerFindAllResponse
>(
  variables: ChainControllerFindAllVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      ChainControllerFindAllResponse,
      ChainControllerFindAllError,
      TData
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useClientContext(options);
  return reactQuery.useQuery<
    ChainControllerFindAllResponse,
    ChainControllerFindAllError,
    TData
  >(
    queryKeyFn({
      path: "/api/v1/chain",
      operationId: "chainControllerFindAll",
      variables,
    }),
    ({ signal }) =>
      fetchChainControllerFindAll({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type ChainControllerFindOnePathParams = {
  id: string;
};

export type ChainControllerFindOneError = Fetcher.ErrorWrapper<undefined>;

export type ChainControllerFindOneVariables = {
  pathParams: ChainControllerFindOnePathParams;
} & ClientContext["fetcherOptions"];

export const fetchChainControllerFindOne = (
  variables: ChainControllerFindOneVariables,
  signal?: AbortSignal
) =>
  clientFetch<
    Schemas.ChainDto,
    ChainControllerFindOneError,
    undefined,
    {},
    {},
    ChainControllerFindOnePathParams
  >({ url: "/api/v1/chain/{id}", method: "get", ...variables, signal });

export const useChainControllerFindOne = <TData = Schemas.ChainDto>(
  variables: ChainControllerFindOneVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Schemas.ChainDto,
      ChainControllerFindOneError,
      TData
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useClientContext(options);
  return reactQuery.useQuery<
    Schemas.ChainDto,
    ChainControllerFindOneError,
    TData
  >(
    queryKeyFn({
      path: "/api/v1/chain/{id}",
      operationId: "chainControllerFindOne",
      variables,
    }),
    ({ signal }) =>
      fetchChainControllerFindOne({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type UserControllerRegisterError = Fetcher.ErrorWrapper<undefined>;

export type UserControllerRegisterVariables = {
  body: Schemas.RegisterUserDto;
} & ClientContext["fetcherOptions"];

export const fetchUserControllerRegister = (
  variables: UserControllerRegisterVariables,
  signal?: AbortSignal
) =>
  clientFetch<
    Schemas.UserDto,
    UserControllerRegisterError,
    Schemas.RegisterUserDto,
    {},
    {},
    {}
  >({ url: "/api/v1/user/register", method: "post", ...variables, signal });

export const useUserControllerRegister = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.UserDto,
      UserControllerRegisterError,
      UserControllerRegisterVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClientContext();
  return reactQuery.useMutation<
    Schemas.UserDto,
    UserControllerRegisterError,
    UserControllerRegisterVariables
  >(
    (variables: UserControllerRegisterVariables) =>
      fetchUserControllerRegister({ ...fetcherOptions, ...variables }),
    options
  );
};

export type QueryOperation =
  | {
      path: "/api/v1/user-nft";
      operationId: "userNftControllerFindAll";
      variables: UserNftControllerFindAllVariables;
    }
  | {
      path: "/api/v1/user-nft/{user_id}/{nft_id}";
      operationId: "userNftControllerFindOne";
      variables: UserNftControllerFindOneVariables;
    }
  | {
      path: "/api/v1/chain";
      operationId: "chainControllerFindAll";
      variables: ChainControllerFindAllVariables;
    }
  | {
      path: "/api/v1/chain/{id}";
      operationId: "chainControllerFindOne";
      variables: ChainControllerFindOneVariables;
    };
