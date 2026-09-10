import { CheckCheck, ShieldCheck, Zap } from "lucide-react";

const TrustRow = () => {
  return (
    <div className="animate-fade-up delay-300 flex flex-wrap gap-5 text-xs text-white/55">
      <span className="flex items-center gap-1.5">
        <ShieldCheck width={15} className="text-brand" /> Un-Encrypted by
        default
      </span>
      <span className="flex items-center gap-1.5">
        <Zap width={15} className="text-brand" /> &gt;50ms delivery
      </span>
      <span className="flex items-center gap-1.5">
        <CheckCheck width={15} className="text-brand" /> Read receipts &
        reactions
      </span>
    </div>
  );
};

export default TrustRow;
