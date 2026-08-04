import React from 'react';
import { notFound } from 'next/navigation';
import { getDbClient } from '@/lib/db';
import { ShieldCheck, Calendar, Hammer, Microscope, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable caching

interface TrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const db = getDbClient();
  const { id } = await params;

  let order = null;
  try {
    order = await db.order.findUnique({
      where: { id }
    });
  } catch (e) {
    console.error("Error loading order for tracking page:", e);
  }

  if (!order) {
    return notFound();
  }

  // Determine active status stage
  const statuses = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Registry registered. Initial bench evaluation.', icon: Calendar },
    { key: 'PROCESSING', title: 'Registry Check', desc: 'GIA laser inscription verification & sizing validation.', icon: ShieldCheck },
    { key: 'IN_PRODUCTION', title: 'Atelier Production', desc: 'Bench jewelers molding gold structure and setting diamonds.', icon: Hammer },
    { key: 'QUALITY_CONTROL', title: 'Quality Auditing', desc: 'Prong stress-tests & alignment review under microscope.', icon: Microscope },
    { key: 'SHIPPED', title: 'FedEx Insured Dispatch', desc: 'Packaged in double-sealed tamper proof containers.', icon: Truck },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Adult signature confirmation verified.', icon: CheckCircle }
  ];

  const activeIndex = statuses.findIndex(s => s.key === order.status);
  const currentStatusIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      {/* Tracking Header */}
      <div className="border-b border-gold/15 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Bench Pipeline</span>
          <h1 className="font-serif text-3xl tracking-widest uppercase text-[#121212]">Track Order Progress</h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Tracking ID: <strong className="text-neutral-700 font-mono">{order.orderNumber}</strong>
          </p>
        </div>
        
        {/* Short Status Badge */}
        <div className="bg-gold-50 border border-gold-300/40 text-gold-700 px-4 py-1.5 text-[10px] font-sans font-bold tracking-widest uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-ping" />
          Status: {statuses[currentStatusIndex].title}
        </div>
      </div>

      {/* Live Pipeline Layout */}
      <div className="bg-white border border-neutral-200 p-6 sm:p-10 space-y-10">
        
        <div className="relative flex flex-col gap-8">
          {/* Vertical pipeline connector line */}
          <div className="absolute left-6 top-3 bottom-3 w-[1.5px] bg-neutral-200 z-0" />
          
          {/* Success timeline fills */}
          <div 
            className="absolute left-6 top-3 w-[1.5px] bg-gold-500 z-0 transition-all duration-500"
            style={{ height: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
          />

          {statuses.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = idx <= currentStatusIndex;
            const isActive = idx === currentStatusIndex;

            return (
              <div key={idx} className="flex gap-6 items-start relative z-10 animate-fade-in">
                
                {/* Icon wrapper */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted 
                      ? 'bg-gold-500 border-gold-600 text-white shadow-md' 
                      : 'bg-[#faf8f5] border-neutral-200 text-neutral-400'
                  } ${isActive ? 'ring-4 ring-gold-100 scale-105' : ''}`}
                >
                  <StepIcon className="h-5 w-5" />
                </div>

                {/* Details */}
                <div className="space-y-1 flex-1 py-1">
                  <h4 className={`font-serif text-sm uppercase tracking-wider font-semibold ${
                    isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs font-sans font-light leading-relaxed ${
                    isCompleted ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    {step.desc}
                  </p>
                  
                  {isActive && (
                    <span className="inline-block mt-1 text-[8px] tracking-widest text-gold-600 font-bold uppercase bg-gold-50 px-2 py-0.5 border border-gold-300/30 font-sans">
                      Active bench stage
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Summary details card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
        
        {/* Consignment Address */}
        <div className="bg-[#faf8f5] border border-gold/15 p-5 space-y-2">
          <h4 className="font-serif text-xs uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-semibold">
            Consignee Handover Address
          </h4>
          <div className="text-xs text-neutral-500 space-y-1">
            <p className="font-semibold text-neutral-800">{order.shippingName}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingCity}, {order.shippingZip}</p>
            <p>Phone: {order.shippingPhone}</p>
          </div>
        </div>

        {/* Support contacts */}
        <div className="bg-[#faf8f5] border border-gold/15 p-5 space-y-2 flex flex-col justify-between">
          <div>
            <h4 className="font-serif text-xs uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-semibold">
              Need Bench Adjustments?
            </h4>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-light">
              Our bench jewelers inspect designs thoroughly. If you require size corrections or custom adjustments, speak with design representatives.
            </p>
          </div>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-widest font-semibold text-gold-600 hover:text-gold-700 mt-4 block"
          >
            Contact Private Consultant →
          </Link>
        </div>

      </div>

    </div>
  );
}
