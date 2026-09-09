import SpotlightCard from "@/components/SpotlightCard";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCheck } from "lucide-react";

const FloatingCard = ({
  name,
  message,
  time = "now",
  className,
}: {
  name: string;
  message: string;
  time?: string;
  className?: string;
}) => {
  return (
    <SpotlightCard
      className={`flex w-72 flex-col gap-4 rounded-2xl animate-[float_5s_ease-in-out_infinite] ${className ?? ""} shadow-lg shadow-slate/30`}
    >
      <CardHeader className="flex flex-row items-center gap-3 px-5 pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand to-[#FF9FFC] text-sm font-bold text-[#1a1333]">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <CardTitle className="truncate text-sm font-semibold text-white">
            {name}
          </CardTitle>
          <span className="text-xs text-white/50">{time} • online</span>
        </div>
        <CardAction>
          <CheckCheck width={18} className="text-brand" />
        </CardAction>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <p className="w-fit max-w-full rounded-xl rounded-tl-md bg-white/10 px-3.5 py-2 text-sm leading-relaxed text-white/90">
          {message}
        </p>
      </CardContent>
    </SpotlightCard>
  );
};

export default FloatingCard;
