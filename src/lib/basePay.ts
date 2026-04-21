import { pay } from "@base-org/account";
import { Hex } from "ox";

// Builder Code attribution. This string is appended to the transaction
// calldata as a hex `dataSuffix` so Base can credit the builder for the
// payment. See: https://docs.base.org/base-chain/builder-codes/app-developers
export const BUILDER_CODE = "bc_dh0rqw67";

// Pre-compute the hex suffix for the builder code using the `ox` library.
// `Hex.fromString` UTF-8 encodes the string and returns a 0x-prefixed hex value.
export const BUILDER_CODE_DATA_SUFFIX = Hex.fromString(BUILDER_CODE) as `0x${string}`;

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
    // Attribute the payment to our Base Builder Code. The SDK validates and
    // forwards this as the `dataSuffix` capability on `wallet_sendCalls`, so
    // the builder code ends up in the transaction input data.
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
