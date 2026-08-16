import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import { PaystackButton } from 'react-paystack';

export default function SubscriptionModule({ currentTenant, tenantConfig, currentUser, refreshData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [globalPaystackKey, setGlobalPaystackKey] = useState(null);
  
  useEffect(() => {
    const fetchPlatformKey = async () => {
      try {
        const snap = await getDoc(doc(db, 'platform', 'settings'));
        if (snap.exists() && snap.data().paystackLiveKey) {
          setGlobalPaystackKey(snap.data().paystackLiveKey);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlatformKey();
  }, []);
  
  const PAYSTACK_PUBLIC_KEY = globalPaystackKey || 'pk_test_67ecf7f3d86d4b4d262edb6ad4bb8a4f48c9ea6c';

  const handleStartTrial = async () => {
    if (tenantConfig?.trialEndsAt) {
      alert("You have already used your free trial.");
      return;
    }
    if (!window.confirm("Start your 7-day free trial now?")) return;
    
    setIsProcessing(true);
    try {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      
      const confRef = doc(db, `organizations`, currentTenant);
      await updateDoc(confRef, {
        subscriptionStatus: 'trial',
        subscriptionPlan: 'premium',
        trialEndsAt: trialEnd.toISOString(),
        updatedAt: serverTimestamp()
      });
      alert("Trial activated successfully! You now have full access for 7 days.");
      await refreshData();
    } catch (err) {
      console.error(err);
      alert("Error starting trial");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaystackProps = (plan) => {
    let usdAmount = 0;
    if (plan === 'basic') {
      usdAmount = billingCycle === 'yearly' ? 80 : 10;
    } else {
      usdAmount = billingCycle === 'yearly' ? 120 : 15;
    }
    
    // Convert to NGN at 1500 NGN per 1 USD, multiplied by 100 to get Kobo
    const amountInKobo = usdAmount * 1500 * 100;

    return {
      email: currentUser?.email || 'admin@recloud.com',
      amount: amountInKobo,
      publicKey: PAYSTACK_PUBLIC_KEY,
      text: `Subscribe to ${plan === 'basic' ? 'Basic' : 'Premium'}`,
      onSuccess: async (reference) => {
        setIsProcessing(true);
        try {
          const subEnd = new Date();
          if (billingCycle === 'yearly') {
            subEnd.setFullYear(subEnd.getFullYear() + 1);
          } else {
            subEnd.setMonth(subEnd.getMonth() + 1);
          }

          const confRef = doc(db, `organizations`, currentTenant);
          await updateDoc(confRef, {
            subscriptionStatus: 'active',
            subscriptionPlan: plan,
            subscriptionEndsAt: subEnd.toISOString(),
            updatedAt: serverTimestamp()
          });
          alert(`Payment successful! Welcome to the ${plan} plan.`);
          await refreshData();
        } catch (err) {
          console.error(err);
          alert("Payment received, but error updating subscription. Please contact support.");
        } finally {
          setIsProcessing(false);
        }
      },
      onClose: () => {
        console.log("Payment dialog closed.");
      },
    };
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 flex flex-col items-center justify-start py-12 px-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-recloud-100 text-recloud-600 mb-6 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Workspace Locked</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Your workspace's subscription is currently inactive or your trial has expired. 
            Please choose a plan to continue accessing your ERP modules, or contact support.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-slate-200 p-1 rounded-full flex items-center">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pay Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pay Yearly <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 33%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative overflow-hidden transition-all hover:shadow-xl hover:border-slate-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Basic Plan</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-slate-800">{billingCycle === 'yearly' ? '$80' : '$10'}</span>
                <span className="text-slate-500 font-medium">/ {billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
              <p className="text-slate-500">Perfect for small businesses getting started with essential ERP tools.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['POS & Retail Sales', 'Inventory (Products, Stock & Suppliers)', 'HR & Employee Management (Up to 3 Users)', 'Discuss & Team Chat'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <PaystackButton 
              className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors"
              {...getPaystackProps('basic')}
            />
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-recloud-600 to-recloud-800 rounded-3xl p-8 shadow-xl shadow-recloud-500/20 border border-recloud-500 flex flex-col relative overflow-hidden text-white transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-8 relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-white">Premium Plan</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-white">{billingCycle === 'yearly' ? '$120' : '$15'}</span>
                <span className="text-recloud-100 font-medium">/ {billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
              <p className="text-recloud-100">Full power for growing enterprises. Complete access to all advanced modules.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {['Everything in Basic', 'Accounting & Tax Module', 'CRM, Pipelines & Invoicing', 'B2B Wholesale Portal', 'Multi-Branch & Warehouses', 'Documents, Projects & AI Assistant', 'Unlimited Users & Branches', 'Webhooks, API & Client Portal'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-recloud-50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <PaystackButton 
              className="w-full py-4 rounded-xl bg-white text-recloud-700 font-black hover:bg-slate-50 transition-colors shadow-lg"
              {...getPaystackProps('premium')}
            />
          </div>
        </div>

        {(!tenantConfig?.trialEndsAt && tenantConfig?.subscriptionStatus !== 'active') && (
          <div className="mt-12 text-center bg-blue-50 border border-blue-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <ShieldCheck className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-2">Want to test the waters first?</h4>
            <p className="text-slate-600 mb-6">Start a free 7-day trial of our Premium features. No credit card required.</p>
            <button onClick={handleStartTrial} disabled={isProcessing} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md">
              {isProcessing ? 'Activating...' : 'Start 7-Day Free Trial'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
