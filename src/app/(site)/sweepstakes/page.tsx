"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Ticket,
  Calendar,
  DollarSign,
  Loader2,
  Minus,
  Plus,
  Star,
  Clock,
} from "lucide-react";
import type { Sweepstake } from "@/lib/shared";

export default function SweepstakesPage() {
  const router = useRouter();
  const [sweepstakes, setSweepstakes] = useState<Sweepstake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [session, setSession] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sweepRes, sessionRes] = await Promise.all([
          fetch("/api/sweepstakes"),
          fetch("/api/auth/session"),
        ]);

        if (sweepRes.ok) {
          const data = await sweepRes.json();
          setSweepstakes(data);
        }

        if (sessionRes.ok) {
          const data = await sessionRes.json();
          if (data.email) {
            setSession(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch sweepstakes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getQuantity = (id: number) => quantities[id] || 1;

  const setQuantity = (id: number, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const handleBuyTickets = async (sweepstake: Sweepstake) => {
    if (!session) {
      router.push(`/login?redirect=/sweepstakes`);
      return;
    }

    setCheckingOut(sweepstake.id);
    try {
      const res = await fetch("/api/raffle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sweepstakeId: sweepstake.id,
          ticketCount: getQuantity(sweepstake.id),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout");
    } finally {
      setCheckingOut(null);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const featured = sweepstakes.filter((s) => s.isFeatured);
  const regular = sweepstakes.filter((s) => !s.isFeatured);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="mt-4 text-primary/60 font-tech">Loading sweepstakes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-amber-500/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">
              <Trophy className="h-3 w-3 mr-1" /> Raffles & Prizes
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sweepstakes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Enter sweepstakes, buy raffle tickets, and win prizes. Every
              ticket supports the CashGlitch mission while giving you a chance
              at amazing prizes.
            </p>
          </div>
        </div>
      </section>

      {sweepstakes.length === 0 ? (
        <section className="container mx-auto px-4 py-16 text-center">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Active Sweepstakes</h2>
          <p className="text-muted-foreground">
            Check back soon for new raffle opportunities!
          </p>
        </section>
      ) : (
        <>
          {/* Featured Sweepstakes */}
          {featured.length > 0 && (
            <section className="container mx-auto px-4 py-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Featured Sweepstakes</h2>
                <p className="text-muted-foreground">
                  Hot prizes with big payoffs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {featured.map((item) => (
                  <SweepstakeCard
                    key={item.id}
                    item={item}
                    featured
                    quantity={getQuantity(item.id)}
                    onQuantityChange={(qty) => setQuantity(item.id, qty)}
                    onBuy={() => handleBuyTickets(item)}
                    isCheckingOut={checkingOut === item.id}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Sweepstakes */}
          {regular.length > 0 && (
            <section className={`container mx-auto px-4 ${featured.length > 0 ? "pb-16" : "py-16"}`}>
              {featured.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">All Sweepstakes</h2>
                  <p className="text-muted-foreground">
                    Browse all available raffles
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((item) => (
                  <SweepstakeCard
                    key={item.id}
                    item={item}
                    quantity={getQuantity(item.id)}
                    onQuantityChange={(qty) => setQuantity(item.id, qty)}
                    onBuy={() => handleBuyTickets(item)}
                    isCheckingOut={checkingOut === item.id}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Tips Section */}
      <section className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Ticket className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Buy Tickets</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a sweepstake and purchase raffle tickets securely via
                  Stripe.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Wait for the Draw</h3>
                <p className="text-sm text-muted-foreground">
                  Each sweepstake has a draw date. The more tickets you have,
                  the better your odds.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Win Prizes</h3>
                <p className="text-sm text-muted-foreground">
                  Winners are notified by email. Every purchase supports the
                  CashGlitch mission.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SweepstakeCard({
  item,
  featured,
  quantity,
  onQuantityChange,
  onBuy,
  isCheckingOut,
  formatPrice,
}: {
  item: Sweepstake;
  featured?: boolean;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onBuy: () => void;
  isCheckingOut: boolean;
  formatPrice: (cents: number) => string;
}) {
  const soldOut = item.maxTickets !== null && item.ticketsSold >= item.maxTickets;

  return (
    <Card className={featured ? "border-2 border-amber-200" : "hover:shadow-lg transition-shadow"}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
            <Badge className={featured ? "bg-amber-100 text-amber-800" : ""} variant={featured ? "default" : "outline"}>
              {formatPrice(item.ticketPriceCents)} / ticket
            </Badge>
          </div>
          {item.drawDate && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(item.drawDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <CardTitle className={featured ? "text-xl" : "text-lg"}>{item.title}</CardTitle>
        <CardDescription className="leading-relaxed">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.prizeDescription && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium text-primary">{item.prizeDescription}</span>
          </div>
        )}

        {/* Tickets sold indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <Ticket className="h-3 w-3 inline mr-1" />
            {item.ticketsSold} sold
            {item.maxTickets && ` / ${item.maxTickets} total`}
          </span>
          {item.maxTickets && (
            <span className={soldOut ? "text-red-500 font-medium" : ""}>
              {soldOut ? "SOLD OUT" : `${item.maxTickets - item.ticketsSold} left`}
            </span>
          )}
        </div>

        {/* Quantity + Buy */}
        {!soldOut && (
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              className="flex-1"
              onClick={onBuy}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Ticket className="h-4 w-4 mr-2" />
              )}
              Buy {quantity} Ticket{quantity > 1 ? "s" : ""} — {formatPrice(item.ticketPriceCents * quantity)}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
