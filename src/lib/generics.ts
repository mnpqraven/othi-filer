interface TypePayloadPair<T, K extends keyof T> {
  type: K;
  payload: T[K];
}

type TypePayloadPairMap<T> = {
  [K in keyof T]: TypePayloadPair<T, K>;
};

export type ReducerAction<T> = TypePayloadPairMap<T>[keyof T];
