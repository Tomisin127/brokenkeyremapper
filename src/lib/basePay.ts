import { pay } from "@base-org/account";
import { Attribution } from "ox/erc8021";

// Base Builder Code for onchain attribution via ERC-8021.
// Registered at https://base.dev/ -> Settings -> Builder Codes.
export const BUILDER_CODE = "bc_dh0rqw67";

// Build the ERC-8021-compliant data suffix using ox's official helper.
// This produces:
//   <utf8(codes)> ∥ <codesLength:1> ∥ <schemaId:1 = 0x00> ∥ <ercMarker:0x8021…8021 (16 bytes)>
// e.g. for "bc_dh0rqw67" -> 0x62635f64683072717736370b0080218021802180218021802180218021
//
// Previously we used Hex.fromString(BUILDER_CODE), which only emitted the raw
// UTF-8 bytes of the code without the length byte, schemaId, or the 16-byte
// 0x8021… marker that ERC-8021 parsers (Basescan, base.dev, etc.) scan for.
// That is why no attribution was showing up in the transaction input data.
export const BUILDER_CODE_DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
}) as `0x${string}`;

// Recipient of the USDC payment on Base mainnet.
export const PAYMENT_RECIPIENT = "0xc0887Adf2411C4DB859e497c1f931C59600b1ec4";

// Price of the digital download.
export const PAYMENT_AMOUNT_USDC = "0.01";

export type BasePayResult = {
  txHash: string;
  email: string;
};

/**
 * Kick off a Base Pay checkout for 0.01 USDC on Base mainnet, collecting the
 * payer's email. The `pay()` helper submits the transaction and resolves once
 * it has an onchain transaction hash (returned as `payment.id`), so we can
 * treat a `success: true` result as "payment confirmed onchain".
 *
 * The ERC-8021 data suffix is attached via the `dataSuffix` option. The SDK
 * forwards it as the `attribution` / `dataSuffix` capability on
 * `wallet_sendCalls`, and the Base Account wallet appends it to the
 * transaction calldata before signing.
 *
 * Returns the transaction hash and the collected email on success.
 */
export async function payWithBase(): Promise<BasePayResult> {
  const payment = await pay({
    amount: PAYMENT_AMOUNT_USDC,
    to: PAYMENT_RECIPIENT,
    testnet: false,
    payerInfo: {
      requests: [{ type: "email", optional: false }],
    },
    dataSuffix: BUILDER_CODE_DATA_SUFFIX,
  });

  if (!payment.success) {
    const reason =
      "error" in payment && typeof payment.error === "string"
        ? payment.error
        : "Payment was not completed.";
    throw new Error(reason);
  }

  const txHash = payment.id;
  const email = extractEmail(payment);

  if (!email) {
    throw new Error("Email was not shared. Please try again and allow sharing your email.");
  }
  if (!txHash) {
    throw new Error("Payment did not return a transaction hash.");
  }

  return { txHash, email };
}

function extractEmail(payment: Awaited<ReturnType<typeof pay>>): string | null {
  // `payerInfoResponses` is the documented shape, but we defensively read from
  // a couple of known locations to stay robust to SDK version drift.
  const anyPayment = payment as unknown as {
    payerInfoResponses?: { email?: string };
    payerInfo?: { email?: string };
  };
  return (
    anyPayment.payerInfoResponses?.email ??
    anyPayment.payerInfo?.email ??
    null
  );
}
