/**
 * NOTE: needs dynamic import else SSR breaks hooks
 *  */
export const createRpc = async () => {
  const { createTauRPCProxy } = await import("./taurpc");
  return await createTauRPCProxy();
};
