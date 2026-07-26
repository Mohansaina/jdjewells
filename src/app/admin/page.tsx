'use client';

import React, { useState, useEffect } from 'react';
import { useConfigurator } from '@/context/ConfiguratorContext';
import { useToast } from '@/context/ToastContext';
import { DollarSign, ShoppingBag, Grid, ShieldAlert, Award, Hammer, Settings, ArrowUpDown, ChevronDown, Check, Trash2, PlusCircle, AlertCircle, Mail, Download } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'diamonds' | 'subscribers'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [diamonds, setDiamonds] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { success, error } = useToast();

  // Add Product Form States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('rings');
  const [pMaterial, setPMaterial] = useState('');
  const [pPrice, setPPrice] = useState(1000);
  const [pImage, setPImage] = useState('/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg');
  const [pSpecs, setPSpecs] = useState('{"metal": "Solid Gold", "stone": "Natural Diamond"}');
  const [pCare, setPCare] = useState('');

  // Add Diamond Form States
  const [isAddDiamondOpen, setIsAddDiamondOpen] = useState(false);
  const [dShape, setDShape] = useState('Round');
  const [dCarat, setDCarat] = useState(1.0);
  const [dColor, setDColor] = useState('D');
  const [dClarity, setDClarity] = useState('VVS1');
  const [dCut, setDCut] = useState('Excellent');
  const [dPrice, setDPrice] = useState(3500);
  const [dCert, setDCert] = useState('GIA');

  // Load Admin Data on mount
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const resOrd = await fetch('/api/orders');
      const resProd = await fetch('/api/products');
      const resDia = await fetch('/api/diamonds');
      const resSub = await fetch('/api/newsletter');
      
      if (resOrd.ok) setOrders(await resOrd.json());
      if (resProd.ok) setProducts(await resProd.json());
      if (resDia.ok) setDiamonds(await resDia.json());
      if (resSub.ok) setSubscribers(await resSub.json());
    } catch (e) {
      console.error("Admin data load error:", e);
    }
    setLoading(false);
  };

  // Export Subscribers to CSV
  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      error("No newsletter subscribers to export.");
      return;
    }
    const headers = "ID,Email,SubscribedDate\n";
    const rows = subscribers.map(s => `${s.id},"${s.email}",${new Date(s.createdAt).toISOString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jd_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success("Subscribers registry exported to CSV successfully!");
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        success("Order status registry updated successfully!");
      }
    } catch (e) {
      console.error(e);
      error("Failed to modify order status");
    }
  };

  // Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pTitle,
          category: pCategory,
          material: pMaterial,
          price: parseFloat(pPrice.toString()) || 100,
          image: pImage,
          specs: pSpecs,
          care: pCare
        })
      });
      if (res.ok) {
        const item = await res.json();
        setProducts(prev => [...prev, item]);
        setIsAddProductOpen(false);
        setPTitle('');
        setPMaterial('');
        success("New product catalog registered successfully!");
      }
    } catch (e) {
      console.error(e);
      error("Failed to add product");
    }
  };

  // Add Custom Diamond Handler
  const handleAddDiamond = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/diamonds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shape: dShape,
          carat: parseFloat(dCarat.toString()) || 1.0,
          color: dColor,
          clarity: dClarity,
          cut: dCut,
          price: parseFloat(dPrice.toString()) || 1000,
          certificate: dCert
        })
      });
      if (res.ok) {
        const stone = await res.json();
        setDiamonds(prev => [...prev, stone]);
        setIsAddDiamondOpen(false);
        success("Custom diamond added to vault registry successfully!");
      }
    } catch (e) {
      console.error(e);
      error("Failed to add diamond");
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        success("Product removed from database catalog.");
        setDeleteConfirmId(null);
      }
    } catch (e) {
      console.error(e);
      error("Failed to remove product from catalog");
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status !== 'DELIVERED').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gold/15 pb-6">
        <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Master Controls</span>
        <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900">Admin Dashboard</h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans text-xs">
        <div className="bg-[#faf8f5] border border-gold/15 p-5 flex justify-between items-center">
          <div>
            <span className="text-neutral-400 font-semibold uppercase block">Total Sales</span>
            <strong className="text-lg text-neutral-900 font-bold mt-1 block">${totalRevenue.toLocaleString()}</strong>
          </div>
          <DollarSign className="h-8 w-8 text-gold-500 stroke-[1.2]" />
        </div>

        <div className="bg-[#faf8f5] border border-gold/15 p-5 flex justify-between items-center">
          <div>
            <span className="text-neutral-400 font-semibold uppercase block">Bench Workload</span>
            <strong className="text-lg text-neutral-900 font-bold mt-1 block">{pendingOrders} Pending</strong>
          </div>
          <ShoppingBag className="h-8 w-8 text-gold-500 stroke-[1.2]" />
        </div>

        <div className="bg-[#faf8f5] border border-gold/15 p-5 flex justify-between items-center">
          <div>
            <span className="text-neutral-400 font-semibold uppercase block">Catalog Size</span>
            <strong className="text-lg text-neutral-900 font-bold mt-1 block">{products.length} Items</strong>
          </div>
          <Grid className="h-8 w-8 text-gold-500 stroke-[1.2]" />
        </div>

        <div className="bg-[#faf8f5] border border-gold/15 p-5 flex justify-between items-center">
          <div>
            <span className="text-neutral-400 font-semibold uppercase block">Avg Order Value</span>
            <strong className="text-lg text-neutral-900 font-bold mt-1 block">${avgOrderValue.toLocaleString()}</strong>
          </div>
          <Award className="h-8 w-8 text-gold-500 stroke-[1.2]" />
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gold/10 font-sans text-xs tracking-wider uppercase font-semibold text-neutral-500 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors focus:outline-none ${
            activeTab === 'orders' ? 'text-gold-600 border-b-2 border-gold-500 font-bold' : 'hover:text-neutral-800'
          }`}
        >
          Manage Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors focus:outline-none ${
            activeTab === 'products' ? 'text-gold-600 border-b-2 border-gold-500 font-bold' : 'hover:text-neutral-800'
          }`}
        >
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('diamonds')}
          className={`pb-3 transition-colors focus:outline-none ${
            activeTab === 'diamonds' ? 'text-gold-600 border-b-2 border-gold-500 font-bold' : 'hover:text-neutral-800'
          }`}
        >
          Diamond Vault ({diamonds.length})
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-3 transition-colors focus:outline-none ${
            activeTab === 'subscribers' ? 'text-gold-600 border-b-2 border-gold-500 font-bold' : 'hover:text-neutral-800'
          }`}
        >
          Newsletter VIPs ({subscribers.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400 font-sans font-semibold">Loading admin panel data registries...</div>
      ) : (
        <div className="space-y-6">
          
          {/* TAB 1: MANAGE ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-neutral-200 overflow-x-auto text-xs font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 font-semibold text-neutral-500">
                    <th className="py-3.5 px-4 w-28">Order Number</th>
                    <th className="py-3.5 px-4 w-44">Client Shipping Details</th>
                    <th className="py-3.5 px-4 w-24">Date</th>
                    <th className="py-3.5 px-4 w-24">Total Value</th>
                    <th className="py-3.5 px-4 w-36 text-center">Bench Status Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/50">
                      <td className="py-4 px-4 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                      <td className="py-4 px-4 leading-normal">
                        <p className="font-semibold text-neutral-900">{ord.shippingName}</p>
                        <p className="text-[10px] text-neutral-400">{ord.shippingAddress}, {ord.shippingCity}</p>
                      </td>
                      <td className="py-4 px-4 text-neutral-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 font-semibold text-neutral-900">${ord.total.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#faf8f5] border border-gold-200 text-xs py-1 px-2.5 font-semibold text-neutral-700"
                        >
                          <option value="PLACED">Placed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="IN_PRODUCTION">In Production</option>
                          <option value="QUALITY_CONTROL">QC Inspection</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: MANAGE PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-5 py-2.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-sm transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" /> Add Catalog Product
                </button>
              </div>

              <div className="bg-white border border-neutral-200 overflow-x-auto text-xs font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100 font-semibold text-neutral-500">
                      <th className="py-3.5 px-4 w-16">Preview</th>
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4 w-32">Category</th>
                      <th className="py-3.5 px-4 w-24">Price</th>
                      <th className="py-3.5 px-4 w-20 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4">
                          <img src={prod.image} alt="" className="w-8 h-8 object-contain bg-neutral-50 border p-0.5" />
                        </td>
                        <td className="py-3 px-4 font-serif font-medium text-neutral-900 text-sm">{prod.title}</td>
                        <td className="py-3 px-4 uppercase tracking-wider text-[10px] text-neutral-400">{prod.category}</td>
                        <td className="py-3 px-4 font-semibold text-neutral-800">${prod.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setDeleteConfirmId(prod.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE DIAMONDS */}
          {activeTab === 'diamonds' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAddDiamondOpen(true)}
                  className="px-5 py-2.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-sm transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" /> Add Vault Diamond
                </button>
              </div>

              <div className="bg-white border border-neutral-200 overflow-x-auto text-xs font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100 font-semibold text-neutral-500">
                      <th className="py-3.5 px-4 w-28">Certificate No</th>
                      <th className="py-3.5 px-4">Diamond Specs</th>
                      <th className="py-3.5 px-4 w-32">Cut Quality</th>
                      <th className="py-3.5 px-4 w-24">Price</th>
                      <th className="py-3.5 px-4 w-20 text-center">Cert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {diamonds.map((dia) => (
                      <tr key={dia.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4 font-mono text-neutral-400">{dia.certificateNo}</td>
                        <td className="py-3 px-4 font-semibold text-neutral-900 text-sm">
                          {dia.carat}ct {dia.shape} ({dia.color}/{dia.clarity})
                        </td>
                        <td className="py-3 px-4 text-neutral-500">{dia.cut}</td>
                        <td className="py-3 px-4 font-bold text-neutral-800">${dia.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-neutral-400 text-center font-bold">{dia.certificate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NEWSLETTER VIP SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#faf8f5] border border-gold-500/20 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gold-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-neutral-900">
                      VIP Journal Newsletter Subscribers ({subscribers.length})
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-sans">
                      Clients who subscribed to receive private vault drops & collection updates.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportSubscribersCSV}
                  className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider gold-gradient text-white hover:gold-gradient-hover rounded-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>

              <div className="bg-white border border-neutral-200 overflow-x-auto text-xs font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100 font-semibold text-neutral-500">
                      <th className="py-3.5 px-4 w-12">#</th>
                      <th className="py-3.5 px-4">Client Email Address</th>
                      <th className="py-3.5 px-4 w-48">Subscription Date</th>
                      <th className="py-3.5 px-4 w-36 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-neutral-400 font-sans italic">
                          No newsletter subscribers recorded yet.
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub, idx) => (
                        <tr key={sub.id || idx} className="hover:bg-neutral-50/50">
                          <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{sub.email}</td>
                          <td className="py-3.5 px-4 text-neutral-500">
                            {new Date(sub.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300/40 px-2.5 py-0.5 rounded-full uppercase">
                              Active VIP
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-white border border-gold/30 w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-base text-neutral-900 border-b border-neutral-100 pb-2 font-semibold">
              Register New Product Catalog
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Product Title</label>
                <input
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="E.g. Vintage Engagement Ring Setting"
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Category</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="rings">Rings</option>
                  <option value="engagement rings">Engagement Rings</option>
                  <option value="wedding bands">Wedding Bands</option>
                  <option value="earrings">Earrings</option>
                  <option value="pendants">Pendants</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="custom">Custom Jewelry</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Base Price ($)</label>
                <input
                  type="number"
                  required
                  value={pPrice}
                  onChange={(e) => setPPrice(parseInt(e.target.value) || 0)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Material Description</label>
                <input
                  type="text"
                  required
                  value={pMaterial}
                  onChange={(e) => setPMaterial(e.target.value)}
                  placeholder="E.g. Solid 18k White Gold"
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Product Image (Local Path or Web URL)</label>
                <input
                  type="text"
                  required
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  placeholder="e.g. /assets/images/500288698_1229972801842035_6145526371360903892_n.jpg or https://images.unsplash.com/..."
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none font-mono"
                />
                <p className="text-[9px] text-neutral-400 italic">Supports local assets or raw external image links from anywhere on the web.</p>
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Specifications JSON (Dynamic keys)</label>
                <textarea
                  rows={2}
                  required
                  value={pSpecs}
                  onChange={(e) => setPSpecs(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 border text-neutral-500 hover:bg-neutral-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 gold-gradient text-white hover:gold-gradient-hover text-xs font-semibold shadow-sm"
              >
                Add Catalog Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD DIAMOND MODAL */}
      {isAddDiamondOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddDiamond} className="bg-white border border-gold/30 w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-base text-neutral-900 border-b border-neutral-100 pb-2 font-semibold">
              Register Custom Vault Diamond
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Shape</label>
                <select
                  value={dShape}
                  onChange={(e) => setDShape(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Round">Round</option>
                  <option value="Oval">Oval</option>
                  <option value="Cushion">Cushion</option>
                  <option value="Princess">Princess</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Pear">Pear</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Radiant">Radiant</option>
                  <option value="Heart">Heart</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Carat Weight</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={dCarat}
                  onChange={(e) => setDCarat(parseFloat(e.target.value) || 1.0)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Color Grade</label>
                <select
                  value={dColor}
                  onChange={(e) => setDColor(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="D">D (Colorless)</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                  <option value="I">I</option>
                  <option value="J">J</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Clarity Grade</label>
                <select
                  value={dClarity}
                  onChange={(e) => setDClarity(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="FL">FL (Flawless)</option>
                  <option value="IF">IF</option>
                  <option value="VVS1">VVS1</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1</option>
                  <option value="VS2">VS2</option>
                  <option value="SI1">SI1</option>
                  <option value="SI2">SI2</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Cut Quality</label>
                <select
                  value={dCut}
                  onChange={(e) => setDCut(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Price ($)</label>
                <input
                  type="number"
                  required
                  value={dPrice}
                  onChange={(e) => setDPrice(parseInt(e.target.value) || 1000)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Certificate</label>
                <select
                  value={dCert}
                  onChange={(e) => setDCert(e.target.value)}
                  className="bg-[#faf8f5] border px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="GIA">GIA</option>
                  <option value="IGI">IGI</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsAddDiamondOpen(false)}
                className="px-4 py-2 border text-neutral-500 hover:bg-neutral-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 gold-gradient text-white hover:gold-gradient-hover text-xs font-semibold shadow-sm"
              >
                Register Stone
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-red-500/20 w-full max-w-sm p-6 space-y-4 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-base text-neutral-900 font-bold">Remove Catalog Product?</h3>
              <p className="text-xs text-neutral-500 mt-1">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex justify-center gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border text-neutral-500 hover:bg-neutral-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
