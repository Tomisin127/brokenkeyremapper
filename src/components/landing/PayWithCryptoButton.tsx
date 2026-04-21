import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { payWithBase, PAYMENT_AMOUNT_USDC, PAYMENT_RECIPIENT } from "@/lib/basePay";
import { supabase } from "@/lib/supabase";
import { DOWNLOAD_URL } from "@/lib/downloads";

type Status = "idle" | "paying" | "saving" | "ready" | "error";

const PayWithCryptoButton = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = status === "paying" || status === "saving";

  async function handlePay() {
    setErrorMsg(null);
    setStatus("paying");

    try {
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
        console.error("[PayWithCryptoButton] Failed to persist payment:", error);
        toast.error(
          "Payment confirmed, but we couldn't save your record. Keep your tx hash to recover the download."
        );
      }

      setTxHash(result.txHash);
      setStatus("ready");
      toast.success("Payment confirmed. Your download is ready.");

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
        return "Pay with Crypto - 0.01 USDC";
    }
  })();

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="hero-outline"
        className="w-full py-5"
        onClick={status === "ready" ? openDownload : handlePay}
        disabled={isBusy}
      >
        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
        {ctaLabel}
      </Button>

      {status === "ready" && txHash && (
        <div className="rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
          <p className="mb-1 font-medium text-foreground">Save this transaction hash</p>
          <p className="break-all font-mono text-[11px] text-muted-foreground">{txHash}</p>
          <p className="mt-2 text-muted-foreground">
            Use it in the &quot;Already paid?&quot; box below to re-download anytime.
          </p>
        </div>
      )}

      {status === "error" && errorMsg && (
        <p className="text-xs text-destructive" role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default PayWithCryptoButton;
