import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  payWithTempo,
  TEMPO_PAYMENT_AMOUNT,
  tempoExplorerTxUrl,
} from "@/lib/tempoPay";
import { DOWNLOAD_URL } from "@/lib/downloads";

type Status = "idle" | "paying" | "ready" | "error";

const PayWithTempoButton = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = status === "paying";

  function openDownload() {
    window.open(DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  }

  async function handlePay() {
    setErrorMsg(null);
    setStatus("paying");

    try {
      const result = await payWithTempo();
      setTxHash(result.txHash);
      setStatus("ready");
      toast.success("Payment confirmed on Tempo. Opening your download...");
      openDownload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
    }
  }

  // Success state: receipt + re-download button.
  if (status === "ready" && txHash) {
    return (
      <div className="space-y-3">
        <Button
          type="button"
          variant="hero-outline"
          className="w-full py-5"
          onClick={openDownload}
        >
          <Wallet className="h-4 w-4" />
          Download again
        </Button>
        <div className="rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
          <p className="mb-1 font-medium text-foreground">
            Tempo transaction confirmed
          </p>
          <p className="break-all font-mono text-[11px] text-muted-foreground">
            {txHash}
          </p>
          <a
            href={tempoExplorerTxUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-primary underline-offset-2 hover:underline"
          >
            View on Tempo Explorer
          </a>
        </div>
      </div>
    );
  }

  // Idle / paying / error: one CTA, payment opens download as soon as it
  // confirms onchain.
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="hero-outline"
        className="w-full py-5"
        onClick={handlePay}
        disabled={isBusy}
      >
        {isBusy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isBusy
          ? "Confirming on Tempo..."
          : `Pay with USDC on Tempo - ${TEMPO_PAYMENT_AMOUNT} USDC`}
      </Button>
      {status === "error" && errorMsg && (
        <p className="text-xs text-destructive" role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default PayWithTempoButton;
