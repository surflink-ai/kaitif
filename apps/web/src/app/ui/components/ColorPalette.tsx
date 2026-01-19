import { cn } from "@/lib/utils";

function ColorSwatch({ name, hex, className }: { name: string; hex: string; className?: string }) {
  return (
    <div className="group flex flex-col gap-2">
      <div 
        className={cn("h-24 w-full rounded-xl border border-white/5 shadow-sm transition-transform group-hover:scale-105", className)} 
        style={{ backgroundColor: hex }}
      />
      <div className="px-1">
        <p className="font-bold text-white text-sm">{name}</p>
        <p className="text-[#5A5A62] text-xs font-mono uppercase">{hex}</p>
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Storm Cloud Backgrounds */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#9A9AA0] uppercase tracking-wider mb-4">Backgrounds</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorSwatch name="Storm" hex="#0A0A0B" />
          <ColorSwatch name="Cloud" hex="#111113" />
          <ColorSwatch name="Slate" hex="#1A1A1D" />
          <ColorSwatch name="Ash" hex="#252529" />
        </div>
      </div>

      {/* Accents */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#9A9AA0] uppercase tracking-wider mb-4">Accents</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorSwatch name="Electric" hex="#FFE500" />
          <ColorSwatch name="Dim" hex="#BFA900" />
          <ColorSwatch name="Success" hex="#22C55E" />
          <ColorSwatch name="Warning" hex="#F59E0B" />
        </div>
      </div>

      {/* Neutrals */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#9A9AA0] uppercase tracking-wider mb-4">Neutrals</h3>
        <div className="grid grid-cols-2 gap-4">
           <ColorSwatch name="White" hex="#FFFFFF" className="border-[#252529]" />
           <ColorSwatch name="Silver" hex="#9A9AA0" />
           <ColorSwatch name="Zinc" hex="#5A5A62" />
           <ColorSwatch name="Graphite" hex="#3A3A42" />
        </div>
      </div>
      
       {/* Usage Examples */}
       <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#9A9AA0] uppercase tracking-wider mb-4">Gradients</h3>
        <div className="h-24 w-full rounded-xl bg-gradient-to-r from-[#0A0A0B] to-[#1A1A1D] border border-[#252529] flex items-center justify-center">
            <span className="text-xs text-[#5A5A62] font-mono">bg-gradient-storm</span>
        </div>
        <div className="h-24 w-full rounded-xl bg-gradient-to-r from-[#FFE500] to-[#FFF040] flex items-center justify-center">
            <span className="text-xs text-black/60 font-mono font-bold">bg-gradient-electric</span>
        </div>
      </div>
    </div>
  );
}
