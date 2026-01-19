export function TypographyScale() {
  return (
    <div className="space-y-12">
      {/* Headings */}
      <div className="space-y-8 border-b border-[#252529] pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
          <div className="text-[#5A5A62] text-xs font-mono">Display 6XL</div>
          <div className="md:col-span-3">
             <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.03em] leading-[0.9] text-white">
               Storm Cloud.
             </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
          <div className="text-[#5A5A62] text-xs font-mono">Heading 4XL</div>
          <div className="md:col-span-3">
             <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white">
               The premier skatepark experience.
             </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
          <div className="text-[#5A5A62] text-xs font-mono">Heading 2XL</div>
          <div className="md:col-span-3">
             <h3 className="text-2xl font-bold tracking-tight text-white">
               Digital passes & challenges.
             </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
          <div className="text-[#5A5A62] text-xs font-mono">Body Large</div>
          <div className="md:col-span-3">
             <p className="text-xl text-[#9A9AA0] leading-relaxed max-w-2xl">
               Kaitif Skatepark represents a $1.4M investment in the action sports community. Our 25,000 square foot facility features professional-grade ramps.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
          <div className="text-[#5A5A62] text-xs font-mono">Body Base</div>
          <div className="md:col-span-3">
             <p className="text-base text-[#9A9AA0] leading-relaxed max-w-2xl">
               Whether you're just starting out or you're a seasoned pro, Kaitif has something for you. Join our growing community and take your riding to the next level.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
          <div className="text-[#5A5A62] text-xs font-mono">Caption / Overline</div>
          <div className="md:col-span-3 space-y-2">
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFE500]">
               Electric Accent
             </p>
             <p className="text-xs font-medium uppercase tracking-wider text-[#5A5A62]">
               Muted Label
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
