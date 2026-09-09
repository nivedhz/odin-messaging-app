import SpotlightCard from "@/components/SpotlightCard";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";

const FloatingCard = ({
  name,
  message,
  className,
}: {
  name: string;
  message: string;
  className?: string;
}) => {
  return (
    <SpotlightCard
      className={`w-72 shadow-2xl bg-transparent animate-[float_2s_ease-in-out_infinite] flex flex-col gap-2 border-muted-foreground/20 justify-between ${className}`}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base">{name}</CardTitle>
        <CardAction>
          <Bell width={20} />
        </CardAction>
      </CardHeader>
      <CardContent className="">
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </SpotlightCard>
  );
};

export default FloatingCard;
