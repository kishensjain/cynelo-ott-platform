import { useState } from "react";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function SubscribeButton({ onSubscribed }: { onSubscribed?: () => void }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const subscribe = useAuthStore((state) => state.subscribe);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user?.isSubscribed) return null;

  const openPayment = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setOpen(true);
  };

  const submitPayment = async () => {
    setSubmitting(true);
    try {
      await subscribe();
      toast.success("Subscription activated");
      setOpen(false);
      onSubscribed?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={openPayment} className="gap-2">
        <LockKeyhole className="h-4 w-4" />
        Subscribe to unlock
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <CreditCard className="h-5 w-5 text-amber-300" />
              Start your subscription
            </DialogTitle>
            <DialogDescription>
              This is a mock checkout. No payment will be processed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Cynelo Unlimited</span>
                <span className="font-medium text-amber-200">$9.99 / month</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Unlock movie details, reviews, and subscriber content.
              </p>
            </div>

            <Input placeholder="Card number (demo)" inputMode="numeric" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM / YY" inputMode="numeric" />
              <Input placeholder="CVC" inputMode="numeric" />
            </div>
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Secure demo checkout. Use any values.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitPayment} disabled={submitting}>
              {submitting ? "Processing..." : "Complete payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SubscribeButton;
