import React from 'react';
import { Search, Camera, History, PauseCircle, PlayCircle, ShoppingCart } from 'lucide-react';
import usePosStore from '../../store/usePosStore';
import ScannerComponent from '../../ScannerComponent';

export default function PosProductGrid({ 
  products, 
  warehouses, 
  currentUser, 
  activeShift,
  handleBarcodeScanned 
}) {
  const {
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    mobileView,
    selectedWarehouseId, setSelectedWarehouseId, setCart,
    showScanner, setShowScanner,
    setShowStartShift, setShowEndShift,
    showRecentSales, setShowRecentSales,
    heldCarts,
    addToCart,
    cart,
    setMobileView
  } = usePosStore();

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const getFilteredStock = (product) => {
    const activeWarehouse = selectedWarehouseId || currentUser?.warehouseId || (warehouses?.[0]?.id);
    const branchStock = product.stockByWarehouse || {};
    if (activeWarehouse) {
       return Number(branchStock[activeWarehouse] || 0);
    }
    return Object.values(branchStock).reduce((sum, val) => sum + (Number(val) || 0), 0) || Number(product.stock || 0);
  };

  const resumeCart = (heldCartId) => {
    const useStore = usePosStore.getState();
    const hc = useStore.heldCarts.find(c => c.id === heldCartId);
    if (!hc) return;
    useStore.setCart(hc.items);
    if (hc.customer) useStore.setSelectedCustomer(hc.customer);
    useStore.setHeldCarts(useStore.heldCarts.filter(c => c.id !== heldCartId));
  };

  return (
    <div className={`flex-1 flex-col h-full bg-slate-50/50 ${mobileView === 'products' ? 'flex' : 'hidden md:flex'}`}>
      
      {/* Top Header & Search */}
      <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search product name, SKU, or category..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-recloud-500 shadow-inner font-medium text-slate-700" 
          />
        </div>
        
        {!currentUser?.warehouseId && warehouses?.length > 0 && (
          <select 
            value={selectedWarehouseId} 
            onChange={(e) => { setSelectedWarehouseId(e.target.value); setCart([]); }} 
            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-recloud-500 shadow-inner font-bold text-slate-700"
          >
            <option value="">Global Stock</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        )}

        <button 
          onClick={() => setShowScanner(!showScanner)} 
          className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${showScanner ? 'bg-recloud-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
        >
          <Camera className="w-5 h-5" />
        </button>
        
        {activeShift ? (
          <button onClick={() => setShowEndShift(true)} className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
            End Shift
          </button>
        ) : (
          <button onClick={() => setShowStartShift(true)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
            Start Shift
          </button>
        )}

        <button onClick={() => setShowRecentSales(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <History className="w-5 h-5" /> Recent Sales
        </button>
        
        {heldCarts.length > 0 && (
          <div className="relative group z-50">
            <button className="bg-orange-100 text-orange-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
              <PauseCircle className="w-5 h-5"/> {heldCarts.length} Held
            </button>
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2 border-b border-slate-100 font-bold text-slate-700 text-sm bg-slate-50">Held Transactions</div>
              {heldCarts.map(hc => (
                <button key={hc.id} onClick={() => resumeCart(hc.id)} className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-50 flex items-center justify-between group/btn">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{hc.name || 'Order'}</div>
                    <div className="text-xs text-slate-500">{hc.items.length} items</div>
                  </div>
                  <PlayCircle className="w-5 h-5 text-recloud-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showScanner && (
        <div className="p-4 bg-slate-900 flex justify-center z-40">
           <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl relative">
              <button onClick={() => setShowScanner(false)} className="absolute top-2 right-2 z-10 bg-slate-900/50 text-white p-2 rounded-full hover:bg-slate-900 transition-colors">
                 <span className="font-bold w-5 h-5 flex items-center justify-center">X</span>
              </button>
              <ScannerComponent onScanSuccess={(text) => { setShowScanner(false); handleBarcodeScanned(text); }} onScanError={() => {}} />
           </div>
        </div>
      )}

      {/* Categories Bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar flex gap-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)} 
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-20">
          {filteredProducts.map(product => {
            const stock = getFilteredStock(product);
            const isLow = stock > 0 && stock <= (Number(product.minStockLevel) || 10);
            const isOut = stock <= 0;
            return (
              <button 
                key={product.id} 
                onClick={() => addToCart({
                  ...product, 
                  price: Number(product.price || product.priceWholesale || product.priceRetail || 0),
                  availableStock: stock
                })}
                disabled={isOut}
                className={`bg-white rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center relative overflow-hidden group ${isOut ? 'border-slate-100 opacity-50 cursor-not-allowed' : 'border-transparent hover:border-recloud-400 hover:shadow-lg shadow-sm'}`}
              >
                <div className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full ${isOut ? 'bg-red-100 text-red-600' : isLow ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {stock} left
                </div>
                <div className="w-full aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 font-bold text-xl">{product.name?.charAt(0) || 'P'}</span>
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 w-full truncate">{product.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 truncate max-w-full">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 truncate">{product.category || 'Uncategorized'}</span>
                </div>
                <div className="mt-auto font-black text-recloud-600 w-full bg-recloud-50/50 py-1.5 rounded-lg border border-recloud-100 group-hover:bg-recloud-600 group-hover:text-white transition-colors">
                  ₦{Number(product.price || product.priceWholesale || product.priceRetail || 0).toLocaleString()}
                </div>
              </button>
            )
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-slate-500">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No products found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setMobileView('cart')}
          className="bg-recloud-600 hover:bg-recloud-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md animate-pulse">
              {cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
