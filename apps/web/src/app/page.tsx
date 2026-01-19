import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Trophy, ShoppingBag, MapPin, Clock, Shield, Zap } from "lucide-react";
import { Button, Container, Card, CardContent, Badge, HypeMeter } from "@kaitif/ui";
import { PARK_INFO, OPERATING_HOURS, PARK_RULES } from "@kaitif/db";

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-sm border-b-2 border-[#F5F5F0]/10">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-wider text-[#FFCC00]">
              KAITIF
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                About
              </a>
              <a href="#events" className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                Events
              </a>
              <a href="#rules" className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                Rules
              </a>
              <a href="#hours" className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                Hours
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Hero Background Image */}
        <Image
          src="/images/hero-bowl-night.png"
          alt="Skater performing a trick in the bowl at night"
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/70 to-[#080808]" />
        
        <Container className="relative z-10 text-center">
          <Badge variant="accent" className="mb-6">Now Open</Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter mb-6">
            <span className="text-[#F5F5F0]">Skate.</span>{" "}
            <span className="text-[#FFCC00]">Ride.</span>{" "}
            <span className="text-[#00E6E6]">Repeat.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F5F0]/60 max-w-2xl mx-auto mb-10">
            {PARK_INFO.description}. A world-class outdoor skatepark in Barbados 
            where it&apos;s always summer and every day feels like vacation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="xl" className="group">
                Get Your Pass
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#about">
              <Button variant="outline" size="xl">
                Learn More
              </Button>
            </Link>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F0]/40">Scroll</span>
          <div className="w-[2px] h-8 bg-gradient-to-b from-[#FFCC00] to-transparent" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              The <span className="text-[#FFCC00]">Full</span> Experience
            </h2>
            <p className="text-[#F5F5F0]/60 max-w-xl mx-auto">
              Everything you need for the ultimate skatepark experience, all in one app.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:border-[#FFCC00]/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-[#FFCC00]/10 border-2 border-[#FFCC00] flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-[#FFCC00]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Digital Passes</h3>
                <p className="text-sm text-[#F5F5F0]/60">
                  Buy and manage your passes digitally. Add to Apple or Google Wallet for easy access.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[#00E6E6]/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-[#00E6E6]/10 border-2 border-[#00E6E6] flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-[#00E6E6]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Events</h3>
                <p className="text-sm text-[#F5F5F0]/60">
                  Competitions, workshops, and community sessions. RSVP and check-in for bonus XP.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[#FFCC00]/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-[#FFCC00]/10 border-2 border-[#FFCC00] flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-[#FFCC00]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Challenges</h3>
                <p className="text-sm text-[#F5F5F0]/60">
                  Complete trick challenges, earn XP, level up, and unlock rare badges.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[#00E6E6]/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-[#00E6E6]/10 border-2 border-[#00E6E6] flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-[#00E6E6]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Marketplace</h3>
                <p className="text-sm text-[#F5F5F0]/60">
                  Buy and sell gear within the community. Safe transactions, trusted sellers.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#0A0A0A] border-y-2 border-[#F5F5F0]/10">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6">Est. {PARK_INFO.founded}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
                Built For <span className="text-[#FFCC00]">Riders</span>
              </h2>
              <p className="text-lg text-[#F5F5F0]/60 mb-6">
                {PARK_INFO.name} is a world-class facility funded by the {PARK_INFO.fundedBy}, 
                featuring professional-grade ramps, rails, and obstacles designed for all skill levels.
                Located in Barbados where it&apos;s always summer.
              </p>
              <p className="text-lg text-[#F5F5F0]/60 mb-8">
                Whether you&apos;re just starting out or you&apos;re a seasoned pro, Kaitif has something for you. 
                Join our growing community of {PARK_INFO.community.totalSkaters}+ skaters and take your riding to the next level.
              </p>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-4xl font-bold text-[#FFCC00]">{PARK_INFO.community.totalSkaters}+</p>
                  <p className="text-sm text-[#F5F5F0]/60 uppercase tracking-wider">Skaters</p>
                </div>
                <div className="w-[2px] h-12 bg-[#F5F5F0]/10" />
                <div>
                  <p className="text-4xl font-bold text-[#00E6E6]">{PARK_INFO.community.skateShops}</p>
                  <p className="text-sm text-[#F5F5F0]/60 uppercase tracking-wider">Skate Shops</p>
                </div>
                <div className="w-[2px] h-12 bg-[#F5F5F0]/10" />
                <div>
                  <p className="text-4xl font-bold text-[#FFCC00]">6</p>
                  <p className="text-sm text-[#F5F5F0]/60 uppercase tracking-wider">Days/Week</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative overflow-hidden border-2 border-[#F5F5F0]/10">
                <Image
                  src="/images/about-panorama.png"
                  alt="Panoramic view of Kaitif Skatepark"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-[#FFCC00] flex items-center justify-center">
                <span className="text-3xl font-bold text-[#080808]">#1</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Events Preview */}
      <section id="events" className="py-24">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                Upcoming <span className="text-[#FFCC00]">Events</span>
              </h2>
              <p className="text-[#F5F5F0]/60">
                Don&apos;t miss out on competitions, workshops, and community sessions.
              </p>
            </div>
            <Link href="/events" className="hidden md:block">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sample Event Cards */}
            {[
              { title: "Weekend Open Session", category: "Open Session", hype: 45, date: "This Saturday", image: "/images/event-crowd.png" },
              { title: "Beginner Workshop", category: "Workshop", hype: 72, date: "Next Tuesday", image: "/images/event-action.png" },
              { title: "Monthly Competition", category: "Competition", hype: 95, date: "Jan 25th", image: "/images/event-evening.png" },
            ].map((event, i) => (
              <Card key={i} className="group hover:border-[#FFCC00]/50 transition-colors">
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 z-10">{event.category}</Badge>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-[#FFCC00] font-bold mb-2">{event.date}</p>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-4">{event.title}</h3>
                    <HypeMeter value={event.hype} size="sm" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/events">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Park Rules */}
      <section id="rules" className="py-24 bg-[#0A0A0A] border-y-2 border-[#F5F5F0]/10">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Shield className="h-12 w-12 text-[#FFCC00] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              Park <span className="text-[#FFCC00]">Rules</span>
            </h2>
            <p className="text-[#F5F5F0]/60">
              Safety first. Please follow these rules to ensure everyone has a great time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PARK_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border-2 border-[#F5F5F0]/10 hover:border-[#FFCC00]/30 transition-colors">
                <span className="flex-shrink-0 h-8 w-8 bg-[#FFCC00] flex items-center justify-center font-bold text-[#080808]">
                  {i + 1}
                </span>
                <p className="text-[#F5F5F0]/80">{rule}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Hours & Location */}
      <section id="hours" className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <Clock className="h-12 w-12 text-[#FFCC00] mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
                Operating <span className="text-[#FFCC00]">Hours</span>
              </h2>
              <div className="space-y-4">
                {Object.entries(OPERATING_HOURS).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between py-3 border-b border-[#F5F5F0]/10">
                    <span className="font-bold capitalize tracking-wider">{day}</span>
                    <span className={hours.open === "Closed" ? "text-[#F5F5F0]/40" : "text-[#F5F5F0]/60"}>
                      {hours.open === "Closed" ? "Closed" : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <MapPin className="h-12 w-12 text-[#00E6E6] mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
                Find <span className="text-[#00E6E6]">Us</span>
              </h2>
              <Card className="p-6">
                <p className="text-lg font-bold mb-2">{PARK_INFO.name}</p>
                <p className="text-[#F5F5F0]/60 mb-4">{PARK_INFO.address}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-[#F5F5F0]/40">Phone:</span> {PARK_INFO.phone}</p>
                  <p><span className="text-[#F5F5F0]/40">Email:</span> {PARK_INFO.email}</p>
                </div>
                <div className="aspect-video mt-6 bg-[#F5F5F0]/5 border-2 border-[#F5F5F0]/10 flex items-center justify-center">
                  <span className="text-[#F5F5F0]/40">Map</span>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#FFCC00]">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-[#080808] mb-6">
              Ready to Ride?
            </h2>
            <p className="text-xl text-[#080808]/60 max-w-xl mx-auto mb-10">
              Sign up today and get access to digital passes, events, challenges, and the community marketplace.
            </p>
            <Link href="/signup">
              <Button variant="secondary" size="xl" className="group">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-[#F5F5F0]/10">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold tracking-wider text-[#FFCC00]">
              KAITIF
            </div>
            <div className="flex items-center gap-8">
              <a href={PARK_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                Instagram
              </a>
              <a href={PARK_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                Facebook
              </a>
              <a href={PARK_INFO.social.youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                YouTube
              </a>
              <a href="#" className="text-sm text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                Contact
              </a>
            </div>
            <p className="text-sm text-[#F5F5F0]/40">
              © {new Date().getFullYear()} Kaitif Skatepark. All rights reserved.
            </p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-[#F5F5F0]/30">
              Funded by the {PARK_INFO.fundedBy} | Barbados
            </p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
