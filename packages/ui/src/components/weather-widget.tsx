"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, Thermometer } from "lucide-react";

type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "stormy";

interface WeatherWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  temperature: number;
  condition: WeatherCondition;
  location?: string;
  unit?: "F" | "C";
  compact?: boolean;
}

const weatherIcons: Record<WeatherCondition, React.ReactNode> = {
  sunny: React.createElement(Sun as any, { className: "h-8 w-8 text-[#FFCC00]" }),
  cloudy: React.createElement(Cloud as any, { className: "h-8 w-8 text-[#F5F5F0]/60" }),
  rainy: React.createElement(CloudRain as any, { className: "h-8 w-8 text-[#00E6E6]" }),
  snowy: React.createElement(CloudSnow as any, { className: "h-8 w-8 text-[#F5F5F0]" }),
  windy: React.createElement(Wind as any, { className: "h-8 w-8 text-[#00E6E6]" }),
  stormy: React.createElement(CloudLightning as any, { className: "h-8 w-8 text-[#FFCC00]" }),
};

const weatherLabels: Record<WeatherCondition, string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowy",
  windy: "Windy",
  stormy: "Stormy",
};

const WeatherWidget = React.forwardRef<HTMLDivElement, WeatherWidgetProps>(
  ({ className, temperature, condition, location, unit = "F", compact = false, ...props }, ref) => {
    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 bg-[#080808] border-2 border-[#F5F5F0]/10 px-3 py-2",
            className
          )}
          {...props}
        >
          {weatherIcons[condition]}
          <span className="text-lg font-bold text-[#F5F5F0]">
            {temperature}°{unit}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#080808] border-2 border-[#F5F5F0]/10 p-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {React.createElement(Thermometer as any, { className: "h-4 w-4 text-[#F5F5F0]/40" })}
              <span className="text-3xl font-bold text-[#F5F5F0]">
                {temperature}°{unit}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60">
              {weatherLabels[condition]}
            </p>
            {location && (
              <p className="mt-0.5 text-xs text-[#F5F5F0]/40">{location}</p>
            )}
          </div>
          <div className="scale-150">{weatherIcons[condition]}</div>
        </div>
      </div>
    );
  }
);
WeatherWidget.displayName = "WeatherWidget";

export { WeatherWidget };
export type { WeatherCondition };
