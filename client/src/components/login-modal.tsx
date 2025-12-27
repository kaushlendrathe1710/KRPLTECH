import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "email" | "otp" | "register";

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const { toast } = useToast();

  const requestOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/auth/request-otp", { email });
      return res.json();
    },
    onSuccess: (data) => {
      setIsNewUser(data.isNewUser);
      setStep("otp");
      toast({
        title: "Code sent!",
        description: "Check your email for the 6-digit code.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { email: string; code: string; name?: string; mobile?: string }) => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.requiresRegistration) {
        setStep("register");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Welcome!",
        description: `Logged in as ${data.user.name || data.user.email}`,
      });
      resetAndClose();
    },
    onError: () => {
      toast({
        title: "Invalid code",
        description: "The code is incorrect or expired. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetAndClose = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setName("");
    setMobile("");
    setIsNewUser(false);
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      requestOtpMutation.mutate(email.trim());
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      if (isNewUser) {
        setStep("register");
      } else {
        verifyOtpMutation.mutate({ email, code: otp });
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      verifyOtpMutation.mutate({ email, code: otp, name: name.trim(), mobile: mobile.trim() || undefined });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetAndClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== "email" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setStep(step === "register" ? "otp" : "email")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {step === "email" && "Sign In"}
            {step === "otp" && "Enter Code"}
            {step === "register" && "Complete Registration"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" && "Enter your email to receive a login code."}
            {step === "otp" && `We sent a 6-digit code to ${email}`}
            {step === "register" && "Please provide your details to complete registration."}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  data-testid="input-login-email"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={requestOtpMutation.isPending}
              data-testid="button-send-code"
            >
              {requestOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                maxLength={6}
                required
                data-testid="input-otp"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={otp.length !== 6 || verifyOtpMutation.isPending}
              data-testid="button-verify-code"
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => requestOtpMutation.mutate(email)}
              disabled={requestOtpMutation.isPending}
              data-testid="button-resend-code"
            >
              Resend Code
            </Button>
          </form>
        )}

        {step === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-register-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number (optional)</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+1 234 567 890"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                data-testid="input-register-mobile"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!name.trim() || verifyOtpMutation.isPending}
              data-testid="button-complete-registration"
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
