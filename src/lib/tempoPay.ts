/**
 * Tempo blockchain stablecoin payments.
 *
 * Implements the flow described in the official Tempo docs:
 *   - Connect to the Network              https://docs.tempo.xyz/quickstart/connection-details
 *   - Send a Payment                       https://docs.tempo.xyz/guide/payments/send-a-payment
 *   - Attach a Transfer Memo               https://docs.tempo.xyz/guide/payments/transfer-memos
 *   - Predeployed Contracts                https://docs.tempo.xyz/quickstart/predeployed-contracts
 *
 * Tempo is fully EVM-compatible (Osaka EVM hard fork target) so we use a
 * standard injected EIP-1193 wallet (MetaMask, Rabby, Tempo Wallet, etc.)
 * + viem for the chain client and receipt verification.
 *
 * Tempo has no native gas token — fees are paid in TIP-20 stablecoins, set
 * automatically by the wallet/network. A TIP-20 transfer costs less than
 * $0.001, so the user's USDC balance covers gas with negligible overhead.
 */
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
  isAddress,
  pad,
  parseEventLogs,
  parseUnits,
  toHex,
  type Address,
  type Hex,
} from "viem";

/* -------------------------------------------------------------------------- */
/*  Chain config                                                              */
/* -------------------------------------------------------------------------- */

// Toggle via env. Defaults to mainnet, per the user's spec.
const USE_TESTNET =
  (import.meta.env.VITE_TEMPO_USE_TESTNET ?? "").toString().toLowerCase() ===
  "true";

export const tempoMainnet = defineChain({
  id: 4217,
  name: "Tempo",
  nativeCurrency: { name: "USD", symbol: "USD", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.tempo.xyz"],
      webSocket: ["wss://rpc.tempo.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Tempo Explorer", url: "https://explore.tempo.xyz" },
  },
});

export const tempoTestnet = defineChain({
  id: 42431,
  name: "Tempo Moderato",
  nativeCurrency: { name: "USD", symbol: "USD", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.moderato.tempo.xyz"],
      webSocket: ["wss://rpc.moderato.tempo.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tempo Testnet Explorer",
      url: "https://explore.testnet.tempo.xyz",
    },
  },
});

export const tempoChain = USE_TESTNET ? tempoTestnet : tempoMainnet;

/* -------------------------------------------------------------------------- */
/*  Payment config (env-driven)                                               */
/* -------------------------------------------------------------------------- */

// USDC (TIP-20) address on Tempo. Look this up in the Token List Registry:
//   https://docs.tempo.xyz/quickstart/token-list-registry
// On testnet, you can use AlphaUSD: 0x20c0000000000000000000000000000000000001
export const TEMPO_STABLECOIN_ADDRESS = (
  (import.meta.env.VITE_TEMPO_USDC_ADDRESS as string | undefined) ?? ""
).trim() as Address;

// The address that should receive the funds. Different from the Base recipient
// per the user's choice.
export const TEMPO_RECIPIENT_ADDRESS = (
  (import.meta.env.VITE_TEMPO_RECIPIENT_ADDRESS as string | undefined) ?? ""
).trim() as Address;

// USDC has 6 decimals on every major chain. Override via env if your target
// stablecoin uses a different precision.
export const TEMPO_STABLECOIN_DECIMALS = Number(
  import.meta.env.VITE_TEMPO_USDC_DECIMALS ?? 6,
);

// Test amount per the user's spec. Override with VITE_TEMPO_PAYMENT_AMOUNT.
export const TEMPO_PAYMENT_AMOUNT = (
  (import.meta.env.VITE_TEMPO_PAYMENT_AMOUNT as string | undefined) ?? "10"
).trim();

export const TEMPO_NETWORK_LABEL = USE_TESTNET
  ? "tempo-moderato"
  : "tempo-mainnet";

/* -------------------------------------------------------------------------- */
/*  TIP-20 ABI (subset)                                                       */
/* -------------------------------------------------------------------------- */

