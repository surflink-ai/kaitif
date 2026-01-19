"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  targetDate: Date | string;
  onComplete?: () => void;
  showDays?: boolean;
  size?: "sm" | "md" | "lg";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = React.forwardRef<HTMLDivElement, CountdownTimerProps>(
  ({ className, targetDate, onComplete, showDays = true, size = "md", ...props }, ref) => {
    const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    const [isComplete, setIsComplete] = React.useState(false);

    React.useEffect(() => {
      const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;

      const calculateTimeLeft = () => {
        const now = new Date();
        const difference = target.getTime() - now.getTime();

        if (difference <= 0) {
          setIsComplete(true);
          onComplete?.();
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    const sizes = {
      sm: { box: "h-10 w-10 text-lg", label: "text-[8px]" },
      md: { box: "h-14 w-14 text-2xl", label: "text-[10px]" },
      lg: { box: "h-20 w-20 text-3xl", label: "text-xs" },
    };

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex items-center justify-center bg-[#080808] border-2 border-[#FFCC00] font-bold text-[#FFCC00]",
            sizes[size].box
          )}
        >
          {String(value).padStart(2, "0")}
        </div>
        <span className={cn("mt-1 font-bold uppercase text-[#F5F5F0]/60", sizes[size].label)}>
          {label}
        </span>
      </div>
    );

    if (isComplete) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center py-4 text-xl font-bold uppercase tracking-wider text-[#FFCC00]",
            className
          )}
          {...props}
        >
          Live Now!
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-2", className)}
        {...props}
      >
        {showDays && timeLeft.days > 0 && (
          <>
            <TimeBox value={timeLeft.days} label="Days" />
            <span className="text-2xl font-bold text-[#F5F5F0]/40">:</span>
          </>
        )}
        <TimeBox value={timeLeft.hours} label="Hours" />
        <span className="text-2xl font-bold text-[#F5F5F0]/40">:</span>
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl font-bold text-[#F5F5F0]/40">:</span>
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    );
  }
);
CountdownTimer.displayName = "CountdownTimer";

export { CountdownTimer };
