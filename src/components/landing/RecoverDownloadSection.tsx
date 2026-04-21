import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader2, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DOWNLOAD_URL } from "@/lib/downloads";

// Base/Ethereum tx hashes are 32-byte values, encoded as 0x + 64 hex chars.
const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

type RecoverStatus = "idle" | "verifying" | "verified" | "invalid" | "error";

const RecoverDownloadSection = () => {
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState<RecoverStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = txHash.trim();

    if (!TX_HASH_REGEX.test(trimmed)) {
      setStatus("invalid");
      setMessage("That doesn't look like a valid transaction hash. It should start with 0x and be 66 characters long.");
      return;
    }

    setStatus("verifying");
    setMessage(null);

    // Calls the SECURITY DEFINER function `verify_payment(tx_hash_input)` which
    // returns a boolean. We intentionally do NOT read the email or other PII
    // from the client.
    const { data, error } = await supabase.rpc("verify_payment", {
      tx_hash_input: trimmed,
    });

    if (error) {
      setStatus("error");
      setMessage("We couldn't verify your transaction right now. Please try again in a moment.");
      // eslint-disable-next-line no-console
      console.error("[RecoverDownloadSection] verify_payment error:", error);
      return;
    }

    if (data === true) {
      setStatus("verified");
      setMessage(null);
      window.open(DOWNLOAD_URL, "_blank", "noopener,noreferrer");
    } else {
      setStatus("invalid");
      setMessage("We couldn't find a payment for that transaction hash. Double-check and try again.");
    }
  }

  const isBusy = status === "verifying";

  return (
    <section id="recover" className="relative py-20">
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl rounded-2xl border border-border/60 bg-card/60 p-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">Already paid with crypto?</h2>
              <p className="text-sm text-muted-foreground">Paste your transaction hash to re-download the app.</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={txHash}
              onChange={(e) => {
                setTxHash(e.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              placeholder="0x..."
              aria-label="Transaction hash"
              className="font-mono text-xs sm:text-sm"
              spellCheck={false}
              autoComplete="off"
            />
            <Button type="submit" variant="hero" className="sm:w-auto" disabled={isBusy || !txHash.trim()}>
              {isBusy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Verify &amp; Download
                </>
              )}
            </Button>
          </form>

          {message && (
            <p
              className={
                "mt-4 text-sm " +
                (status === "verified" ? "text-accent" : "text-destructive")
              }
              role="status"
            >
              {message}
            </p>
          )}

          {status === "verified" && (
            <p className="mt-4 text-sm text-muted-foreground">
              Verified. If the download didn&apos;t open automatically,{" "}
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                click here
              </a>
              .
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RecoverDownloadSection;
