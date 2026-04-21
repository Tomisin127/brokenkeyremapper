import { createBaseAccountSDK } from "@base-org/account";
import { Attribution } from "ox/erc8021";
import {
  encodeFunctionData,
  parseUnits,
  toHex,
  type Address,
  type Hex,
} from "viem";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

// Base Builder Code, registered at https://base.dev/ → Settings → Builder Codes
export const BUILDER_CODE = "bc_g1i8e6zf";

// ERC-8021 attribution suffix built with ox. Produces:
//   <utf8(codes)> ∥ <codesLength:1> ∥ <schemaId:1 = 0x00> ∥ <0x8021…8021:16>
// The Base Smart Wallet will append these bytes to the tx calldata when it
// sees the `dataSuffix` capability below.
export const BUILDER_CODE_DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
}) as Hex;

// Payment destination and amount.
export const PAYMENT_RECIPIENT =
  "0xc0887Adf2411C4DB859e497c1f931C59600b1ec4" as Address;
export const PAYMENT_AMOUNT_USDC = "0.01";

// Base mainnet.
const CHAIN_ID_BASE = 8453;
const USDC_BASE_MAINNET =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address;
const USDC_DECIMALS = 6;

const ERC20_TRANSFER_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type BasePayResult = {
  txHash: string;
  email: string;
};

type SendCallsResponse = {
  id?: string;
  capabilities?: {
    dataCallback?: {
      email?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

/* -------------------------------------------------------------------------- */
/*  SDK singleton                                                             */
/* -------------------------------------------------------------------------- */

let sdk: ReturnType<typeof createBaseAccountSDK> | null = null;

function getSdk() {
  if (!sdk) {
    sdk = createBaseAccountSDK({
      appName: "Broken Key Remapper",
      appChainIds: [CHAIN_ID_BASE],
    });
  }
  return sdk;
}

/* -------------------------------------------------------------------------- */
/*  Main entrypoint                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Kick off a Base Pay checkout for 0.01 USDC on Base mainnet.
 *
 * Calls `wallet_sendCalls` directly on the Base Account provider so we can
 * attach the ERC-8021 `dataSuffix` capability using the exact shape the Base
 * Smart Wallet expects:
 *
 *   capabilities.dataSuffix = { value: "0x…", optional: true }
 *
 * This is required because the SDK's `pay()` helper (v2.5.4) still sends the
 * legacy `capabilities.attribution = { suffix }` key, which the Base Smart
 * Wallet does not recognise for calldata appending — so `pay()` alone produces
 * no onchain attribution. See:
 *   https://docs.base.org/apps/builder-codes/app-developers
 *   https://docs.base.org/base-chain/builder-codes/wallet-developers
 *
 * Email collection is handled with the standard `dataCallback` capability,
 * whose response is returned in `capabilities.dataCallback` alongside the
 * transaction hash in `id`.
 */
export async function payWithBase(): Promise<BasePayResult> {
  const provider = getSdk().getProvider();

  // 1. Connect the ephemeral Base Account
  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];
  const from = accounts?.[0] as Address | undefined;
  if (!from) {
    throw new Error("No Base Account connected.");
  }

  // 2. Encode the ERC-20 USDC transfer
  const data = encodeFunctionData({
    abi: ERC20_TRANSFER_ABI,
    functionName: "transfer",
    args: [PAYMENT_RECIPIENT, parseUnits(PAYMENT_AMOUNT_USDC, USDC_DECIMALS)],
  });

  // 3. Submit the batch with BOTH the correct `dataSuffix` capability
  //    (what the Base Smart Wallet honours) and the legacy `attribution`
  //    capability (for older wallet implementations). Sending both is
  //    harmless — `optional: true` means wallets ignore unknown keys.
  const result = (await provider.request({
    method: "wallet_sendCalls",
    params: [
      {
        version: "2.0.0",
        chainId: toHex(CHAIN_ID_BASE),
        from,
        atomicRequired: false,
        calls: [
          {
            to: USDC_BASE_MAINNET,
            data,
            value: "0x0",
          },
        ],
        capabilities: {
          dataSuffix: {
            value: BUILDER_CODE_DATA_SUFFIX,
            optional: true,
          },
          attribution: {
            suffix: BUILDER_CODE_DATA_SUFFIX,
          },
          dataCallback: {
            requests: [{ type: "email", optional: false }],
          },
        },
      },
    ],
  })) as string | SendCallsResponse;

  // 4. Parse the response. wallet_sendCalls 2.0.0+ returns an object
  //    { id: "<txhash…>", capabilities: { dataCallback: {...} } }.
  //    Older shapes return the raw hash as a string.
  let txHash: string | undefined;
  let email: string | undefined;

  if (typeof result === "string") {
    // The hash may be followed by extra metadata; take the 0x + 64 hex chars.
    txHash = result.slice(0, 66);
  } else if (result && typeof result === "object") {
    if (typeof result.id === "string" && result.id.length >= 66) {
      txHash = result.id.slice(0, 66);
    }
    email = result.capabilities?.dataCallback?.email;
  }

  if (!txHash) {
    throw new Error("Payment did not return a transaction hash.");
  }
  if (!email) {
    throw new Error(
      "Email was not shared. Please complete the Base Pay flow and share your email.",
    );
  }

  return { txHash, email };
}
