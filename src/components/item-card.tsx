"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { addToCart } from "@/lib/cart";
import { LokasiTitik } from "@/components/lokasi-titik";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MapPin, 
  ShoppingCart, 
  CheckCircle2, 
  Star, 
  ArrowUpRight,
  MessageSquare
} from "lucide-react";

export interface ItemData {
  id: string;
  name: string;
  category: "barang" | "jasa";
  categoryLabel: string;
  subLabel: string;
  condition?: string;
  description: string;
  price: number;
  priceUnit?: string;
  imageUrl: string;
  badge: string;
  location: string;
  rating?: string;
  seller: {
    name: string;
    avatarText: string;
    campus: string;
    verified: boolean;
  };
}

interface ItemCardProps {
  item: ItemData;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function ItemCard({
  item,
  isFavorite,
  onToggleFavorite,
}: ItemCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const isService = item.category === "jasa";

  // tekan "masukkan ke cart" → simpan + langsung ke halaman keranjang
  const handleAddToCart = () => {
    addToCart(item.id);
    router.push("/cart");
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -6,
        scale: 1.015,
        duration: 0.28,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`item-card-anim group rounded-3xl overflow-hidden border bg-cyber-card/90 transition-colors flex flex-col ${
        isService
          ? "border-cyber-border hover:border-accent/60"
          : "border-cyber-border hover:border-accent/60"
      }`}
    >
      {/* Top Image Showcase */}
      <div className="relative w-full h-52 bg-cyber-surface overflow-hidden">
        <img
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={item.imageUrl}
        />

        {/* Scanline overlay subtle */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Retro Sticker Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge
            variant="default"
            className="shadow-md backdrop-blur-md bg-cyber-bg/85 font-mono text-[10px]"
          >
            {item.badge}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(item.id)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-xl bg-cyber-bg/80 backdrop-blur-md border border-cyber-border flex items-center justify-center transition-colors ${
            isFavorite ? "text-rose-600 border-rose-500/50" : "text-slate-500 hover:text-ink"
          }`}
          title="Simpan ke favorit"
          type="button"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
        </button>

        {/* Location & Rating sticker */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
          <span className="bg-cyber-surface/90 border border-cyber-border/80 text-slate-600 px-2 py-0.5 rounded-lg flex items-center gap-1">
            <MapPin className="w-3 h-3 text-ink" />
            <LokasiTitik value={item.location} />
          </span>
          {item.rating && (
            <span className="bg-accent/15 border border-accent/40 text-ink px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-ink" />
              {item.rating}
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Category & Tag pills */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-black tracking-widest uppercase text-ink">
              {"// "}{item.categoryLabel}
            </span>
            <Badge variant="muted" className="text-[10px] font-mono">
              {item.subLabel}
            </Badge>
          </div>

          {/* Item Title */}
          <Link href={`/items/${item.id}`} className="group/link block">
            <h3 className="text-sm font-bold text-ink line-clamp-1 group-hover/link:text-ink transition-colors flex items-center justify-between">
              <span>{item.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity text-ink shrink-0" />
            </h3>
          </Link>

          {/* Item Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Seller & Pricing */}
        <div className="pt-3 border-t border-cyber-border/70 flex flex-col gap-3.5">
          {/* Seller Profile row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-accent/20 text-ink border border-accent/40">
                {item.seller.avatarText}
              </div>
              <span className="font-semibold text-slate-700">{item.seller.name}</span>
              {item.seller.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-signal" />
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-500">{item.seller.campus}</span>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                {isService ? "TARIF MULAI" : "HARGA PAS"}
              </span>
              <span className="text-base font-mono font-black text-ink">
                Rp {item.price.toLocaleString("id-ID")}
                {item.priceUnit && (
                  <span className="text-xs font-normal text-slate-500 font-mono">
                    {item.priceUnit}
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                onClick={handleAddToCart}
                variant="secondary"
                size="icon"
                className="rounded-xl border-cyber-border hover:border-accent/50"
                title="Tambah ke Keranjang"
              >
                <ShoppingCart className="w-4 h-4 text-ink" />
              </Button>
              <Button
                asChild
                variant="cyan"
                size="sm"
                className="font-mono text-xs px-3.5"
              >
                <Link href={`/checkout?item=${item.id}`}>
                  {isService ? (
                    <span className="flex items-center gap-1">
                      <span>BOOKING</span>
                      <MessageSquare className="w-3 h-3" />
                    </span>
                  ) : (
                    <span>BELI</span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