// TIP-20 is a strict superset of ERC-20. We only need transferWithMemo + the
// TransferWithMemo event for verification.
const TIP20_ABI = [
  {
    type: "function",
    name: "transferWithMemo",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "memo", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "TransferWithMemo",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
      { indexed: false, name: "memo", type: "bytes32" },
    ],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Memo helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Generate a fresh order id (UUID v4). */
export function newOrderId(): string {
  // crypto.randomUUID is supported in all modern browsers.
  return crypto.randomUUID();
}

/**
 * Encode an order id (UUID) as a bytes32 memo for `transferWithMemo`.
 * UUID = 16 bytes; we right-pad with zeros to make 32 bytes.
 */
export function memoFromOrderId(orderId: string): Hex {
  const cleaned = orderId.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(cleaned)) {
    throw new Error("Invalid order id; expected a UUID.");
  }
  // pad to 32 bytes (right-pads with zeros by default).
  return pad(`0x${cleaned}` as Hex, { size: 32, dir: "right" });
}

/* -------------------------------------------------------------------------- */
/*  Provider helpers                                                          */
/* -------------------------------------------------------------------------- */

type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getInjected(): EthProvider {
  const eth = (window as unknown as { ethereum?: EthProvider }).ethereum;
  if (!eth) {
    throw new Error(
      "No browser wallet detected. Install MetaMask, Rabby, or another EVM wallet to pay on Tempo.",
    );
  }
  return eth;
}

async function ensureTempoChain(eth: EthProvider) {
  const targetHex = toHex(tempoChain.id);
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetHex }],
    });
  } catch (err: unknown) {
    const e = err as { code?: number; message?: string };
    // 4902 = chain not added; some wallets return -32603 with "Unrecognized chain ID".
    const needsAdd =
      e?.code === 4902 ||
      e?.code === -32603 ||
      /unrecognized|not (?:been )?added/i.test(e?.message ?? "");
    if (!needsAdd) throw err;

    await eth.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: targetHex,
          chainName: tempoChain.name,
          nativeCurrency: tempoChain.nativeCurrency,
          rpcUrls: tempoChain.rpcUrls.default.http,
          blockExplorerUrls: [tempoChain.blockExplorers.default.url],
        },
      ],
    });
  }
}

/* -------------------------------------------------------------------------- */
/*  Main entrypoint                                                           */
/* -------------------------------------------------------------------------- */

export type TempoPayResult = {
  txHash: Hex;
  from: Address;
  orderId: string;
  memo: Hex;
};

/**
 * Send `amount` USDC from the connected wallet to TEMPO_RECIPIENT_ADDRESS,
 * tagged with `orderId` as a 32-byte memo, on Tempo (mainnet by default).
 *
 * Verifies the receipt client-side: the tx must succeed and emit a
 * TransferWithMemo log from the configured stablecoin contract that matches
 * recipient, amount, and memo.
 */
