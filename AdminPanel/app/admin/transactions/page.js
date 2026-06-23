"use client";

import { Receipt } from "@phosphor-icons/react";

export default function AdminTransactionsPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Transactions</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Platform financial ledger and settlements.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Receipt size={48} weight="duotone" className="text-neutral-300 mb-4" />
        <h3 className="text-[18px] font-bold text-ink-headline mb-2">Transactions Ledger</h3>
        <p className="text-[14px] text-neutral-500 max-w-[400px]">Connect to payment gateway APIs (Stripe/JazzCash) to show transaction history here.</p>
      </div>
    </div>
  );
}
