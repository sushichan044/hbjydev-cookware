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
  const url = env.PLC_DIRECTORY_URL;
  const response = await fetch(`${url}/${did}`);

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
