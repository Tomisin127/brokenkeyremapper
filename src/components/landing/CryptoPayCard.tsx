import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { payWithBase, PAYMENT_AMOUNT_USDC, PAYMENT_RECIPIENT } from "@/lib/basePay";
import { supabase } from "@/lib/supabase";
import { DOWNLOAD_URL } from "@/lib/downloads";

const features = [
  "Pay with USDC on Base (no card)",
  "Email collected securely via Base Pay",
  "Attributed onchain with Base Builder Code",
  "Download unlocks the moment your tx confirms",
  "Recover your download anytime with your tx hash",
];

type Status = "idle" | "paying" | "saving" | "ready" | "error";

const CryptoPayCard = ({ index = 2 }: { index?: number }) => {
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = status === "paying" || status === "saving";

  async function handlePay() {
    setErrorMsg(null);
    setStatus("paying");

    try {
      // Let the user know we're waiting on confirmation after the popup closes.
      const result = await payWithBase();
      setStatus("saving");

      const { error } = await supabase.from("payments").insert({
        email: result.email,
        tx_hash: result.txHash,
        amount: PAYMENT_AMOUNT_USDC,
        recipient: PAYMENT_RECIPIENT,
        network: "base-mainnet",
        status: "completed",
      });

      if (error && !/duplicate key/i.test(error.message)) {
        // Non-fatal: payment succeeded onchain even if our DB write failed.
        // eslint-disable-next-line no-console
        console.error("[CryptoPayCard] Failed to persist payment:", error);
        toast.error("Payment confirmed, but we couldn't save your record. Keep your tx hash to recover the download.");
      }

      setTxHash(result.txHash);
      setStatus("ready");
      toast.success("Payment confirmed. Your download is ready.");

      // Kick off the download immediately so the user doesn't have to click again.
      openDownload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
    }
  }

  function openDownload() {
    window.open(DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  }

  const ctaLabel = (() => {
    switch (status) {
      case "paying":
        return "Confirming onchain...";
      case "saving":
        return "Saving your receipt...";
      case "ready":
        return "Download again";
      default:
        return "Pay 0.01 USDC with Base";
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative rounded-2xl border border-accent/40 bg-card p-8 box-glow"
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground flex items-center gap-1">
        <Coins className="h-3 w-3" /> Pay with Crypto
      </div>

      <h3 className="mb-1 font-heading text-xl font-bold">v1.1 Full Version</h3>
      <div className="mb-1 flex items-baseline gap-1">
        <span className="text-4xl font-bold">0.01</span>
        <span className="text-sm text-muted-foreground">USDC on Base</span>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Same full AI-powered predictive keyboard. Pay with USDC via Base Pay, get instant access, and recover it anytime with your transaction hash.
      </p>

      <ul className="mb-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent" />
            {f}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="hero"
        className="w-full py-5"
        onClick={status === "ready" ? openDownload : handlePay}
        disabled={isBusy}
      >
        {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
        {ctaLabel}
      </Button>

      {status === "ready" && txHash && (
        <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
          <p className="mb-1 font-medium text-foreground">Save this transaction hash</p>
          <p className="break-all font-mono text-[11px] text-muted-foreground">{txHash}</p>
          <p className="mt-2 text-muted-foreground">
            You can use it later in the &quot;Already paid?&quot; box below to re-download.
          </p>
        </div>
      )}

      {status === "error" && errorMsg && (
        <p className="mt-4 text-xs text-destructive">{errorMsg}</p>
      )}
    </motion.div>
  );
};

export default CryptoPayCard;
