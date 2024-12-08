import { CredentialManager, XRPC } from "@atcute/client"
import { createContext, useContext } from "react";

export const XrpcContext = createContext<{ rpc: XRPC; creds: CredentialManager; } | null>(null);

export function useXrpc() {
  const xrpc = useContext(XrpcContext);
  if (!xrpc) throw new Error('useXrpc() must be used within <XrpcContext.Provider>!');
  return xrpc;
}
