/**
 * NOTE: needs dynamic import else SSR breaks hooks
 *  */
export async function createRpc() {
  const { createTauRPCProxy } = await import("./taurpc");
  return await createTauRPCProxy();
}