export async function payWithTempo(): Promise<TempoPayResult> {
  if (!isAddress(TEMPO_STABLECOIN_ADDRESS)) {
    throw new Error(
      "Tempo USDC address is not configured. Set VITE_TEMPO_USDC_ADDRESS in your environment.",
    );
  }
  if (!isAddress(TEMPO_RECIPIENT_ADDRESS)) {
    throw new Error(
      "Tempo recipient is not configured. Set VITE_TEMPO_RECIPIENT_ADDRESS in your environment.",
    );
  }

  const eth = getInjected();

  // 1. Connect.
  const accounts = (await eth.request({
    method: "eth_requestAccounts",
  })) as Address[];
  const from = accounts?.[0];
  if (!from) throw new Error("No wallet account selected.");

  // 2. Ensure we're on Tempo (auto-add the chain if missing).
  await ensureTempoChain(eth);

  // 3. Build memo from a fresh order id.
  const orderId = newOrderId();
  const memo = memoFromOrderId(orderId);
  const amount = parseUnits(TEMPO_PAYMENT_AMOUNT, TEMPO_STABLECOIN_DECIMALS);

  // 4. Submit the TIP-20 transferWithMemo call via viem.
  const wallet = createWalletClient({
    account: from,
    chain: tempoChain,
    transport: custom(eth),
  });
  const publicClient = createPublicClient({
    chain: tempoChain,
    transport: http(),
  });

  // Some wallets on custom chains (notably TokenPocket on Tempo) don't
  // auto-estimate gas and broadcast with gasLimit=0, which the network
  // rejects with "gasLimit is too low". Estimate explicitly with a 25%
  // buffer and a generous hard floor so the tx always has enough headroom.
  // Tempo TIP-20 transferWithMemo costs ~22-30k gas in practice.
  const HARD_FLOOR = 120_000n;
  let gas: bigint;
  let useMemoVariant = true;
  try {
    const estimated = await publicClient.estimateContractGas({
      account: from,
      address: TEMPO_STABLECOIN_ADDRESS,
      abi: TIP20_ABI,
      functionName: "transferWithMemo",
      args: [TEMPO_RECIPIENT_ADDRESS, amount, memo],
    });
    gas = (estimated * 125n) / 100n;
    if (gas < HARD_FLOOR) gas = HARD_FLOOR;
  } catch (err) {
    // The contract may not implement transferWithMemo. Fall back to plain
    // ERC-20 transfer — the order id will still be persisted off-chain.
    // eslint-disable-next-line no-console
    console.warn(
      "[tempoPay] transferWithMemo estimateGas failed, falling back to transfer:",
      err,
    );
    useMemoVariant = false;
    try {
      const estimated = await publicClient.estimateContractGas({
        account: from,
        address: TEMPO_STABLECOIN_ADDRESS,
        abi: TIP20_ABI,
        functionName: "transfer",
        args: [TEMPO_RECIPIENT_ADDRESS, amount],
      });
      gas = (estimated * 125n) / 100n;
      if (gas < HARD_FLOOR) gas = HARD_FLOOR;
    } catch {
      gas = HARD_FLOOR;
    }
  }

  const txHash = useMemoVariant
    ? await wallet.writeContract({
        address: TEMPO_STABLECOIN_ADDRESS,
        abi: TIP20_ABI,
        functionName: "transferWithMemo",
        args: [TEMPO_RECIPIENT_ADDRESS, amount, memo],
        gas,
      })
    : await wallet.writeContract({
        address: TEMPO_STABLECOIN_ADDRESS,
        abi: TIP20_ABI,
        functionName: "transfer",
        args: [TEMPO_RECIPIENT_ADDRESS, amount],
        gas,
      });

  // 5. Wait for confirmation and verify the log.
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });
  if (receipt.status !== "success") {
    throw new Error("Tempo transaction reverted.");
  }

  // Validate against TransferWithMemo first (memo-aware path). Fall back to
  // the standard Transfer event when the token doesn't implement memos.
  const memoLogs = parseEventLogs({
    abi: TIP20_ABI,
    eventName: "TransferWithMemo",
    logs: receipt.logs,
  });
  const memoMatch = memoLogs.find((log) => {
    if (log.address.toLowerCase() !== TEMPO_STABLECOIN_ADDRESS.toLowerCase()) {
      return false;
    }
    const args = log.args as { to?: Address; value?: bigint; memo?: Hex };
    return (
      args.to?.toLowerCase() === TEMPO_RECIPIENT_ADDRESS.toLowerCase() &&
      typeof args.value === "bigint" &&
      args.value >= amount &&
      args.memo?.toLowerCase() === memo.toLowerCase()
    );
  });

  if (!memoMatch) {
    const transferLogs = parseEventLogs({
      abi: TIP20_ABI,
      eventName: "Transfer",
      logs: receipt.logs,
    });
    const transferMatch = transferLogs.find((log) => {
      if (
        log.address.toLowerCase() !== TEMPO_STABLECOIN_ADDRESS.toLowerCase()
      ) {
        return false;
      }
      const args = log.args as { to?: Address; value?: bigint };
      return (
        args.to?.toLowerCase() === TEMPO_RECIPIENT_ADDRESS.toLowerCase() &&
        typeof args.value === "bigint" &&
        args.value >= amount
      );
    });
    if (!transferMatch) {
      throw new Error(
        "Could not verify the transfer event onchain. Funds may not have reached the merchant address.",
      );
    }
  }

  return { txHash, from, orderId, memo };
}

/** Build a block-explorer link for a tx hash. */
export function tempoExplorerTxUrl(hash: string): string {
  return `${tempoChain.blockExplorers.default.url}/tx/${hash}`;
}
