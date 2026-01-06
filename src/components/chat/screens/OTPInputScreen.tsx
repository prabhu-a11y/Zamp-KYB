import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { HelpChat } from "./HelpChat";

interface OTPInputScreenProps {
  email?: string;
  onSubmit: (otp: string) => void;
  contextData?: any;
  stepInfo?: string;
}

export function OTPInputScreen({ onSubmit, contextData, stepInfo }: OTPInputScreenProps) {
  const [otp, setOtp] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  const handleSubmit = () => {
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  return (
    <div className="animate-slide-up space-y-5">
      <InputOTP maxLength={6} value={otp} onChange={setOtp} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup className="gap-3">
          <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
          <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
          <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
          <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
          <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
          <InputOTPSlot index={5} className="w-12 h-14 text-lg" />
        </InputOTPGroup>
      </InputOTP>
      <Button onClick={handleSubmit} disabled={otp.length !== 6} size="lg" className="w-full text-base">
        Verify
      </Button>
      <p className="text-base text-muted-foreground text-center">
        Didn't receive the code? <button className="text-primary underline">Resend</button>
      </p>
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div >
  );
}
