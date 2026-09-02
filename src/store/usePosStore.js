import { create } from 'zustand';

const usePosStore = create((set, get) => ({
  // Cart & Customer State
  cart: [],
  heldCarts: [],
  selectedCustomer: null,
  manualCustomerName: '',
  manualCustomerPhone: '',
  discountPercent: 0,
  taxPercent: 0,

  // UI State
  searchQuery: '',
  activeCategory: 'All',
  mobileView: 'products',
  isProcessing: false,
  printFormat: 'thermal',
  
  // Payment Modal State
  showPaymentModal: false,
  paymentMethod: 'Cash',
  splitAmounts: { cash: '', card: '', transfer: '' },
  
  // Shift Management State
  showStartShift: false,
  showEndShift: false,
  activeShift: null,
  actualCash: '',
  openingFloat: '',
  
  // Scanners & Misc State
  showScanner: false,
  showRecentSales: false,
  selectedWarehouseId: '',
  receiptData: null,
  showResumePrompt: false,
  pendingTaskData: null,
  isInitialized: false,
  
  // Recent Sales Pagination State
  recentSalesData: [],
  lastSaleDoc: null,
  hasMoreSales: true,
  isLoadingSales: false,

  // Actions
  setCart: (cart) => set({ cart }),
  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      set({
        cart: cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item.id !== productId) });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    });
  },
  clearCart: () => set({ cart: [], selectedCustomer: null, manualCustomerName: '', manualCustomerPhone: '', discountPercent: 0, taxPercent: 0 }),
  
  // Setters for all states
  setHeldCarts: (heldCarts) => set({ heldCarts }),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
  setManualCustomerName: (manualCustomerName) => set({ manualCustomerName }),
  setManualCustomerPhone: (manualCustomerPhone) => set({ manualCustomerPhone }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setMobileView: (mobileView) => set({ mobileView }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setDiscountPercent: (discountPercent) => set({ discountPercent }),
  setTaxPercent: (taxPercent) => set({ taxPercent }),
  setPrintFormat: (printFormat) => set({ printFormat }),
  setShowPaymentModal: (showPaymentModal) => set({ showPaymentModal }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setSplitAmounts: (splitAmounts) => set({ splitAmounts }),
  setShowStartShift: (showStartShift) => set({ showStartShift }),
  setShowEndShift: (showEndShift) => set({ showEndShift }),
  setActiveShift: (activeShift) => set({ activeShift }),
  setActualCash: (actualCash) => set({ actualCash }),
  setOpeningFloat: (openingFloat) => set({ openingFloat }),
  setShowScanner: (showScanner) => set({ showScanner }),
  setShowRecentSales: (showRecentSales) => set({ showRecentSales }),
  setSelectedWarehouseId: (selectedWarehouseId) => set({ selectedWarehouseId }),
  setReceiptData: (receiptData) => set({ receiptData }),
  setShowResumePrompt: (showResumePrompt) => set({ showResumePrompt }),
  setPendingTaskData: (pendingTaskData) => set({ pendingTaskData }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
  setRecentSalesData: (recentSalesData) => set({ recentSalesData }),
  setLastSaleDoc: (lastSaleDoc) => set({ lastSaleDoc }),
  setHasMoreSales: (hasMoreSales) => set({ hasMoreSales }),
  setIsLoadingSales: (isLoadingSales) => set({ isLoadingSales })
}));

export default usePosStore;
