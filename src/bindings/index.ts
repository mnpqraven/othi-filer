export async function createRpc() {
  // NOTE: needs dynamic import else SSR breaks hooks
  const { createTauRPCProxy } = await import("./taurpc");
  return await createTauRPCProxy();
}
