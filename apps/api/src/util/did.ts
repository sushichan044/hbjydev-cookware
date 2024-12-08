import { z } from "zod";
import env from "../config/env.js";

type Brand<K, T> = K & { __brand: T };
export type DID = Brand<string, "DID">;

export function isDid(s: string): s is DID {
  return s.startsWith("did:");
}

export function parseDid(s: string): DID | null {
  if (!isDid(s)) {
    return null;
  }
  return s;
}

export const getDidDoc = async (did: DID) => {
  let url = `${env.PLC_DIRECTORY_URL}/${did}`;
  if (did.startsWith('did:web')) {
    url = `https://${did.split(':')[2]}/.well-known/did.json`;
  }

  const response = await fetch(url);

  return PlcDocument.parse(await response.json());
};

export const getPdsUrl = async (did: DID) => {
  const plc = await getDidDoc(did);

  return (
    plc.service.find((s) => s.type === "AtprotoPersonalDataServer")
      ?.serviceEndpoint ?? null
  );
};

const PlcDocument = z.object({
  id: z.string(),
  alsoKnownAs: z.array(z.string()),
  service: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      serviceEndpoint: z.string(),
    }),
  ),
});

const DnsQueryResponse = z.object({
  Answer: z.array(
    z.object({
      name: z.string(),
      type: z.number(),
      TTL: z.number(),
      data: z.string(),
    }),
  ),
});

async function getAtprotoDidFromDns(handle: string) {
  const url = new URL("https://cloudflare-dns.com/dns-query");
  url.searchParams.set("type", "TXT");
  url.searchParams.set("name", `_atproto.${handle}`);

  const response = await fetch(url, {
    headers: {
      Accept: "application/dns-json",
    },
  });

  const { Answer } = DnsQueryResponse.parse(await response.json());
  // Answer[0].data is "\"did=...\"" (with quotes)
  const val = Answer[0]?.data
    ? JSON.parse(Answer[0]?.data).split("did=")[1]
    : null;

  return val ? parseDid(val) : null;
}

const getAtprotoFromHttps = async (handle: string) => {
  let res;
  const timeoutSignal = AbortSignal.timeout(1500);
  try {
    res = await fetch(`https://${handle}/.well-known/atproto-did`, {
      signal: timeoutSignal,
    });
  } catch (_e) {
    // We're caching failures here, we should at some point invalidate the cache by listening to handle changes on the network
    return null;
  }

  if (!res.ok) {
    return null;
  }
  return parseDid((await res.text()).trim());
};

export const getVerifiedDid = async (handle: string) => {
  const [dnsDid, httpDid] = await Promise.all([
    getAtprotoDidFromDns(handle).catch((_) => {
      return null;
    }),
    getAtprotoFromHttps(handle).catch(() => {
      return null;
    }),
  ]);

  if (dnsDid && httpDid && dnsDid !== httpDid) {
    return null;
  }

  const did = dnsDid ?? (httpDid ? parseDid(httpDid) : null);
  if (!did) {
    return null;
  }

  const plcDoc = await getDidDoc(did);
  const plcHandle = plcDoc.alsoKnownAs
    .find((handle) => handle.startsWith("at://"))
    ?.replace("at://", "");

  if (!plcHandle) return null;

  return plcHandle.toLowerCase() === handle.toLowerCase() ? did : null;
};

export const getDidFromHandleOrDid = async (handleOrDid: string) => {
  const decodedHandleOrDid = decodeURIComponent(handleOrDid);
  if (isDid(decodedHandleOrDid)) {
    return decodedHandleOrDid;
  }

  return getVerifiedDid(decodedHandleOrDid);
};
