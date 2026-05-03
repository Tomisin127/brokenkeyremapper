import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  payWithTempo,
  TEMPO_NETWORK_LABEL,
  TEMPO_PAYMENT_AMOUNT,
  TEMPO_RECIPIENT_ADDRESS,
  tempoExplorerTxUrl,
} from "@/lib/tempoPay";
import { supabase } from "@/lib/supabase";
import { DOWNLOAD_URL } from "@/lib/downloads";

type Status = "idle" | "collecting" | "paying" | "saving" | "ready" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PayWithTempoButton = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = status === "paying" || status === "saving";
  const expanded = status === "collecting" || isBusy;

  function startFlow() {
    setErrorMsg(null);
    setStatus("collecting");
  }

  async function handleConfirm() {
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg("Please enter a valid email so we can deliver your license.");
      return;
    }
    setErrorMsg(null);
    setStatus("paying");

    try {
      const result = await payWithTempo();
      setStatus("saving");

      const { error } = await supabase.from("payments").insert({
        email: email.trim(),
        tx_hash: result.txHash,
        amount: TEMPO_PAYMENT_AMOUNT,
        recipient: TEMPO_RECIPIENT_ADDRESS,
        network: TEMPO_NETWORK_LABEL,
        status: "completed",
      });

      if (error && !/duplicate key/i.test(error.message)) {
        // Non-fatal: payment succeeded onchain even if our DB write failed.
        // eslint-disable-next-line no-console
        console.error(
          "[PayWithTempoButton] Failed to persist payment:",
          error,
        );
        toast.error(
          "Payment confirmed, but we couldn't save your record. Keep your tx hash to recover the download.",
        );
      }

      setTxHash(result.txHash);
      setStatus("ready");
      toast.success("Payment confirmed on Tempo. Your download is ready.");
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

  function reset() {
    setStatus("idle");
    setErrorMsg(null);
  }

  // Not started yet (or errored out): one-line CTA.
  if (status === "idle" || status === "error") {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="hero-outline"
          className="w-full py-5"
          onClick={startFlow}
        >
          <Wallet className="h-4 w-4" />
          Pay with USDC on Tempo - {TEMPO_PAYMENT_AMOUNT} USDC
        </Button>
        {status === "error" && errorMsg && (
          <p className="text-xs text-destructive" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    );
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
          <p className="mt-2 text-muted-foreground">
            Use your tx hash in the &quot;Already paid?&quot; box below to
            re-download anytime.
          </p>
        </div>
      </div>
    );
  }

  // Collecting email + busy.
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key="tempo-form"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-3 overflow-hidden"
      >
        <div className="space-y-1.5">
          <Label htmlFor="tempo-email" className="text-xs">
            Email for license delivery
          </Label>
          <Input
            id="tempo-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isBusy}
            aria-invalid={Boolean(errorMsg) || undefined}
          />
        </div>

        <Button
          type="button"
          variant="hero-outline"
          className="w-full py-5"
          onClick={handleConfirm}
          disabled={isBusy}
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          {status === "paying" && "Confirming on Tempo..."}
          {status === "saving" && "Saving your receipt..."}
          {status === "collecting" &&
            `Confirm ${TEMPO_PAYMENT_AMOUNT} USDC on Tempo`}
        </Button>

        {!isBusy && expanded && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Cancel
          </button>
        )}

        {errorMsg && (
          <p className="text-xs text-destructive" role="alert">
            {errorMsg}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PayWithTempoButton;
