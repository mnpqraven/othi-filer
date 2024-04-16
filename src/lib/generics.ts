import { type UseQueryOptions } from "@tanstack/react-query";

export type QueryParam<TData = unknown, TSel = TData> = Omit<
  UseQueryOptions<TData, Error, TSel, string[]>,
  "queryKey" | "queryFn"
>;

interface TypePayloadPair<T, K extends keyof T> {
  type: K;
  payload: T[K];
}

type TypePayloadPairMap<T> = {
  [K in keyof T]: TypePayloadPair<T, K>;
};

export type ReducerAction<T> = TypePayloadPairMap<T>[keyof T];
