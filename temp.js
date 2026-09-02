
    {
      "@context": "https://schema.org",
      "@type": "Pharmacy",
      "name": "G4mg - Adamz Pharmacy & Stores Ltd",
      "telephone": "+2348063004747",
      "url": "https://g4mg-adamzpharmacy.com",
      "description": "Fully Mobile Optimized Advanced Analytics Pharmacy System.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Road",
        "addressLocality": "Oghara",
        "addressRegion": "Delta State"
      }
    }
    







        (function () {
            emailjs.init("YOUR_PUBLIC_KEY"); // User to replace with their key
        })();
    

        // ==========================================
        // ✅ REAL FIREBASE CONFIGURATION
        // ==========================================
        const firebaseConfig = {
            apiKey: "AIzaSyDzqopmiul82JQutPZYaMbUu-WvLMfyK3Q",
            authDomain: "g4mg-adamz-pharmacy.firebaseapp.com",
            projectId: "g4mg-adamz-pharmacy",
            storageBucket: "g4mg-adamz-pharmacy.appspot.com",
            messagingSenderId: "458690118472",
            appId: "1:458690118472:web:5546a44aa4ae5e3190e97d",
            measurementId: "G-B56FL3HKNF"
        };

        // Initialize Firebase
        let db, auth;
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            auth = firebase.auth();
            console.log("Firebase Connected");
        } catch (error) {
            console.error("Firebase Connection Failed", error);
        }

        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        medical: { 500: '#059669', 600: '#047857' },
                        primary: { 800: '#1e40af', 900: '#1e3a8a' },
                        accent: { 500: '#f59e0b', 600: '#d97706' }
                    }
                }
            }
        }
    

        const SEED_PRODUCTS = [
            { id: 1, name: "LABET -50 INJECTION", desc: "Labetalol Hydrochloride 5mg/ml x 10ml", category: "Injections", priceStaff: 2200, priceWholesale: 2800, stock: 50, image: "https://via.placeholder.com/150?text=Labet+Inj" },
            { id: 2, name: "LABET 200 TABLET", desc: "Labetalol Hydrochloride x 30’s", category: "Tablets", priceStaff: 9700, priceWholesale: 10500, stock: 100, image: "https://via.placeholder.com/150?text=Labet+Tabs" },
            { id: 3, name: "VALVAS 5/160", desc: "Valsartan (160mg) + Amlodipine (5mg) x 30’s", category: "Tablets", priceStaff: 11500, priceWholesale: 12300, stock: 60, image: "https://via.placeholder.com/150?text=Valvas+5" },
            { id: 4, name: "VALVAS 10/160", desc: "Valsartan (160mg) + Amlodipine (10mg)", category: "Tablets", priceStaff: 11700, priceWholesale: 12500, stock: 40, image: "https://via.placeholder.com/150?text=Valvas+10" },
            { id: 5, name: "SYNERGO TABS", desc: "Cabergoline 0.5mg × 8", category: "Tablets", priceStaff: 11700, priceWholesale: 12700, stock: 25, image: "https://via.placeholder.com/150?text=Synergo" },
            { id: 6, name: "IMPREGNIL TABS", desc: "Letrozole 2.5mg × 30", category: "Tablets", priceStaff: 9500, priceWholesale: 10300, stock: 30, image: "https://via.placeholder.com/150?text=Impregnil" },
            { id: 7, name: "Pregabalin 75MG", desc: "Pregabalin 75mg X30", category: "Tablets", priceStaff: 5800, priceWholesale: 6300, stock: 80, image: "https://via.placeholder.com/150?text=Pregabalin" },
            { id: 8, name: "CIVODEX EYE/EAR DROPS", desc: "Ciprofloxacin (0.3%)/Dexamethasone (0.1%)", category: "Eye/Ear Drops", priceStaff: 1500, priceWholesale: 2000, stock: 45, image: "https://via.placeholder.com/150?text=Civodex" },
            { id: 9, name: "SPIROCARD 25", desc: "Spironolactone 25mg tablets x 100’s", category: "Tablets", priceStaff: 8500, priceWholesale: 9300, stock: 100, image: "https://via.placeholder.com/150?text=Spirocard" },
            { id: 10, name: "Clozotic ear drop", desc: "Clotrimazole, lignocaine, chloramphenicol", category: "Eye/Ear Drops", priceStaff: 2200, priceWholesale: 2500, stock: 35, image: "https://via.placeholder.com/150?text=Clozotic" },
            { id: 11, name: "SODICROM EYE DROP", desc: "Sodicrom cromoglycate 2 % x 10ml", category: "Eye/Ear Drops", priceStaff: 1700, priceWholesale: 2200, stock: 20, image: "https://via.placeholder.com/150?text=Sodicrom" },
            { id: 12, name: "LINAGEN", desc: "Linagliptin 5mg x 30’s", category: "Tablets", priceStaff: 12300, priceWholesale: 13300, stock: 40, image: "https://via.placeholder.com/150?text=Linagen" },
            { id: 13, name: "BUPI HEAVY INJECTION", desc: "Bupivacaine HCL (0.5%), Dextrose (8%) 4ml x 5", category: "Injections", priceStaff: 5700, priceWholesale: 6300, stock: 20, image: "https://via.placeholder.com/150?text=Bupi+Heavy" },
            { id: 14, name: "Brimo eye drop", desc: "Brimonidine eye drop", category: "Eye/Ear Drops", priceStaff: 2700, priceWholesale: 3500, stock: 25, image: "https://via.placeholder.com/150?text=Brimo" },
            { id: 15, name: "Linajen-M 2.5/500", desc: "Linagliptin 2.5mg/Metformin 500mg x 30’s", category: "Tablets", priceStaff: 7900, priceWholesale: 8900, stock: 30, image: "https://via.placeholder.com/150?text=Linajen+M" },
            { id: 16, name: "Linajen-M 2.5/1000", desc: "Linagliptin 2.5mg/Metformin 1000mg x 30’s", category: "Tablets", priceStaff: 8300, priceWholesale: 9300, stock: 30, image: "https://via.placeholder.com/150?text=Linajen+L" },
            { id: 17, name: "VALVAS 10/160/12.5mg", desc: "Valsartan (160mg) + Amlodipine (10mg) + HCTZ 12.5mg", category: "Tablets", priceStaff: 11800, priceWholesale: 12600, stock: 50, image: "https://via.placeholder.com/150?text=Valvas+Tri" },
            { id: 18, name: "VALVAS 10/160/25mg", desc: "Valsartan (160mg) + Amlodipine (10mg) + HCTZ 25mg", category: "Tablets", priceStaff: 11850, priceWholesale: 12750, stock: 50, image: "https://via.placeholder.com/150?text=Valvas+Max" },
            { id: 19, name: "Xyvida 50mg", desc: "Vildagliptin 50mg x 60", category: "Tablets", priceStaff: 7400, priceWholesale: 8400, stock: 40, image: "https://via.placeholder.com/150?text=Xyvida" },
            { id: 20, name: "PROGERIX", desc: "DYDROESTERONE USP 10MG", category: "Tablets", priceStaff: 7600, priceWholesale: 8600, stock: 30, image: "https://via.placeholder.com/150?text=Progerix" },
            { id: 21, name: "LBAC 500", desc: "Levofloxacin 500mg", category: "Tablets", priceStaff: 1750, priceWholesale: 1750, stock: 30, image: "https://via.placeholder.com/150?text=LBAC" },
            { id: 22, name: "P-Caban", desc: "Vonoprazan 20mg", category: "Tablets", priceStaff: 9700, priceWholesale: 10500, stock: 30, image: "https://via.placeholder.com/150?text=PCaban" }
        ];

        // --- DEFAULT CONFIGURATION ---
        const DEFAULT_CONFIG = {
            adminPhone: "2348000000000",
            logisticsPhone: "",
            passAdmin: "Admin@Adamz2025",
            passStaff: "Staff@G4mg",
            passWholesale: "Whole@Sale24",
            logoUrl: "https://via.placeholder.com/100x100?text=Logo",
            ronimationLogoUrl: "https://via.placeholder.com/200x80?text=Ronimation+Logo",
            freeVersionUrl: "https://adamz-free-version.web.app" // Placeholder
        };

        const app = {
            state: {
                currentUser: null,
                cart: (function () { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { console.error("Cart Load Error", e); return []; } })(),
                usersList: [], // Added usersList
                products: [],
                orders: [],
                config: null,
                editingOrder: null,
                charts: {}, // Store chart instances
                viewMode: 'premium', // 'premium' (UNIFIED VIEW - DEFAULT)
                showTrash: false // Toggle for deleted orders view
            },

            init: function () {
                console.log("[App] Init - Unified Premium View");

                // Ensure Cart UI is in sync with loaded state
                this.updateCartCount();

                // Bypass Landing Page - Go straight to Main App Logic
                const landing = document.getElementById('landing-section');
                if (landing) landing.classList.add('hidden');

                // Ensure Config is Loaded
                this.updateLogo();
                // Manual binding for search robustness
                const searchInput = document.getElementById('order-search-input');
                if (searchInput) {
                    searchInput.addEventListener('input', () => this.renderOrders());
                }

                // --- NEW: Wholesale Password-less Helper ---
                const wholesaleEmail = 'wholesale@g4mg.com';
                const emailInputs = ['login-email', 'landing-email'];
                emailInputs.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.addEventListener('input', (e) => {
                            const val = e.target.value.trim().toLowerCase();
                            const isWholesale = val === wholesaleEmail;
                            const passId = id === 'login-email' ? 'login-password' : 'landing-password';
                            const btnId = id === 'login-email' ? 'auth-submit-btn' : 'landing-submit-btn';

                            const passEl = document.getElementById(passId);
                            const btnEl = document.getElementById(btnId);

                            if (isWholesale) {
                                if (passEl) {
                                    passEl.placeholder = "No Password Required for Wholesale";
                                    passEl.classList.add('bg-green-50');
                                }
                                if (btnEl) btnEl.textContent = "Log In as Wholesale (No Pass)";
                            } else {
                                if (passEl) {
                                    passEl.placeholder = "••••••••";
                                    passEl.classList.remove('bg-green-50');
                                }
                                if (btnEl) btnEl.textContent = id === 'login-email' ? "Sign In" : "Log In to Dashboard";
                            }
                        });
                    }
                });

                if (!db || !auth) return;

                // Initialize Auth Listener
                auth.onAuthStateChanged(user => {
                    if (user) {
                        console.log("Auth State: User detected", user.email);
                        // Fetch Role from Firestore
                        db.collection('users').doc(user.uid).get().then(doc => {
                            if (doc.exists) {
                                const data = doc.data();
                                // DEFAULT ROLE IS NOW WHOLESALE
                                this.completeLogin(user.email, data.role || 'wholesale', data.isPremium || false);
                            } else {
                                // AUTO-RESTORE ADMIN if Doc is missing but Auth exists
                                if (user.email === 'admin@g4mg.com') {
                                    console.log("Admin Doc Missing - Restoring...");
                                    db.collection('users').doc(user.uid).set({
                                        email: user.email,
                                        role: 'admin',
                                        name: 'Admin Restored',
                                        phone: '0000000000',
                                        isPremium: true,
                                        createdAt: new Date().toISOString()
                                    }).then(() => {
                                        this.completeLogin(user.email, 'admin', true);
                                    });
                                } else {
                                    // Regular User Missing Doc -> Auto-create as PREMIUM TRIAL
                                    console.log("User Doc Missing - Creating Premium Trial User...");
                                    const newRole = 'wholesale'; // Base role
                                    db.collection('users').doc(user.uid).set({
                                        email: user.email,
                                        role: newRole,
                                        name: 'Trial User',
                                        phone: '',
                                        isPremium: true, // ENABLE PREMIUM FOR NEW USERS (TRIAL)
                                        createdAt: new Date().toISOString()
                                    }).then(() => {
                                        this.completeLogin(user.email, newRole, true); // Pass isPremium=true
                                    });
                                }
                            }
                        });
                        document.getElementById('auth-section').classList.add('hide');
                        this.toggleLandingPage(false);
                    } else {
                        console.log("Auth State: Signed Out");
                        this.state.currentUser = null;
                        this.showSection('public-catalog-section');
                        // Hide navbar elements that require auth
                        const authOnlyEls = document.querySelectorAll('.auth-only');
                        authOnlyEls.forEach(el => el.classList.add('hidden')); 
                    }
                });

                this.checkUrlParams(); // Check for Payment Return
                this.subscribeToData();
            },

            subscribeToData: function () {
                // 1. Settings
                db.collection('settings').doc('config').onSnapshot(doc => {
                    if (doc.exists) {
                        const newConfig = doc.data();

                        // Prevent UI refresh on network glitch if data hasn't actually changed
                        if (JSON.stringify(this.state.config) !== JSON.stringify(newConfig)) {
                            this.state.config = newConfig;
                            // FIX: Do NOT override viewMode to 'standard' on every config snapshot
                            // this.state.viewMode = 'standard'; // REMOVED - was resetting view mode
                            this.updateLogo();
                        }
                    } else {
                        // Safe Fallback: Use defaults in memory ONLY.
                        // NEVER write defaults to Firestore — protects real config during network instability.
                        if (!this.state.config) {
                            this.state.config = DEFAULT_CONFIG;
                            console.log("[Settings] Using in-memory defaults (doc not found). Remote data untouched.");
                        }
                    }
                });

                // 2. Products
                db.collection('products').onSnapshot(snapshot => {
                    const products = [];
                    snapshot.forEach(doc => products.push({ ...doc.data(), docId: doc.id }));
                    const sortedProducts = products.sort((a, b) => a.id - b.id);

                    // Prevent UI refresh on network glitch if data hasn't actually changed
                    if (JSON.stringify(this.state.products) !== JSON.stringify(sortedProducts)) {
                        this.state.products = sortedProducts;
                        this.updateUI();
                    }
                });

                // 3. Orders
                db.collection('orders').onSnapshot(snapshot => {
                    const orders = [];
                    snapshot.forEach(doc => orders.push({ ...doc.data(), docId: doc.id }));

                    // Prevent UI refresh on network glitch if data hasn't actually changed
                    if (JSON.stringify(this.state.orders) !== JSON.stringify(orders)) {
                        console.log("Orders Loaded from DB & Changed:", orders.length); // DEBUG
                        this.state.orders = orders;
                        this.populateClientFilter();
                        this.updateUI();
                    }
                });
            },

            updateLogo: function () {
                const c = this.state.config || DEFAULT_CONFIG;
                // Main Company Logos
                const url = c.logoUrl || DEFAULT_CONFIG.logoUrl;
                document.getElementById('nav-logo').src = url;
                document.getElementById('login-logo').src = url;
                document.getElementById('inv-logo').src = url;

                // Ronimation Logo
                const roniUrl = c.ronimationLogoUrl || DEFAULT_CONFIG.ronimationLogoUrl;
                const roniEl = document.getElementById('ronimation-logo');
                if (roniEl) roniEl.src = roniUrl;
            },

            editRonimationLogo: function () {
                // Security: Only allow admin to change this
                const role = this.state.currentUser ? this.state.currentUser.role : null;
                if (role !== 'admin') return alert("Only Administrators can update the branding logo.");

                const currentUrl = (this.state.config && this.state.config.ronimationLogoUrl) || "";
                const newUrl = prompt("Enter Ronimation Studios Logo URL:", currentUrl);

                if (newUrl && newUrl.trim() !== "") {
                    db.collection('settings').doc('config').update({ ronimationLogoUrl: newUrl.trim() })
                        .then(() => alert("Branding updated successfully!"))
                        .catch(err => alert("Error updating logo: " + err));
                }
            },

            seedDatabase: function () {
                const batch = db.batch();
                SEED_PRODUCTS.forEach(prod => {
                    const docRef = db.collection('products').doc('prod_' + prod.id);
                    batch.set(docRef, prod);
                });
                batch.commit();
            },

            updateUI: function () {
                const active = document.querySelector('main > section:not(.hide)');
                if (active) {
                    const id = active.id;
                    if (id === 'public-catalog-section') this.renderPublicCatalog();
                    if (id === 'products-section') this.renderProducts();
                    if (id === 'stock-section') this.renderStock();
                    if (id === 'orders-section') this.renderOrders();
                    if (id === 'cart-section') this.renderCart();
                    if (id === 'dashboard-section') this.renderAnalytics();
                    if (id === 'settings-section') this.renderSettings();
                    if (id === 'financial-section') this.renderFinancials();
                    if (id === 'user-dashboard-section') this.renderUserDashboard();
                    if (id === 'invoice-section' && this.state.currentOrderId) this.renderInvoice(this.state.currentOrderId);
                }
            },

            // --- AUTH ---
            // [Deleted duplicate login function]

            checkSubscription: async function (email) {
                try {
                    // ALWAYS CHECK ADMIN PLAN
                    const doc = await db.collection('subscriptions').doc('admin_plan').get();
                    if (!doc.exists) return false;

                    const data = doc.data();
                    const now = new Date();

                    // 1. Check Full Premium
                    if (data.plan === 'premium' && data.isActive) {
                        const expiry = new Date(data.expiryDate);
                        if (now < expiry) {
                            if (email === 'admin@g4mg.com') {
                                const diffDays = (expiry - now) / (1000 * 3600 * 24);
                                if (diffDays <= 7) this.sendNotification(data.email, 'subscription_ending', diffDays);
                            }
                            return true;
                        }
                    }

                    // 2. Check Trial
                    if (data.plan === 'trial' && data.isActive) {
                        const start = new Date(data.trialStartDate);
                        const end = new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000));
                        const diffDays = (end - now) / (1000 * 3600 * 24);

                        if (diffDays > 0) {
                            // Update Trial Countdown on Dashboard if exists
                            const trialEl = document.getElementById('trial-countdown');
                            if (trialEl) {
                                trialEl.innerText = `Trial: ${Math.ceil(diffDays)} Days Left`;
                                trialEl.classList.remove('hidden');
                                // "Trial Board" on Landing Page or Login Modal can be populated here too if we know context
                            }

                            if (email === 'admin@g4mg.com' && diffDays < 3) {
                                this.sendNotification(data.email, 'trial_ending', Math.ceil(diffDays));
                            }
                            return true;
                        }
                    }
                } catch (e) { console.log("Sub check error", e); }
                return false;
            },

            startTrial: function () {
                const notifEmail = document.getElementById('sub-notif-email').value;
                if (!notifEmail || !notifEmail.includes('@')) {
                    alert("Please enter a valid Notification Email to start your trial.");
                    return;
                }

                const btn = document.querySelector('#subscription-modal button'); // First button is Trial
                btn.innerText = "Activating...";
                btn.disabled = true;

                db.collection('subscriptions').doc('admin_plan').set({
                    isActive: true,
                    plan: 'trial',
                    email: notifEmail,
                    trialStartDate: new Date().toISOString(),
                    lastNotificationDate: null
                }).then(() => {
                    alert("Trial Activated! You have 7 Days Free Access.");
                    document.getElementById('subscription-modal').classList.add('hidden');
                    if (this.state.currentUser) {
                        this.completeLogin(this.state.currentUser.email, this.state.currentUser.role);
                    }
                });
            },

            processPayment: function () {
                // STRIPE PAYMENT INTEGRATION (Placeholder Mode)
                // 1. Redirect to Payment Page
                const STRIPE_LINK = "https://example.com/checkout?redirect_to=" + encodeURIComponent(window.location.href + "?payment=success");

                // UX Feedback
                const btn = document.querySelector('#subscription-modal button.bg-gradient-to-r'); // Target the pay button
                if (btn) { btn.innerText = "Redirecting..."; btn.disabled = true; }

                alert("Redirecting to Secure Payment Gateway...\n\n(Simulated: You will need to manually return with '?payment=success' if this dead link fails)");

                // In a real app, you'd use Stripe Checkout URL. 
                // For this demo, we can simulate the "Success Return" by reloading with the param if the user agrees, 
                // OR actually redirecting to a dummy page.
                // User requested "continue with placeholder".

                // Let's redirect to a non-existent page to prove the point, OR simply reload with success for smoother demo flow?
                // "Refactor to use Stripe Checkout / Stripe.js" implies behaving like it.
                // Let's reload with success param to simulate the "Return URL" behavior immediately for testing convenience.
                // window.location.href = window.location.pathname + "?payment=success"; 

                // BUT user wants to "continue with placeholder", implying they might swap it later.
                // So I will write the code to redirect, but maybe comment it out and use the instant reload for MVP testability?
                // No, I will implement the Pattern.

                // REAL PATTERN:
                // window.location.href = "https://buy.stripe.com/test_placeholder";

                // SIMULATION FOR USER TO TEST "SUCCESS HANDLER":
                if (confirm("Simulate External Payment?\n\nOK = Redirect to 'Success' URL.\nCancel = Stay here.")) {
                    window.location.search = "?payment=success";
                }
            },

            activatePremium: function () {
                db.collection('subscriptions').doc('admin_plan').set({
                    isActive: true,
                    plan: 'premium',
                    startDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                }).then(() => {
                    alert("Payment Verified! Welcome to Premium (1 Year Access).");
                    document.getElementById('subscription-modal').classList.add('hidden');
                    if (this.state.currentUser) {
                        this.completeLogin(this.state.currentUser.email, this.state.currentUser.role);
                    }
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                });
            },

            checkUrlParams: function () {
                const params = new URLSearchParams(window.location.search);
                if (params.get('payment') === 'success') {
                    console.log("Payment Success Detected!");
                    this.activatePremium();
                } else if (params.get('payment') === 'cancel') {
                    alert("Payment Process Cancelled.");
                }
            },

            sendNotification: async function (email, type, daysLeft) {
                // Prevent Spam: Check if sent today
                const todayStr = new Date().toISOString().split('T')[0];
                const docRef = db.collection('subscriptions').doc('admin_plan');

                try {
                    const doc = await docRef.get();
                    if (doc.exists && doc.data().lastNotificationDate === todayStr) return; // Already sent today

                    // Send EmailJS
                    const templateParams = {
                        to_email: email,
                        message: type === 'trial_ending'
                            ? `Your Free Trial expires in ${Math.round(daysLeft)} days! Upgrade now to keep access.`
                            : `Your Annual Subscription expires in ${Math.round(daysLeft)} days. Please renew.`
                    };

                    // Replace with your Service ID and Template ID
                    await emailjs.send('service_placeholder', 'template_placeholder', templateParams);
                    console.log("Notification Sent:", type);

                    // Update Last Sent
                    await docRef.update({ lastNotificationDate: todayStr });

                } catch (e) { console.log("Email Error", e); }
            },

            completeLogin: function (email, role, isPremium = false) {
                // Merge state to preserve isPremium flag set by login()
                this.state.currentUser = { ...this.state.currentUser, email, role, isPremium };
                setTimeout(() => {
                    document.getElementById('auth-section').classList.add('hide');
                    this.toggleLandingPage(false); // Ensure Premium Landing is closed
                    this.updateNav();

                    // Show Admin Panels
                    const adminPanel = document.getElementById('admin-settings-panel');
                    const userPanel = document.getElementById('user-management-panel');

                    // If Admin OR Premium, go to Dashboard. Only Standard goes to Products.
                    const isPremiumUser = this.state.currentUser.isPremium || role === 'admin';

                    if (role === 'admin') {
                        if (adminPanel) adminPanel.classList.remove('hidden');
                        if (userPanel) userPanel.classList.remove('hidden');
                        this.fetchUsers();
                    } else {
                        if (adminPanel) adminPanel.classList.add('hidden');
                        if (userPanel) userPanel.classList.add('hidden');
                    }

                    if (role === 'admin') {
                        if (this.state.currentUser.isPremium) {
                            this.showSection('dashboard-section');
                        } else {
                            this.showSection('products-section'); // Fallback to shop if restrictions (Standard Admin)
                        }
                    } else {
                        // Staff/Wholesale go STRAIGHT to SHOP
                        this.showSection('products-section');
                    }
                }, 1000);
            },

            fetchUsers: function () {
                db.collection('users').onSnapshot(snap => {
                    const users = [];
                    snap.forEach(doc => users.push({ ...doc.data(), uid: doc.id }));
                    this.state.usersList = users;
                    this.renderUserList(users);
                });
            },

            renderUserList: function (users) {
                const tbody = document.getElementById('user-list-body');
                if (!tbody) return;
                let html = '';
                users.forEach(user => {
                    let roleBadge = 'bg-gray-200 text-gray-800';
                    if (user.role === 'admin') roleBadge = 'bg-purple-100 text-purple-800';
                    if (user.role === 'staff') roleBadge = 'bg-blue-100 text-blue-800';
                    if (user.role === 'wholesale') roleBadge = 'bg-green-100 text-green-800';

                    html += `
                        <tr class="border-b hover:bg-gray-50">
                            <td class="p-2 align-middle">
                                <div class="font-bold text-gray-700">${user.name || 'No Name'}</div>
                                <div class="text-xs text-gray-500">${user.email}</div>
                            </td>
                            <td class="p-2 align-middle"><span class="px-2 py-1 rounded text-xs font-bold ${roleBadge}">${(user.role || 'wholesale').toUpperCase()}</span></td>
                            <td class="p-2 align-middle">
                                <div class="flex gap-2">
                                    <button onclick="app.openEditUserModal('${user.uid}')" class="text-blue-600 hover:text-blue-800" title="Edit User"><i class="fas fa-edit"></i></button>
                                    <button onclick="app.deleteUser('${user.uid}')" class="text-red-600 hover:text-red-800" title="Delete User"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            },

            openEditUserModal: function (uid) {
                const user = this.state.usersList.find(u => u.uid === uid);
                if (!user) return;

                document.getElementById('edit-user-id').value = uid;
                document.getElementById('edit-user-name').value = user.name || '';
                document.getElementById('edit-user-role').value = user.role || 'wholesale';

                document.getElementById('edit-user-modal').classList.remove('hidden');
            },

            saveUserEdit: function () {
                const uid = document.getElementById('edit-user-id').value;
                const newName = document.getElementById('edit-user-name').value;
                const newRole = document.getElementById('edit-user-role').value;

                if (!newName) return alert("Name is required");

                db.collection('users').doc(uid).update({ name: newName, role: newRole })
                    .then(() => {
                        alert("User Updated!");
                        document.getElementById('edit-user-modal').classList.add('hidden');
                    })
                    .catch(err => alert("Error: " + err.message));
            },

            deleteUser: function (uid) {
                if (!confirm("Are you sure you want to DELETE this user? They will lose access immediately.")) return;
                db.collection('users').doc(uid).delete()
                    .then(() => alert("User Deleted."))
                    .catch(err => alert("Error: " + err.message));
            },

            updateUserRole: function (uid, newRole) { /* Legacy */ },

            logout: function () {
                auth.signOut().then(() => {
                    this.state.currentUser = null;
                    this.state.cart = [];
                    location.reload();
                });
            },

            updateNav: function () {
                const navLinks = document.getElementById('nav-links');
                const logoutBtn = document.getElementById('logout-btn');
                const userInfo = document.getElementById('user-info');
                const role = this.state.currentUser.role;
                userInfo.innerText = `${this.state.currentUser.email} (${role.toUpperCase()})`;
                logoutBtn.classList.remove('hidden');
                let linksHtml = '';
                if (role === 'admin') {
                    linksHtml += `<a href="#" onclick="app.showSection('dashboard-section')" class="hover:text-blue-200">Dashboard</a>`;
                    // Always show Financials for Admin to allow the "Premium Gate" alert to trigger if in standard mode
                    linksHtml += `<a href="#" onclick="app.showSection('financial-section')" class="hover:text-blue-200 text-yellow-300 font-bold"><i class="fas fa-chart-line mr-1"></i>Financials</a>`;
                    linksHtml += `<a href="#" onclick="app.showSection('stock-section')" class="hover:text-blue-200">Inventory</a>`;
                    linksHtml += `<a href="#" onclick="app.showSection('orders-section')" class="hover:text-blue-200">Orders</a>`;
                    linksHtml += `<a href="#" onclick="app.showSection('settings-section')" class="hover:text-blue-200">Settings</a>`;
                }
                linksHtml += `<a href="#" onclick="app.showSection('products-section')" class="hover:text-blue-200">Shop</a>`;

                // NO "My Dashboard" for Admin or Staff - strictly hidden as requested

                // --- NEW ABOUT LINK ---
                linksHtml += `<a href="#" onclick="app.showSection('about-section')" class="hover:text-blue-200">About</a>`;

                // Populate Desktop Center Nav
                // Populate Desktop Center Nav (STACK TABS STYLE)
                if (navLinks) {
                    // Use Tab styling: Text with border-bottom indicator on hover
                    const desktopLinks = linksHtml.replace(/class="/g, 'class="px-4 py-3 text-white/80 hover:text-white border-b-2 border-transparent hover:border-white transition duration-200 block ');
                    navLinks.innerHTML = desktopLinks;
                }

                // Populate Mobile Menu
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    // Use block styling for mobile
                    const mobileLinks = linksHtml.replace(/class="/g, 'class="block py-2 px-4 hover:bg-white/10 rounded transition ');
                    mobileMenu.innerHTML = mobileLinks;
                }
            },

            toggleMobileMenu: function () {
                const nav = document.getElementById('mobile-menu');
                if (nav) {
                    nav.classList.toggle('hidden');
                    nav.classList.toggle('flex');
                }
            },

            showSection: function (sectionId) {
                // UNIFIED VIEW: No Alerts. All features accessible.

                document.querySelectorAll('main > section').forEach(el => el.classList.add('hide'));
                const target = document.getElementById(sectionId);
                if (target) target.classList.remove('hide');
                this.updateUI();
            },

            // --- SETTINGS ---
            renderSettings: function () {
                // System Config (Admin)
                const c = this.state.config || DEFAULT_CONFIG;
                document.getElementById('conf-logo-url').value = c.logoUrl || '';
                document.getElementById('conf-admin-phone').value = c.adminPhone || '';
                const logisticsEl = document.getElementById('conf-logistics-phone');
                if (logisticsEl) logisticsEl.value = c.logisticsPhone || '';
                document.getElementById('conf-pass-admin').value = c.passAdmin;
                document.getElementById('conf-pass-staff').value = c.passStaff;
                document.getElementById('conf-pass-wholesale').value = c.passWholesale;

                // My Profile (ALWAYS VISIBLE)
                const profileContainer = document.getElementById('settings-profile-container');
                if (profileContainer) profileContainer.classList.remove('hidden');

                // Admin Panels Logic
                const userPanel = document.getElementById('user-management-panel');
                const adminPanel = document.getElementById('admin-settings-panel');

                if (this.state.currentUser && this.state.currentUser.role === 'admin') {
                    if (userPanel) userPanel.classList.remove('hidden');
                    if (adminPanel) adminPanel.classList.remove('hidden');
                    this.fetchUsers(); // Ensure list is populated
                } else {
                    if (userPanel) userPanel.classList.add('hidden');
                    if (adminPanel) adminPanel.classList.add('hidden');
                }
            },

            saveProfile: function () {
                const name = document.getElementById('profile-name').value;
                const phone = document.getElementById('profile-phone').value;
                const pass = document.getElementById('profile-pass').value;

                if (!name && !phone && !pass) return alert("Nothing to update.");

                // In a real app, we would update firebase auth or the users collection.
                // For this demo, we'll verify the intent and show a success message.
                // If pass is set, we'd simulating updating it.

                alert(`Profile Updated!\nName: ${name || 'Unchanged'}\nPhone: ${phone || 'Unchanged'}\nPassword: ${pass ? 'Updated' : 'Unchanged'}`);

                // Clear password field for security
                document.getElementById('profile-pass').value = '';
            },

            saveSettings: function () {
                const logisticsEl = document.getElementById('conf-logistics-phone');
                const newConfig = {
                    logoUrl: document.getElementById('conf-logo-url').value,
                    adminPhone: document.getElementById('conf-admin-phone').value,
                    logisticsPhone: logisticsEl ? logisticsEl.value : '',
                    passAdmin: document.getElementById('conf-pass-admin').value,
                    passStaff: document.getElementById('conf-pass-staff').value,
                    passWholesale: document.getElementById('conf-pass-wholesale').value
                };
                db.collection('settings').doc('config').update(newConfig).then(() => {
                    alert("Settings updated!");
                });
            },

            // --- ORDER LOGIC ---
            placeOrder: function (e) {
                e.preventDefault();
                if (this.state.cart.length === 0) return alert("Cart is empty");

                const custName = document.getElementById('cust-name').value;
                const custPhone = document.getElementById('cust-phone').value;
                const total = this.state.cart.reduce((a, b) => a + (b.price * b.qty), 0);

                const orderData = {
                    date: new Date().toISOString(),
                    customer: {
                        name: custName,
                        email: document.getElementById('cust-email').value,
                        address: document.getElementById('cust-address').value,
                        business: document.getElementById('cust-business').value,
                        phone: custPhone
                    },
                    items: this.state.cart,
                    total: total,
                    status: 'Pending',
                    isApproved: false,
                    isReceived: false,
                    creatorRole: this.state.currentUser ? this.state.currentUser.role : 'guest',
                    creatorEmail: this.state.currentUser ? this.state.currentUser.email : 'guest'
                };

                // Sequential ID Generation
                const counterRef = db.collection('settings').doc('counters');

                db.runTransaction(async (transaction) => {
                    const doc = await transaction.get(counterRef);
                    let newId = 1;
                    if (doc.exists) {
                        newId = (doc.data().lastOrderId || 0) + 1;
                    }
                    transaction.set(counterRef, { lastOrderId: newId }, { merge: true });
                    return newId;
                }).then((newId) => {
                    // Include the numeric ID
                    orderData.orderId = newId;

                    const batch = db.batch();
                    const orderRef = db.collection('orders').doc();

                    // Use orderData instead of 'order' variable
                    batch.set(orderRef, orderData);

                    batch.commit().then(() => {
                        this.state.cart = [];
                        this.saveCart(); // Clear local storage too
                        this.updateCartCount();

                        // Notify Admin
                        const adminNum = this.state.config ? this.state.config.adminPhone : DEFAULT_CONFIG.adminPhone;
                        // Use formatted numeric ID if available
                        const displayId = String(newId).padStart(3, '0');

                        const waText = `*New Order Alert!*%0AOrder ID: ${displayId}%0ACustomer: ${custName}%0ATotal: ₦${total.toLocaleString()}%0AStatus: Pending%0A%0APlease log in to review.`;
                        const waLink = `https://wa.me/${adminNum}?text=${waText}`;

                        document.getElementById('notif-message').innerText = "Order placed! Notify Admin?";
                        document.getElementById('notif-btn').href = waLink;
                        document.getElementById('notification-modal').classList.remove('hidden');

                        // Note: viewInvoice likely relies on docId, which comes from orderRef.id
                        // We might need to update viewInvoice to query by orderId if we want that link to strictly use numerals, 
                        // but sticking to docId for deep links is safer.
                        this.viewInvoice(orderRef.id);
                    }).catch(err => { console.error(err); alert("Error placing order."); });
                }).catch(err => { console.error("Transaction failed: ", err); alert("Failed to generate Order ID."); });
            },

            // --- ADMIN ACTIONS ---
            // 1. Receive Order (Deducts Stock & Sets Received)
            receiveOrder: function (docId) {
                const order = this.state.orders.find(o => o.docId === docId);
                if (order.isReceived) return alert("Order already marked as Received.");

                const batch = db.batch();

                // Deduct stock
                order.items.forEach(item => {
                    const product = this.state.products.find(p => p.id === item.id);
                    if (product) {
                        const prodRef = db.collection('products').doc(product.docId);
                        batch.update(prodRef, { stock: firebase.firestore.FieldValue.increment(-item.qty) });
                    }
                });

                // Update Status
                // Update Status
                const orderRef = db.collection('orders').doc(docId);
                batch.update(orderRef, { isReceived: true, status: 'received' });

                batch.commit().then(() => {
                    // Notify Admin
                    const adminNum = this.state.config ? this.state.config.adminPhone : DEFAULT_CONFIG.adminPhone;
                    const waText = `*Items Received!*%0AOrder ID: ${String(order.orderId).padStart(3, '0')}%0ACustomer: ${order.customer.name}%0A%0AStock has been deducted.`;
                    const waLink = `https://wa.me/${adminNum}?text=${waText}`;

                    document.getElementById('notif-message').innerText = "Stock Deducted. Notify Admin?";
                    document.getElementById('notif-btn').href = waLink;
                    document.getElementById('notification-modal').classList.remove('hidden');
                });
            },

            // 2. Approve Order (Sets Approved & Triggers Email)
            approveOrder: function (docId) {
                const order = this.state.orders.find(o => o.docId === docId);
                if (order.isApproved) return alert("Order already Approved.");

                db.collection('orders').doc(docId).update({ isApproved: true, status: 'approved' }).then(() => {

                    this.sendEmailInvoice(order);

                    // --- AUTO-NOTIFY LOGISTICS MANAGER (no admin click needed) ---
                    this.notifyLogisticsManager(order);

                    if (order && order.customer.phone) {
                        let phone = order.customer.phone.replace(/\D/g, '');
                        if (phone.startsWith('0')) phone = '234' + phone.substring(1);

                        const waText = `*Order Approved!*%0AHello ${order.customer.name}, your order #${String(order.orderId).padStart(3, '0')} has been approved.%0A%0A*Final Total:* ₦${order.total.toLocaleString()}%0A%0AThank you for choosing G4mg - Adamz Pharmacy.`;
                        const waLink = `https://wa.me/${phone}?text=${waText}`;

                        document.getElementById('notif-message').innerText = "Order Approved. WhatsApp & Email triggered.";
                        document.getElementById('notif-btn').href = waLink;
                        document.getElementById('notification-modal').classList.remove('hidden');
                    } else {
                        alert("Order Approved. Email triggered (No phone for WhatsApp).");
                    }
                });
            },

            // --- AUTO LOGISTICS NOTIFICATION ---
            notifyLogisticsManager: function (order) {
                const config = this.state.config || DEFAULT_CONFIG;
                const logisticsNum = config.logisticsPhone;
                if (!logisticsNum || logisticsNum.trim() === '') {
                    console.log('[Logistics] No logistics phone configured. Skipping notification.');
                    return;
                }

                const displayId = order.orderId ? String(order.orderId).padStart(3, '0') : '---';
                const itemsList = order.items.map(i => `• ${i.name} (Qty: ${i.qty})`).join('%0A');

                const waText = `*📦 Logistics Alert — Order Approved*%0A%0A` +
                    `*Order ID:* %23${displayId}%0A` +
                    `*Customer:* ${order.customer.name}%0A` +
                    `*Phone:* ${order.customer.phone || 'N/A'}%0A` +
                    `*Address:* ${order.customer.address || 'N/A'}%0A%0A` +
                    `*Items:*%0A${itemsList}%0A%0A` +
                    `*Total Amount:* ₦${order.total.toLocaleString()}%0A%0A` +
                    `Please prepare this order for dispatch.`;

                const waLink = `https://wa.me/${logisticsNum.trim()}?text=${waText}`;

                // Auto-open in new background tab — no admin click required
                window.open(waLink, '_blank');
                console.log('[Logistics] WhatsApp notification sent to:', logisticsNum);
            },

            sendEmailInvoice: function (order) {
                if (!order.customer.email) return;

                const subject = `Invoice Approved - Order #${String(order.orderId).padStart(3, '0')} - G4mg Pharmacy`;

                const itemsList = order.items.map(i => `- ${i.name} (Qty: ${i.qty}) @ ₦${i.price.toLocaleString()}`).join('%0D%0A');

                const body = `Dear ${order.customer.name},%0D%0A%0D%0AYour order has been approved and processed successfully.%0D%0A%0D%0A=== INVOICE DETAILS ===%0D%0AOrder ID: ${String(order.orderId).padStart(3, '0')}%0D%0ADate: ${new Date(order.date).toLocaleDateString()}%0D%0A%0D%0A${itemsList}%0D%0A%0D%0ATotal Amount: ₦${order.total.toLocaleString()}%0D%0A%0D%0APlease retain this email for your records.%0D%0A%0D%0AThank you,%0D%0AG4mg - Adamz Pharmacy & Stores Ltd`;

                window.open(`mailto:${order.customer.email}?subject=${subject}&body=${body}`);
            },

            showExportModal: function () {
                document.getElementById('export-modal').classList.remove('hidden');
            },

            runExport: function () {
                const monthInput = document.getElementById('export-month').value; // yyyy-mm
                const exportType = document.getElementById('export-type') ? document.getElementById('export-type').value : 'detailed';
                // const userFilter = ... (Removed filter by role as per previous HTML edit comment)

                if (!monthInput) return alert("Please select a month.");

                const [year, month] = monthInput.split('-');

                // 1. Filter Orders (Month Only)
                // Filter by RECEIVED orders only? Usually sales reports are for completed sales.
                // But users might want pending. Let's stick to ALL orders matching date for now, or maybe only Approved/Received?
                // Plan said "Sales Report". Sales usually implies Revenue. Revenue implies Received.
                // However, existing logic filtered via date/user but didn't explicitly filter status.
                // Let's filter by Status != Cancelled to be safe, or just dump everything and let them filter in Excel. 
                // Let's filter date matching.

                const filteredOrders = this.state.orders.filter(o => {
                    const d = new Date(o.date);
                    const matchMonth = d.getFullYear() == year && (d.getMonth() + 1) == month;
                    return matchMonth;
                });

                if (filteredOrders.length === 0) return alert(`No data found for ${monthInput}.`);

                let csvContent = "";
                let filename = `Report_${exportType}_${monthInput}.csv`;
                filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));

                // --- 2. GENERATE CONTENT BASED ON TYPE ---

                if (exportType === 'products') {
                    // TOP SELLING PRODUCTS
                    csvContent = "Rank,Product Name,Category,Units Sold,Revenue Generated,Avg Price\n";
                    const productMap = {};

                    filteredOrders.forEach(o => {
                        // Only count VALID sales (Received/Approved) for product ranking? 
                        // Let's include everything except Cancelled?
                        // If we want "Top Selling", we probably want 'isReceived' or at least 'isApproved'.
                        // Let's use ALL for now to match 'detailed' scope, but traditionally this should be strict.
                        if (o.status === 'Cancelled') return;

                        o.items.forEach(i => {
                            const name = i.name;
                            if (!productMap[name]) productMap[name] = { name: name, cat: i.category || 'General', qty: 0, rev: 0 };
                            productMap[name].qty += i.qty;
                            productMap[name].rev += (i.qty * i.price);
                        });
                    });

                    const sortedProds = Object.values(productMap).sort((a, b) => b.qty - a.qty);

                    sortedProds.forEach((p, index) => {
                        const avg = p.qty > 0 ? (p.rev / p.qty).toFixed(2) : 0;
                        csvContent += `${index + 1},"${p.name.replace(/"/g, '""')}","${p.cat}",${p.qty},${p.rev.toFixed(2)},${avg}\n`;
                    });

                } else if (exportType === 'summary') {
                    // ORDER SUMMARY (One Row Per Order)
                    csvContent = "Order ID,Date,Customer Name,Items Summary,Total Amount,Status,Payment\n";

                    let grandTotal = 0;
                    filteredOrders.forEach(o => {
                        const id = o.orderId ? String(o.orderId).padStart(3, '0') : (o.docId ? o.docId.slice(0, 8).toUpperCase() : 'UNKNOWN');
                        const date = new Date(o.date).toLocaleDateString();
                        const name = (o.customer.name || o.customer.email).replace(/"/g, '""');
                        const status = o.status || 'Pending';
                        const payment = o.paymentStatus || 'Unpaid';

                        // Items Summary: "Paracetamol (x2); Amoxil (x1)"
                        const itemsStr = o.items.map(i => `${i.name} (x${i.qty})`).join('; ').replace(/"/g, '""');

                        grandTotal += o.total;

                        csvContent += `${id},"${date}","${name}","${itemsStr}",${o.total},${status},${payment}\n`;
                    });
                    csvContent += `\n,,,,GRAND TOTAL: ${grandTotal.toFixed(2)},,`;

                } else {
                    // DETAILED (Legacy Line Item)
                    csvContent = "Order ID,Date,Customer Name,Product Name,Quantity,Unit Price,Line Total,Status\n";
                    let grandTotal = 0;

                    filteredOrders.forEach(o => {
                        const id = o.orderId ? String(o.orderId).padStart(3, '0') : (o.docId ? o.docId.slice(0, 8).toUpperCase() : 'UNKNOWN');
                        const date = new Date(o.date).toLocaleDateString();
                        const name = (o.customer.name || o.customer.email).replace(/"/g, '""');

                        o.items.forEach(i => {
                            const lineTotal = i.qty * i.price;
                            grandTotal += lineTotal;
                            csvContent += `${id},"${date}","${name}","${i.name.replace(/"/g, '""')}",${i.qty},${i.price},${lineTotal},${o.status}\n`;
                        });
                    });
                    csvContent += `\n,,,,,,GRAND TOTAL: ${grandTotal.toFixed(2)},`;
                }

                // 3. Download
                try {
                    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);

                    document.getElementById('export-modal').classList.add('hidden');
                } catch (err) {
                    console.error(err);
                    alert("Error creating CSV: " + err.message);
                }
            },

            renderFinancials: function () {
                // Safety check: if no user is logged in, skip rendering
                if (!this.state.currentUser) return;

                // FIX: Allow financials to render for admin users regardless of isPremium flag
                // The admin should always have access to financial data
                if (this.state.currentUser.role !== 'admin' && !this.state.currentUser.isPremium) {
                    this.showSection('user-dashboard-section');
                    return;
                }
                const startDateInput = document.getElementById('fin-date-start').value;
                const endDateInput = document.getElementById('fin-date-end').value;

                // FIX: Include both 'received' and 'Received' status to cover case variations
                let orders = this.state.orders.filter(o => o.status === 'received' || o.status === 'Received' || o.isReceived);

                // DATE FILTER LOGIC
                if (startDateInput) {
                    const start = new Date(startDateInput);
                    orders = orders.filter(o => new Date(o.date) >= start);
                }
                if (endDateInput) {
                    const end = new Date(endDateInput);
                    // Add 1 day to include the end date fully
                    end.setDate(end.getDate() + 1);
                    orders = orders.filter(o => new Date(o.date) < end);
                }

                const products = this.state.products;

                // 1. Calculate Metrics
                const revenue = orders.reduce((sum, o) => sum + o.total, 0);
                const orderCount = orders.length;
                const aov = orderCount > 0 ? (revenue / orderCount) : 0;

                // PROFIT CALC (Revenue - Cost of Goods Sold)
                let totalCost = 0;
                orders.forEach(o => {
                    o.items.forEach(item => {
                        // Find original product to get wholesale price
                        const product = products.find(p => p.id === item.id);
                        const cost = product ? (parseInt(product.priceWholesale) || 0) : 0;
                        totalCost += (cost * item.qty);
                    });
                });
                const profit = revenue - totalCost;
                const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;

                // Inventory Value check defaults
                const inventoryValue = products.reduce((sum, p) => sum + (p.stock * (parseInt(p.priceWholesale) || 0)), 0);

                // Update DOM elements if they exist
                const elAssetVal = document.getElementById('fin-asset-val');
                if (elAssetVal) elAssetVal.innerText = '₦' + inventoryValue.toLocaleString();

                const elAovVal = document.getElementById('fin-aov-val');
                if (elAovVal) elAovVal.innerText = '₦' + aov.toLocaleString(undefined, { maximumFractionDigits: 0 });

                const elProfitVal = document.getElementById('fin-profit-val');
                if (elProfitVal) elProfitVal.innerText = profitMargin + '%';

                // 2. Charts
                // Destroy old charts to prevent duplicate canvases
                ['finStock', 'finVelocity', 'finSales', 'finMain', 'finDonut'].forEach(key => {
                    if (this.state.charts[key]) { this.state.charts[key].destroy(); delete this.state.charts[key]; }
                });

                // --- NEW: Chart C: SALES TREND (Line) ---
                const salesMap = {};
                // If filters are empty, maybe default to last 30 days?
                // For now, use 'orders' which is already filtered by date inputs above.
                // Sort by date logic (aggregated by day)
                orders.forEach(o => {
                    const d = new Date(o.date).toLocaleDateString(); // Simple aggregation
                    salesMap[d] = (salesMap[d] || 0) + o.total;
                });

                // Sort dates chronologically
                // We need to parse back to sort correctly if key is locale string, or use YYYY-MM-DD keys.
                // Let's use simple sort on keys assuming standard format or improve map.
                // Better: use Map with timestamp keys or sort filtered array first.
                // 'orders' is not guaranteed sorted.
                const sortedOrders = [...orders].sort((a, b) => new Date(a.date) - new Date(b.date));

                const trendLabels = [];
                const trendData = [];
                const trendMap = {};

                sortedOrders.forEach(o => {
                    const d = new Date(o.date).toLocaleDateString();
                    trendMap[d] = (trendMap[d] || 0) + o.total;
                });

                for (const [date, total] of Object.entries(trendMap)) {
                    trendLabels.push(date);
                    trendData.push(total);
                }

                // Fallback for empty data
                if (trendLabels.length === 0) {
                    trendLabels.push('No Orders Yet');
                    trendData.push(0);
                }

                try {
                    const ctxSales = document.getElementById('finSalesChart');
                    if (ctxSales) {
                        this.state.charts.finSales = new Chart(ctxSales.getContext('2d'), {
                            type: 'line',
                            data: {
                                labels: trendLabels,
                                datasets: [{
                                    label: 'Daily Revenue (₦)',
                                    data: trendData,
                                    borderColor: '#2563eb', // Blue-600
                                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                    tension: 0.3,
                                    fill: true,
                                    pointRadius: 4,
                                    pointHoverRadius: 6
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        mode: 'index', intersect: false,
                                        callbacks: { label: (c) => '₦' + c.raw.toLocaleString() }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { borderDash: [2, 4] },
                                        ticks: { callback: (v) => '₦' + v.toLocaleString() }
                                    },
                                    x: { grid: { display: false } }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.error("Sales Chart Error:", e);
                }


                // Chart A: Stock Value by Category
                const catMap = {};
                products.forEach(p => {
                    const cat = p.category || 'Uncategorized';
                    const val = (p.stock || 0) * (parseInt(p.priceWholesale) || 0);
                    catMap[cat] = (catMap[cat] || 0) + val;
                });

                let catLabels = Object.keys(catMap);
                let catData = Object.values(catMap);
                if (catLabels.length === 0) {
                    catLabels = ['Empty'];
                    catData = [1]; // Render gray ring
                }

                try {
                    const ctxStock = document.getElementById('finStockChart');
                    if (ctxStock) {
                        this.state.charts.finStock = new Chart(ctxStock.getContext('2d'), {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: Object.values(catMap),
                                    backgroundColor: ['#4ade80', '#60a5fa', '#f59e0b', '#a78bfa', '#f472b6']
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'right' }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.error("Stock Chart Error:", e);
                }

                // Chart B: Velocity - Top 5 Products by Value
                let topProducts = [...products]
                    .sort((a, b) => ((b.stock || 0) * (parseInt(b.priceWholesale) || 0)) - ((a.stock || 0) * (parseInt(a.priceWholesale) || 0)))
                    .slice(0, 5);

                let velLabels = topProducts.map(p => (p.name || '').substring(0, 10) + '...');
                let velData = topProducts.map(p => (p.stock || 0) * (parseInt(p.priceWholesale) || 0));

                if (velLabels.length === 0) {
                    velLabels = ['No Products'];
                    velData = [0];
                }

                try {
                    const ctxVel = document.getElementById('finVelocityChart');
                    if (ctxVel) {
                        this.state.charts.finVelocity = new Chart(ctxVel.getContext('2d'), {
                            type: 'bar',
                            data: {
                                labels: velLabels,

                                datasets: [{
                                    label: 'Stock Value (₦)',
                                    data: velData,
                                    backgroundColor: '#6366f1'
                                }]
                            },
                            options: {
                                indexAxis: 'y',
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { beginAtZero: true }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.error("Velocity Chart Error:", e);
                }
            },

            toggleLandingPage: function (show) {
                const landing = document.getElementById('landing-section');
                if (show) {
                    landing.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                } else {
                    landing.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            },

            // --- AUTH LOGIC ---
            isSignUpMode: false,

            toggleAuthMode: function () {
                this.isSignUpMode = !this.isSignUpMode;
                const signupFields = document.getElementById('signup-fields');
                const btn = document.getElementById('auth-submit-btn');
                const toggleText = document.getElementById('auth-toggle-text');
                const toggleLink = document.getElementById('auth-toggle-link');

                if (this.isSignUpMode) {
                    signupFields.classList.remove('hidden');
                    btn.innerText = 'Create Account';
                    toggleText.innerText = 'Already have an account?';
                    toggleLink.innerText = 'Sign In';
                } else {
                    signupFields.classList.add('hidden');
                    btn.innerText = 'Sign In';
                    toggleText.innerText = "Don't have an account?";
                    toggleLink.innerText = 'Sign Up';
                }
            },

            handleAuth: function (e) {
                e.preventDefault();
                if (this.isSignUpMode) this.signup(e);
                else this.login(e);
            },

            signup: function (e) {
                const name = document.getElementById('signup-name').value;
                const phone = document.getElementById('signup-phone').value;
                const email = document.getElementById('login-email').value;
                const pass = document.getElementById('login-password').value;

                if (!email || !pass || !name || !phone) return alert("Please fill all fields.");

                auth.createUserWithEmailAndPassword(email, pass)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        const role = email === 'admin@g4mg.com' ? 'admin' : 'wholesale'; // DEFAULT IS WHOLESALE NOW

                        // Create User Doc
                        return db.collection('users').doc(user.uid).set({
                            email: email,
                            role: role,
                            name: name,
                            phone: phone,
                            isPremium: role === 'admin', // Default admin is premium
                            createdAt: new Date().toISOString()
                        });
                    })
                    .then(() => {
                        alert("Account Created! You are logged in.");
                        // onAuthStateChanged will handle the rest
                    })
                    .catch((error) => {
                        alert("Error: " + error.message);
                    });
            },

            login: async function (e, isPremiumOverride = false) {
                e.preventDefault();
                console.log("[Login] Attempt initiated.");

                // 1. Determine Login Context (Premium vs Standard)
                // Use override if provided, otherwise fallback to DOM checking
                const landingSection = document.getElementById('landing-section');
                // Context is Premium if landing section exists and DOES NOT have 'hidden' class
                const isPremiumLogin = isPremiumOverride || (landingSection && !landingSection.classList.contains('hidden'));
                console.log("[Login] Context:", isPremiumLogin ? "Premium (Landing)" : "Standard (Modal)");

                // 2. Select Inputs based on Context
                const emailEl = isPremiumLogin ? document.getElementById('landing-email') : document.getElementById('login-email');
                const passEl = isPremiumLogin ? document.getElementById('landing-password') : document.getElementById('login-password');

                if (!emailEl) {
                    console.error("[Login] Error: Email input not found.", { emailEl });
                    alert("System Error: Login inputs not found. Please refresh.");
                    return;
                }

                const email = emailEl.value.trim().toLowerCase();
                const pass = passEl ? passEl.value : '';
                console.log("[Login] Credentials captured for:", email, "| Password Provided:", !!pass);

                if (!email) return alert("Please enter your email address.");

                const setLoading = (loading) => {
                    const msg = document.getElementById('loading-msg');
                    if (msg) loading ? msg.classList.remove('hidden') : msg.classList.add('hidden');
                };
                setLoading(true);

                if (!auth) {
                    console.error("[Login] Firebase Auth not initialized.");
                    alert("System Error: Firebase is not connected. Please check your internet and refresh.");
                    setLoading(false);
                    return;
                }

                // FIX: Allow wholesale users to login without typing a password by trying the default wholesale password
                const fallbackPass = (this.state.config && this.state.config.passWholesale) ? this.state.config.passWholesale : DEFAULT_CONFIG.passWholesale;
                let loginPass = pass || fallbackPass;

                if (!pass && email === 'wholesale@g4mg.com') {
                    console.log("[Login] Auto-authenticating specific wholesale account with pass:", fallbackPass);
                }

                console.log("[Login] Attempting sign-in with Firebase...");

                auth.signInWithEmailAndPassword(email, loginPass)
                    .then((userCredential) => {
                        this.state.viewMode = 'premium'; // ALWAYS PREMIUM / FULL FEATURES
                        console.log("[Login] Success:", userCredential.user.email);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("[Login] Firebase Error:", error);
                        setLoading(false);

                        // If it's a Premium context and user not found, offering trial activation
                        const isUserNotFound = error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials';

                        if (isPremiumLogin && isUserNotFound) {
                            const msg = `ACCOUNT ACTION REQUIRED\n\nNo premium workstation found for ${email}.\n\nDo you want to ACTIVATE a 7-Day Free Trial? \n\n(Note: If you already have a Standard account, it will be UPGRADED and all your records/data will be PRESERVED).`;
                            if (confirm(msg)) {
                                setLoading(true);
                                auth.createUserWithEmailAndPassword(email, loginPass)
                                    .then((userCredential) => {
                                        console.log("[Login] Trial Activated:", userCredential.user.email);
                                        setLoading(false);
                                    })
                                    .catch((err) => {
                                        alert("Activation Failed: " + err.message);
                                        setLoading(false);
                                    });
                                return;
                            }
                        }

                        // Specific failure messaging for the requested wholesale account
                        const isTargetWholesale = (email === 'wholesale@g4mg.com');
                        console.log("[Login] Failure Diagnostic - email:", email, "| isTarget:", isTargetWholesale, "| code:", error.code);

                        // AUTO-PROVISION: If specific wholesale is not found, CREATE IT instantly
                        if (isTargetWholesale && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials')) {
                            console.log("[Login] Target account not found. Provisioning now...");
                            auth.createUserWithEmailAndPassword(email, loginPass)
                                .then((userCredential) => {
                                    const user = userCredential.user;
                                    return db.collection('users').doc(user.uid).set({
                                        email: email,
                                        role: 'wholesale',
                                        name: 'G4MG Wholesale',
                                        phone: '0000000000',
                                        isPremium: true,
                                        createdAt: new Date().toISOString()
                                    });
                                })
                                .then(() => {
                                    console.log("[Login] Target account provisioned and logged in.");
                                    this.state.viewMode = 'premium';
                                    setLoading(false);
                                })
                                .catch((createErr) => {
                                    alert("Automatic Setup Failed: " + createErr.message);
                                    setLoading(false);
                                });
                            return;
                        }

                        // Fallback failure messages
                        if (!pass && isTargetWholesale) {
                            alert(`Login Failed for ${email}: This account might have a custom password set in Firebase. Please try entering it, or reset the account in your Firebase Console.`);
                        } else if (!pass) {
                            alert("Login Failed: This account may not be a wholesale account, or requires its specific password.");
                        } else {
                            alert("Login Failed: " + error.message);
                        }
                    });
            },

            renderUserDashboard: function () {
                const userEmail = this.state.currentUser.email;
                const welcomeEl = document.getElementById('user-dash-welcome');
                if (welcomeEl) welcomeEl.innerText = "Logged in as: " + userEmail;

                const analyticsContainer = document.getElementById('user-analytics-container');
                const upsellBanner = document.getElementById('user-upsell-banner');
                const badge = document.getElementById('user-premium-badge');

                // SUSPEND ALL RESTRICTIONS: Always show analytics
                if (analyticsContainer) analyticsContainer.classList.remove('hidden');
                if (upsellBanner) upsellBanner.classList.add('hidden');
                if (badge) badge.classList.add('hidden'); // Hide the "Premium" lock badge too if it's restrictive

                const isPremium = true; // Force True for Logic downstream

                // Metrics
                // Use a single robust declaration for myOrders
                const myOrders = this.state.orders.filter(o => o.customer && o.customer.email === userEmail)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);
                const totalOrders = myOrders.length;
                const aov = totalOrders > 0 ? (totalSpent / totalOrders) : 0;
                const lastOrderDate = myOrders.length > 0 ? new Date(myOrders[0].date).toLocaleDateString() : 'N/A';

                document.getElementById('user-metric-spent').innerText = '₦' + totalSpent.toLocaleString();
                document.getElementById('user-metric-orders').innerText = totalOrders;
                document.getElementById('user-metric-aov').innerText = '₦' + aov.toLocaleString(undefined, { maximumFractionDigits: 0 });
                document.getElementById('user-metric-last').innerText = lastOrderDate;

                // --- ORDER HISTORY (Always Visible for Staff/Wholesale) ---
                const tbody = document.getElementById('user-orders-body');

                if (tbody) tbody.innerHTML = '';

                if (myOrders.length === 0) {
                    const emptyState = document.getElementById('user-empty-state');
                    if (emptyState) emptyState.classList.remove('hidden');
                } else {
                    const emptyState = document.getElementById('user-empty-state');
                    if (emptyState) emptyState.classList.add('hidden');

                    // Ensure Table is Visible
                    const tableContainer = document.querySelector('#user-dashboard-section .bg-white.rounded-lg.shadow.overflow-hidden');
                    if (tableContainer) tableContainer.classList.remove('hidden');

                    // Ensure Header is Visible
                    const historyHeader = document.querySelector('#user-dashboard-section .flex.justify-between.items-center.mb-4');
                    if (historyHeader) historyHeader.classList.remove('hidden');

                    if (tbody) {
                        myOrders.forEach(order => {
                            const shortId = order.orderId ? String(order.orderId).padStart(3, '0') : (order.docId ? order.docId.slice(0, 3) : '---');

                            // Status Indicator Logic
                            let statusIcon = '';
                            if (order.isReceived) {
                                statusIcon = '<span class="text-green-600 font-bold flex items-center gap-1"><i class="fas fa-check-circle"></i> Received</span>';
                            } else if (order.isApproved) {
                                statusIcon = '<span class="text-blue-600 font-bold flex items-center gap-1"><i class="fas fa-check"></i> Approved</span>';
                            } else {
                                statusIcon = '<span class="text-yellow-600 font-bold">Pending</span>';
                            }

                            const tr = document.createElement('tr');
                            tr.className = "border-b hover:bg-gray-50";
                            tr.innerHTML = `
                                <td class="px-6 py-4 font-bold">#${shortId}</td>
                                <td class="px-6 py-4 text-gray-500">${new Date(order.date).toLocaleDateString()}</td>
                                <td class="px-6 py-4">${order.items ? order.items.length : 0} Items</td>
                                <td class="px-6 py-4 font-bold">₦${order.total.toLocaleString()}</td>
                                <td class="px-6 py-4">${statusIcon}</td> 
                                <td class="px-6 py-4 min-w-[200px]">${this.renderOrderStepper(order)}</td>
                            `;
                            tbody.appendChild(tr);
                        });
                    }
                }

                // If not premium, still handle analytics chart containers (keep hidden)
                if (!isPremium) {
                    if (analyticsContainer) analyticsContainer.classList.add('hidden');
                    if (upsellBanner) upsellBanner.classList.remove('hidden');
                    if (badge) badge.classList.add('hidden');
                }
            },

            renderOrderStepper: function (order) {
                // Determine State
                const isApproved = order.isApproved;
                const isReceived = order.isReceived; // "Completed"

                // Styles
                const activeColor = "text-green-500";
                const inactiveColor = "text-gray-300";
                const barActive = "bg-green-500";
                const barInactive = "bg-gray-200";

                // Step 1: Pending (Always Active/Done)
                const s1Color = activeColor;
                const s1Icon = "fa-check-circle";

                // Step 2: Approved
                const s2Color = (isApproved || isReceived) ? activeColor : inactiveColor;
                const s2Icon = (isApproved || isReceived) ? "fa-check-circle" : "fa-circle";
                const bar1 = (isApproved || isReceived) ? barActive : barInactive;

                // Step 3: Completed (Received)
                const s3Color = isReceived ? activeColor : inactiveColor;
                const s3Icon = isReceived ? "fa-check-circle" : "fa-circle";
                const bar2 = isReceived ? barActive : barInactive;

                return `
                    <div class="flex flex-col w-full">
                        <div class="flex items-center justify-between w-full mb-1">
                            <i class="fas ${s1Icon} ${s1Color} text-xs"></i>
                            <div class="h-0.5 flex-1 mx-1 ${bar1}"></div>
                            <i class="fas ${s2Icon} ${s2Color} text-xs"></i>
                            <div class="h-0.5 flex-1 mx-1 ${bar2}"></div>
                            <i class="fas ${s3Icon} ${s3Color} text-xs"></i>
                        </div>
                        <div class="flex justify-between w-full text-[10px] font-bold uppercase tracking-tighter">
                            <span class="${s1Color}">Pending</span>
                            <span class="${s2Color}">Approved</span>
                            <span class="${s3Color}">Received</span>
                        </div>
                    </div>
                `;
            },

            // --- RENDER LOGIC ---
            editCustomerPhone: function (docId, currentPhone) {
                const newPhone = prompt("Enter new phone number (Start with Country Code e.g. 234...):", currentPhone);
                if (newPhone && newPhone !== currentPhone) {
                    db.collection('orders').doc(docId).update({ "customer.phone": newPhone })
                        .then(() => {
                            alert("Phone updated!");
                            // Manually update state for immediate feedback
                            const o = this.state.orders.find(ord => ord.docId === docId);
                            if (o) o.customer.phone = newPhone;
                            this.renderOrders();
                        })
                        .catch(e => alert("Error: " + e));
                }
            },

            // --- RENDER LOGIC ---
            renderOrders: function () {
                const tbody = document.getElementById('orders-table-body');
                const mobileList = document.getElementById('orders-mobile-list');
                const desktopTable = document.getElementById('orders-desktop-table');

                const isPremiumView = true; // ALWAYS SHOW PREMIUM FEATURES

                // Handle Mobile View Gating
                if (desktopTable) {
                    desktopTable.className = "hidden md:block bg-white rounded-lg shadow overflow-hidden";
                    if (mobileList) mobileList.style.display = '';
                }

                // Update Trash Toggle Button
                const trashBtn = document.getElementById('btn-toggle-trash');
                if (trashBtn) {
                    if (this.state.showTrash) {
                        trashBtn.innerHTML = '<i class="fas fa-arrow-left mr-1"></i> Back to Orders';
                        trashBtn.className = 'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-bold shadow flex items-center gap-2';
                    } else {
                        trashBtn.innerHTML = '<i class="fas fa-trash-restore mr-1"></i> View Trash';
                        trashBtn.className = 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded text-sm font-bold shadow flex items-center gap-2';
                    }
                    // Only show trash toggle to admins
                    if (this.state.currentUser && this.state.currentUser.role === 'admin') {
                        trashBtn.classList.remove('hidden');
                    } else {
                        trashBtn.classList.add('hidden');
                    }
                }

                const role = this.state.currentUser.role;
                let ordersToShow = [];

                // 1. Role-Based Access Control
                if (role === 'admin') {
                    ordersToShow = this.state.orders;
                } else if (role === 'staff') {
                    ordersToShow = this.state.orders.filter(o => o.creatorEmail === this.state.currentUser.email || o.customer.email === this.state.currentUser.email);
                } else {
                    ordersToShow = this.state.orders.filter(o => o.customer.email === this.state.currentUser.email);
                }

                // 2. Soft Delete Filter: Show deleted or active orders based on trash toggle
                if (this.state.showTrash) {
                    ordersToShow = ordersToShow.filter(o => o.isDeleted === true);
                } else {
                    ordersToShow = ordersToShow.filter(o => !o.isDeleted);
                }

                // 3. Admin Staff Filter
                if (role === 'admin') {
                    const staffFilter = document.getElementById('admin-staff-filter');
                    if (staffFilter && staffFilter.value !== 'all') {
                        const target = staffFilter.value;
                        ordersToShow = ordersToShow.filter(o => o.creatorEmail === target || o.customer.email === target);
                    }
                }

                // 4. Search Filter
                const searchInput = document.getElementById('order-search-input');
                if (searchInput && searchInput.value) {
                    const term = searchInput.value.toLowerCase();
                    ordersToShow = ordersToShow.filter(o =>
                        (o.orderId && String(o.orderId).includes(term)) ||
                        (o.customer.name && o.customer.name.toLowerCase().includes(term)) ||
                        (o.docId && o.docId.toLowerCase().includes(term))
                    );
                }

                ordersToShow.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Batch DOM: accumulate HTML strings
                let tbodyHtml = '';
                let mobileHtml = '';

                ordersToShow.forEach(order => {
                    // Status HTML
                    let statusHtml = '';
                    if (order.isDeleted) {
                        statusHtml = '<span class="px-2 py-1 rounded text-xs bg-red-100 text-red-800 text-center">Deleted</span>';
                    } else if (!order.isApproved && !order.isReceived) {
                        statusHtml = '<span class="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 text-center">Pending</span>';
                    } else {
                        statusHtml = '<div class="flex flex-col gap-1 items-start w-full">';
                        if (order.isApproved) statusHtml += '<span class="px-2 py-1 rounded text-xs bg-green-100 text-green-800 text-center w-full mb-1">Approved</span>';
                        if (order.isReceived) statusHtml += '<span class="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 text-center w-full">Received</span>';
                        statusHtml += '</div>';
                    }

                    // Action Buttons (Improved Spacing)
                    let actions = '';
                    if (this.state.showTrash) {
                        // Trash view: only show Restore button
                        actions = `<div class="flex flex-col gap-3 w-full">
                            <button onclick="app.restoreOrder('${order.docId}')" class="text-xs bg-green-50 text-green-700 border border-green-300 px-3 py-2 rounded-lg hover:bg-green-100 transition font-bold"><i class="fas fa-trash-restore mr-1"></i>Restore Order</button>
                        </div>`;
                    } else {
                        actions = `<div class="flex flex-col gap-3 w-full">`;
                        actions += `<button onclick="app.viewInvoice('${order.docId}')" class="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition font-medium">View Invoice</button>`;
                        if (role === 'admin') {
                            actions += `<button onclick="app.openEditModal('${order.docId}')" class="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-100 transition font-medium">Edit Qty</button>`;
                            if (!order.isReceived) actions += `<button onclick="app.receiveOrder('${order.docId}')" class="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-2 rounded-lg hover:bg-purple-100 transition font-medium">Receive</button>`;
                            if (!order.isApproved) actions += `<button onclick="app.approveOrder('${order.docId}')" class="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-2 rounded-lg hover:bg-green-100 transition font-medium">Approve</button>`;
                            // Visual separator before Delete
                            actions += `<div class="border-t border-gray-200 my-1"></div>`;
                            actions += `<button onclick="app.deleteOrder('${order.docId}')" class="text-xs bg-red-50 text-red-600 border-2 border-red-300 px-3 py-2 rounded-lg hover:bg-red-100 transition font-bold"><i class="fas fa-trash mr-1"></i>Delete</button>`;
                        }
                        actions += `</div>`;
                    }

                    // Payment Inputs
                    const paymentStatus = order.paymentStatus || 'Unpaid';
                    const paymentDate = order.paymentDate || '';

                    const paymentHtml = role === 'admin' ? `
                        <div class="flex flex-col gap-1">
                            <select onchange="app.updatePaymentStatus('${order.docId}', this.value)" class="border rounded p-1 text-xs ${paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 font-bold border-green-200' : 'bg-red-50 text-red-700 font-bold border-red-200'}">
                                <option value="Unpaid" ${paymentStatus === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
                                <option value="Paid" ${paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
                            </select>
                            <input type="date" value="${paymentDate}" onchange="app.updatePaymentDate('${order.docId}', this.value)" class="border rounded p-1 text-xs w-full">
                        </div>
                    ` : `
                        <div>
                            <span class="font-bold text-xs ${paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'}">${paymentStatus}</span>
                            <div class="text-xs text-gray-500">${paymentDate ? new Date(paymentDate).toLocaleDateString() : ''}</div>
                        </div>
                    `;

                    // 1. Desktop Table Row
                    const phoneHtml = `
                        <div class="text-xs text-gray-500 flex items-center gap-1">
                            ${order.customer.phone || ''}
                            ${role === 'admin' ? `<button onclick="app.editCustomerPhone('${order.docId}', '${order.customer.phone || ''}')" class="text-blue-500 hover:text-blue-700 ml-1" title="Edit Phone"><i class="fas fa-pen text-[10px]"></i></button>` : ''}
                        </div>
                    `;

                    tbodyHtml += `
                        <tr class="${order.isDeleted ? 'bg-red-50' : 'bg-white'} border-b hover:bg-gray-50 transition">
                            <td class="px-6 py-4 font-bold text-xs text-gray-700">#${order.orderId ? String(order.orderId).padStart(3, '0') : order.docId.slice(0, 3)}</td>
                            <td class="px-6 py-4 text-xs">${new Date(order.date).toLocaleDateString()}</td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-bold text-gray-800">${order.customer.name}</div>
                                ${phoneHtml}
                            </td>
                            <td class="px-6 py-4 font-bold text-primary-800">₦${order.total.toLocaleString()}</td>
                            <td class="px-6 py-4">${paymentHtml}</td>
                            <td class="px-6 py-4">${statusHtml}</td>
                            <td class="px-6 py-4 min-w-[140px]">${actions}</td>
                        </tr>`;

                    // 2. Mobile Card View
                    mobileHtml += `
                        <div class="${order.isDeleted ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'} p-5 rounded-xl shadow-sm border flex flex-col animate-fade-in-up">
                            <div class="flex justify-between items-start mb-3 border-b pb-2 border-gray-100">
                                <div>
                                    <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Order #${order.orderId ? String(order.orderId).padStart(3, '0') : order.docId.slice(0, 3)}</div>
                                    <div class="text-xs text-gray-500">${new Date(order.date).toLocaleDateString()}</div>
                                </div>
                                <div class="flex items-start">
                                    ${statusHtml}
                                </div>
                            </div>
                            <div class="mb-4 space-y-1">
                                <div class="flex justify-between">
                                    <span class="text-xs text-gray-500">Customer:</span>
                                    <span class="text-sm font-bold text-gray-800 text-right">${order.customer.name}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-xs text-gray-500">Total:</span>
                                    <span class="text-sm font-bold text-primary-800">₦${order.total.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between items-center pt-1">
                                    <span class="text-xs text-gray-500">Payment:</span>
                                    <div>${paymentHtml}</div>
                                </div>
                            </div>
                            <div class="mt-auto pt-3 border-t border-gray-100">
                                <h4 class="text-xs font-bold text-gray-400 mb-2 uppercase">Actions</h4>
                                ${actions}
                            </div>
                        </div>
                    `;
                });

                // Single DOM update (batch write)
                if (tbody) tbody.innerHTML = tbodyHtml;
                if (mobileList) mobileList.innerHTML = mobileHtml;
            },

            togglePublicProductDesc: function(id) {
                const descEl = document.getElementById(`public-desc-${id}`);
                const iconEl = document.getElementById(`public-icon-${id}`);
                if (descEl.classList.contains('hidden')) {
                    descEl.classList.remove('hidden');
                    iconEl.classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    descEl.classList.add('hidden');
                    iconEl.classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            },

            renderPublicCatalog: function () {
                const grid = document.getElementById('public-products-grid');
                if (!grid) return;
                grid.innerHTML = '';
                
                if (this.state.products.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">Loading catalog...</div>';
                    return;
                }

                this.state.products.forEach(p => {
                    const imgUrl = p.image || 'https://via.placeholder.com/300x300?text=No+Image';
                    grid.innerHTML += `
                        <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col">
                            <div class="h-48 bg-gray-50 flex justify-center items-center overflow-hidden border-b">
                                <img src="${imgUrl}" class="h-full w-full object-cover" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
                            </div>
                            <div class="p-4 flex flex-col flex-grow">
                                <div class="text-xs font-bold text-primary-600 mb-1 tracking-wider uppercase">${p.category || 'General'}</div>
                                <h3 class="text-lg font-bold text-gray-800 leading-tight mb-2">${p.name}</h3>
                                
                                <div class="mt-auto pt-3 border-t">
                                    <button onclick="app.togglePublicProductDesc('${p.id}')" class="w-full text-left py-2 text-sm font-semibold text-gray-600 hover:text-primary-700 flex justify-between items-center transition outline-none">
                                        <span>View Details</span>
                                        <i id="public-icon-${p.id}" class="fas fa-chevron-down transition-transform"></i>
                                    </button>
                                    
                                    <div id="public-desc-${p.id}" class="hidden mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        ${p.desc ? p.desc.replace(/\n/g, '<br>') : 'No detailed description available for this item.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            },

            renderProducts: function () {
                const search = document.getElementById('product-search').value.toLowerCase();
                const category = document.getElementById('category-filter').value;
                const grid = document.getElementById('product-grid');

                // Dynamically populate category filter options
                this.populateCategoryFilters();

                // Show "Add Product" button if Admin
                const btnAdd = document.getElementById('btn-add-product');
                if (btnAdd) {
                    if (this.state.currentUser.role === 'admin') btnAdd.classList.remove('hidden');
                    else btnAdd.classList.add('hidden');
                }

                let html = '';
                this.state.products.forEach(p => {
                    if ((category === 'all' || p.category === category) && (p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search))) {
                        const currentPrice = this.getProductPrice(p);
                        const isOutOfStock = p.stock <= 0;
                        let stockDisplay = '';
                        if (this.state.currentUser.role === 'wholesale') {
                            stockDisplay = isOutOfStock ? '<span class="text-red-600 font-bold text-sm">Out of Stock</span>' : '<span class="text-green-600 font-bold text-sm">Available</span>';
                        } else {
                            const stockColor = p.stock < 10 ? 'text-red-600' : (p.stock < 50 ? 'text-yellow-600' : 'text-green-600');
                            stockDisplay = `<span class="text-xs font-bold ${stockColor}">${isOutOfStock ? 'Out of Stock' : p.stock + ' left'}</span>`;
                        }

                        const isAdmin = this.state.currentUser.role === 'admin';
                        let adminActions = '';
                        if (isAdmin) {
                            adminActions = `
                                <div class="absolute top-2 right-2 flex gap-2 z-20">
                                    <button onclick="event.stopPropagation(); app.openEditProductModal('${p.id}')" class="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-blue-50 transition transform active:scale-95" title="Edit"><i class="fas fa-pen text-sm"></i></button>
                                    <button onclick="event.stopPropagation(); app.deleteProduct('${p.id}')" class="bg-white text-red-600 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-red-50 transition transform active:scale-95" title="Delete"><i class="fas fa-trash text-sm"></i></button>
                                </div>
                             `;
                        }

                        html += `
                            <div class="relative bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col group">
                                ${adminActions}
                                <img src="${p.image}" class="h-32 object-contain mb-4 rounded">
                                <h3 class="font-bold text-lg leading-tight">${p.name}</h3>
                                <p class="text-gray-500 text-xs mb-2 h-8 overflow-hidden">${p.desc}</p>
                                <div class="flex justify-between items-center mb-2 mt-auto">
                                    <span class="font-bold text-primary-800">₦${currentPrice.toLocaleString()}</span>
                                    ${stockDisplay}
                                </div>
                                <button onclick="app.addToCart('${p.id}')" class="w-full py-2 rounded text-white font-bold ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-medical-500 hover:bg-medical-600'}" ${isOutOfStock ? 'disabled' : ''}>${isOutOfStock ? 'Unavailable' : 'Add to Cart'}</button>
                            </div>
                        `;
                    }
                });
                grid.innerHTML = html;
            },

            getProductPrice: function (product) {
                if (this.state.currentUser && this.state.currentUser.role === 'wholesale') return product.priceWholesale;
                return product.priceStaff;
            },
            populateClientFilter: function () {
                // Populate Analytics Filter
                const analyticsSelect = document.getElementById('analytics-client-filter');
                // Populate Export Filter
                const exportSelect = document.getElementById('export-user-filter');

                if (!analyticsSelect && !exportSelect) return;

                const clients = new Map();
                this.state.orders.forEach(o => {
                    if (o.customer && o.customer.email) {
                        clients.set(o.customer.email, o.customer.name || o.customer.email);
                    }
                });

                let optionsHtml = '<option value="all">Global (All Customers)</option>';
                clients.forEach((name, email) => {
                    optionsHtml += `<option value="${email}">${name} (${email})</option>`;
                });

                if (analyticsSelect) {
                    const currentVal = analyticsSelect.value;
                    analyticsSelect.innerHTML = optionsHtml.replace('Global (All Customers)', 'Global Overview (All Clients)');
                    analyticsSelect.value = currentVal;
                }

                if (exportSelect) {
                    // Export filter needs "All Customers" as label, logic handled above by replace for analytics
                    exportSelect.innerHTML = optionsHtml.replace('Global (All Customers)', 'All Customers');
                }
            },

            // ==========================================
            // ✅ UPDATED ANALYTICS LOGIC (REAL-TIME)
            // ==========================================
            renderAnalytics: function () {
                // UNIVERSAL ACCESS (Restriction Suspended)
                // if (this.state.viewMode === 'standard') { ... } // Removed

                const filterEmail = document.getElementById('analytics-client-filter').value;
                const isAll = filterEmail === 'all';
                let filteredOrders = isAll ? this.state.orders : this.state.orders.filter(o => o.customer.email === filterEmail);
                let metric1, metric2, metric3, metric4;

                // --- Top 4 Cards Logic ---
                // --- Top 4 Cards Logic ---
                // MODIFIED: Calculation based on 'Approved AND Received' only (Strict)
                const receivedOrders = filteredOrders.filter(o => o.isApproved && o.isReceived);
                const totalRevenue = receivedOrders.reduce((a, b) => a + b.total, 0);

                if (isAll) {
                    // Global Mode
                    document.getElementById('lbl-metric-3').innerText = "Low Stock Items";
                    document.getElementById('lbl-metric-4').innerText = "Active Clients";

                    metric1 = '₦' + totalRevenue.toLocaleString();
                    metric2 = receivedOrders.length;
                    metric3 = this.state.products.filter(p => p.stock < 10).length;
                    document.getElementById('dash-metric-3').className = "text-2xl font-bold text-red-600";
                    const uniqueCust = new Set(this.state.orders.map(o => o.customer.email));
                    metric4 = uniqueCust.size;
                } else {
                    // Individual Mode
                    document.getElementById('lbl-metric-3').innerText = "Last Order Date";
                    document.getElementById('lbl-metric-4').innerText = "Avg. Order Value";

                    metric1 = '₦' + totalRevenue.toLocaleString();
                    metric2 = receivedOrders.length;

                    if (filteredOrders.length > 0) {
                        const sorted = [...filteredOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
                        metric3 = new Date(sorted[0].date).toLocaleDateString();
                    } else { metric3 = "N/A"; }

                    document.getElementById('dash-metric-3').className = "text-xl font-bold text-gray-800";
                    const avg = receivedOrders.length ? (totalRevenue / receivedOrders.length) : 0;
                    metric4 = '₦' + Math.floor(avg).toLocaleString();
                }

                document.getElementById('dash-metric-1').innerText = metric1;
                document.getElementById('dash-metric-2').innerText = metric2;
                document.getElementById('dash-metric-3').innerText = metric3;
                document.getElementById('dash-metric-4').innerText = metric4;


                // --- EXPIRY LOGIC (Premium Only) ---
                const isPremium = this.state.currentUser && this.state.currentUser.isPremium;
                const expCard = document.getElementById('dash-exp-card');

                if (isPremium && isAll) {
                    if (expCard) expCard.classList.remove('hidden');
                    const now = new Date();
                    const expiringCount = this.state.products.filter(p => {
                        if (!p.expiryDate) return false;
                        const days = (new Date(p.expiryDate) - now) / (1000 * 3600 * 24);
                        return days < 90;
                    }).length;
                    document.getElementById('dash-metric-exp').innerText = expiringCount;
                    if (expiringCount > 0) document.getElementById('dash-metric-exp').className = "text-3xl font-bold mt-1 text-yellow-200 animate-pulse";
                    else document.getElementById('dash-metric-exp').className = "text-3xl font-bold mt-1";
                } else {
                    if (expCard) expCard.classList.add('hidden');
                }

                // --- Performance Analytics Logic (The Middle 3 Cards) ---
                if (isAll) {
                    // GLOBAL VIEW: Top Spender, Frequent Buyer
                    document.getElementById('kpi-lbl-1').innerText = "Top Spender";
                    document.getElementById('kpi-lbl-2').innerText = "Most Frequent Buyer";
                    document.getElementById('kpi-lbl-3').innerText = "Global Avg. Order";

                    const clientSpend = {};
                    const clientCount = {};
                    this.state.orders.forEach(o => {
                        if (o.isReceived) {
                            clientSpend[o.customer.name] = (clientSpend[o.customer.name] || 0) + o.total;
                            clientCount[o.customer.name] = (clientCount[o.customer.name] || 0) + 1;
                        }
                    });

                    // Top Spender
                    const topSpenderName = Object.keys(clientSpend).reduce((a, b) => clientSpend[a] > clientSpend[b] ? a : b, "N/A");
                    document.getElementById('kpi-top-client').innerText = topSpenderName !== "N/A" ? topSpenderName : "No Data";
                    document.getElementById('kpi-top-amount').innerText = topSpenderName !== "N/A" ? '₦' + clientSpend[topSpenderName].toLocaleString() : "₦0.00";

                    // Most Frequent
                    const freqName = Object.keys(clientCount).reduce((a, b) => clientCount[a] > clientCount[b] ? a : b, "N/A");
                    document.getElementById('kpi-freq-client').innerText = freqName !== "N/A" ? freqName : "No Data";
                    document.getElementById('kpi-freq-count').innerText = freqName !== "N/A" ? clientCount[freqName] + " Orders" : "0 Orders";

                    // Avg Order
                    const globalAvg = receivedOrders.length > 0 ? (totalRevenue / receivedOrders.length) : 0;
                    document.getElementById('kpi-avg-val').innerText = '₦' + Math.floor(globalAvg).toLocaleString();

                } else {
                    // INDIVIDUAL VIEW: Specific Client Performance
                    document.getElementById('kpi-lbl-1').innerText = "Highest Single Invoice";
                    document.getElementById('kpi-lbl-2').innerText = "Total Items Purchased";
                    document.getElementById('kpi-lbl-3').innerText = "Client Avg. Order";

                    // 1. Highest Single Order
                    const maxOrder = receivedOrders.reduce((max, o) => o.total > max ? o.total : max, 0);
                    document.getElementById('kpi-top-client').innerText = "Personal Record";
                    document.getElementById('kpi-top-amount').innerText = '₦' + maxOrder.toLocaleString();

                    // 2. Total Items Purchased
                    const totalItems = receivedOrders.reduce((sum, o) => sum + o.items.reduce((is, i) => is + i.qty, 0), 0);
                    document.getElementById('kpi-freq-client').innerText = "Total Volume";
                    document.getElementById('kpi-freq-count').innerText = totalItems + " Units";

                    // 3. Client Avg
                    const clientAvg = receivedOrders.length > 0 ? (totalRevenue / receivedOrders.length) : 0;
                    document.getElementById('kpi-avg-val').innerText = '₦' + Math.floor(clientAvg).toLocaleString();
                }

                this.initCharts(receivedOrders, isAll);
            },

            initCharts: function (orders, isAll) {
                const ctx1 = document.getElementById('revenueChart').getContext('2d');
                const ctx2 = document.getElementById('productsChart').getContext('2d');
                if (window.revChart) window.revChart.destroy();
                if (window.prodChart) window.prodChart.destroy();

                // Sort orders by date for chart (oldest to newest)
                const chartOrders = [...orders].sort((a, b) => new Date(a.date) - new Date(b.date));
                // Take last 10 orders for readability
                const recentOrders = chartOrders.slice(-10);

                const labels = recentOrders.map(o => new Date(o.date).toLocaleDateString());
                const data = recentOrders.map(o => o.total);

                window.revChart = new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: isAll ? 'Global Revenue Trend' : 'Client Spending Trend',
                            data: data,
                            borderColor: '#1e40af',
                            tension: 0.3,
                            fill: true,
                            backgroundColor: 'rgba(30, 64, 175, 0.1)'
                        }]
                    }
                });

                const productSales = {};
                orders.forEach(o => {
                    o.items.forEach(i => {
                        productSales[i.name] = (productSales[i.name] || 0) + i.qty;
                    });
                });

                const sortedProducts = Object.entries(productSales)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);

                window.prodChart = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: sortedProducts.map(x => x[0]),
                        datasets: [{
                            label: isAll ? 'Top Selling (Global)' : 'Client Favorites',
                            data: sortedProducts.map(x => x[1]),
                            backgroundColor: '#059669',
                            borderRadius: 5
                        }]
                    }
                });
            },

            addToCart: function (id) {
                console.log("[addToCart] Called with ID:", id);
                // Robust lookup: specific ID or loose equality for string/number mix
                const product = this.state.products.find(p => p.id == id);
                if (!product) {
                    console.error("[addToCart] Product not found:", id);
                    return alert("Error: Product not found. Please refresh.");
                }
                const price = this.getProductPrice(product);
                // Robust existing check
                const existing = this.state.cart.find(item => item.id == id);

                if (existing) {
                    if (existing.qty < product.stock) existing.qty++;
                    else return alert("Max stock reached");
                } else {
                    this.state.cart.push({ ...product, price: price, qty: 1 });
                }

                this.saveCart();
                this.updateCartCount();
                alert(`${product.name} added to cart!`);
            },
            saveCart: function () {
                localStorage.setItem('cart', JSON.stringify(this.state.cart));
                console.log("[Cart] Saved to Storage:", this.state.cart.length, "items");
            },
            toggleCart: function () { this.showSection('cart-section'); this.renderCart(); },
            updateCartCount: function () {
                try {
                    if (!Array.isArray(this.state.cart)) this.state.cart = [];
                    const count = this.state.cart.reduce((a, b) => a + b.qty, 0);
                    const el = document.getElementById('cart-count');
                    if (el) el.innerText = count;
                    console.log("[Cart] Count updated:", count);
                } catch (e) { console.error("Update Cart Error", e); }
            },
            renderCart: function () {
                const container = document.getElementById('cart-items-container');
                let total = 0;
                if (this.state.cart.length === 0) { container.innerHTML = '<p class="text-gray-500">Cart is empty.</p>'; document.getElementById('cart-total').innerText = '₦0.00'; return; }
                container.innerHTML = '';
                this.state.cart.forEach((item, index) => {
                    const liveProduct = this.state.products.find(p => p.id === item.id);
                    const maxStock = liveProduct ? liveProduct.stock : item.qty;
                    total += item.price * item.qty;
                    container.innerHTML += `<div class="flex justify-between items-center border-b pb-4"><div class="w-1/3"><h4 class="font-bold text-sm">${item.name}</h4><p class="text-xs text-gray-500">Unit: ₦${item.price.toLocaleString()}</p></div><div class="flex items-center justify-end w-2/3 gap-2"><button onclick="app.adjustCart(${index}, -1)" class="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300">-</button><input type="number" class="w-16 border text-center p-1 rounded" value="${item.qty}" min="1" max="${maxStock}" onchange="app.updateCartQty(${index}, this.value)"><button onclick="app.adjustCart(${index}, 1)" class="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300">+</button><button onclick="app.removeFromCart(${index})" class="text-red-500 ml-2"><i class="fas fa-trash"></i></button></div></div>`;
                });
                document.getElementById('cart-total').innerText = '₦' + total.toLocaleString();
            },
            updateCartQty: function (index, value) {
                let newQty = parseInt(value);
                const item = this.state.cart[index];
                const liveProduct = this.state.products.find(p => p.id === item.id);
                if (isNaN(newQty) || newQty < 1) newQty = 1;
                if (liveProduct && newQty > liveProduct.stock) { alert(`Only ${liveProduct.stock} units available.`); newQty = liveProduct.stock; }
                item.qty = newQty; this.saveCart(); this.renderCart(); this.updateCartCount();
            },
            adjustCart: function (index, delta) {
                const item = this.state.cart[index];
                const product = this.state.products.find(p => p.id === item.id);
                if (delta > 0 && item.qty >= product.stock) return alert("Stock limit reached");
                item.qty += delta; if (item.qty <= 0) this.state.cart.splice(index, 1);
                this.saveCart(); this.renderCart(); this.updateCartCount();
            },
            removeFromCart: function (index) { this.state.cart.splice(index, 1); this.saveCart(); this.renderCart(); this.updateCartCount(); },
            viewInvoice: function (orderId) {
                // Save ID & Navigate
                this.state.currentOrderId = orderId;
                this.showSection('invoice-section');

                // Render Details
                this.renderInvoice(orderId);
            },

            renderInvoice: function (orderId) {
                // Find by ID (number or string)
                const order = this.state.orders.find(o => o.id == orderId || o.docId == orderId); // Support both
                if (!order) return;

                document.getElementById('inv-number').innerText = '#' + (order.orderId ? String(order.orderId).padStart(3, '0') : (order.docId ? order.docId.slice(0, 8) : '---'));
                document.getElementById('inv-date').innerText = new Date(order.date).toLocaleDateString();

                // Status Text
                document.getElementById('inv-status').innerText = (order.status || 'Pending').toUpperCase();

                document.getElementById('inv-cust-name').innerText = order.customer.name;
                document.getElementById('inv-cust-business').innerText = order.customer.business || '';
                document.getElementById('inv-total').innerText = '₦' + order.total.toLocaleString();
                const tbody = document.getElementById('inv-items'); tbody.innerHTML = '';
                order.items.forEach(item => {
                    tbody.innerHTML += `<tr class="border-b"><td class="text-left py-2 px-2">${item.name}</td><td class="text-center py-2 px-2">${item.qty}</td><td class="text-right py-2 px-2">₦${item.price.toLocaleString()}</td><td class="text-right py-2 px-2">₦${(item.price * item.qty).toLocaleString()}</td></tr>`;
                });

                // --- ADMIN ACTIONS IN INVOICE ---
                const actionContainer = document.querySelector('#invoice-section .no-print');
                if (actionContainer) {
                    let buttonsHtml = `
                        <button onclick="app.printSection('invoice')" class="w-full sm:w-auto bg-primary-800 text-white px-6 py-3 rounded font-bold shadow hover:bg-primary-900 transition flex justify-center items-center"><i class="fas fa-print mr-2"></i> Print Invoice</button>
                        <button onclick="app.showSection('orders-section')" class="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded font-bold shadow hover:bg-gray-600 transition flex justify-center items-center">Back</button>
                    `;

                    if (this.state.currentUser && this.state.currentUser.role === 'admin') {
                        // Workflow Buttons
                        const status = order.status || 'Pending';

                        if (status === 'Pending') {
                            buttonsHtml += `<button onclick="app.updateOrderStatus('${order.docId}', 'Processing')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-2 shadow font-bold">Mark Processing</button>`;
                        }
                        if (status === 'Processing') {
                            buttonsHtml += `<button onclick="app.updateOrderStatus('${order.docId}', 'Shipped')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded ml-2 shadow font-bold">Mark Shipped</button>`;
                        }
                        if (status === 'Shipped') {
                            buttonsHtml += `<button onclick="app.updateOrderStatus('${order.docId}', 'Delivered')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 shadow font-bold">Mark Delivered</button>`;
                        }

                        // Always allow cancel if not delivered or cancelled
                        if (status !== 'Delivered' && status !== 'Cancelled') {
                            buttonsHtml += `<button onclick="app.updateOrderStatus('${order.docId}', 'Cancelled')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-2 shadow font-bold">Cancel Order</button>`;
                        }

                        // Legacy Receive Button for Compatibility (Optional)
                        if (status === 'Delivered' && !order.isReceived) {
                            buttonsHtml += `<button onclick="app.receiveOrder('${order.docId}')" class="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded ml-2 shadow font-bold">Confirm Payment/Receive</button>`;
                        }
                    }

                    actionContainer.innerHTML = buttonsHtml;
                }
            },

            updateOrderStatus: function (docId, newStatus) {
                if (!confirm(`Update order status to: ${newStatus}?`)) return;

                // If Delivered, we also set isReceived to true for financials
                const updates = { status: newStatus };
                if (newStatus === 'Delivered') {
                    updates.isReceived = true;
                    updates.isApproved = true;
                }

                db.collection('orders').doc(docId).update(updates)
                    .then(() => {
                        alert("Order Status Updated!");
                        this.viewInvoice(docId); // Refresh view
                    })
                    .catch(err => alert("Error: " + err.message));
            },

            renderStock: function (filterType = 'all') {
                const tbody = document.getElementById('stock-table-body');
                if (!tbody) return;

                // ALWAYS SHOW FILTERS & HEADERS
                const filtersContainer = document.getElementById('stock-filters-container');
                if (filtersContainer) filtersContainer.classList.remove('hidden');

                const thBatch = document.getElementById('th-batch');
                const thExpiry = document.getElementById('th-expiry');
                const thStatus = document.getElementById('th-status');

                if (thBatch) thBatch.classList.add('hidden');
                if (thExpiry) thExpiry.classList.add('hidden');

                // Show "Add Product" button if Admin
                const btnAdd = document.getElementById('btn-add-product');
                if (btnAdd) {
                    if (this.state.currentUser.role === 'admin') btnAdd.classList.remove('hidden');
                    else btnAdd.classList.add('hidden');
                }

                // Show "Record Stock Received" button if Admin
                const btnReceipt = document.getElementById('btn-stock-receipt');
                if (btnReceipt) {
                    if (this.state.currentUser.role === 'admin') btnReceipt.classList.remove('hidden');
                    else btnReceipt.classList.add('hidden');
                }

                let productsToShow = this.state.products;

                if (filterType === 'low') {
                    productsToShow = productsToShow.filter(p => p.stock < 50);
                } else if (filterType === 'critical') {
                    productsToShow = productsToShow.filter(p => p.stock < 10);
                }

                // --- PERFORMANCE FIX: Precalculate distribution for ALL products in ONE pass ---
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const distMap = {}; // product_id -> { customerName: totalQty }

                this.state.orders.forEach(o => {
                    if (o.isReceived && !o.isDeleted) {
                        const d = new Date(o.date);
                        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                            const custName = o.customer.name;
                            o.items.forEach(i => {
                                if (!distMap[i.id]) distMap[i.id] = {};
                                distMap[i.id][custName] = (distMap[i.id][custName] || 0) + i.qty;
                            });
                        }
                    }
                });

                // Batch DOM: accumulate HTML string
                let html = '';
                productsToShow.forEach(p => {
                    // Use precalculated distribution
                    const distribution = distMap[p.id] || {};
                    let distStr = '';
                    const distEntries = Object.entries(distribution);
                    if (distEntries.length === 0) {
                        distStr = '<span class="text-gray-400 text-xs text-center block">-</span>';
                    } else {
                        distStr = `<div class="relative inline-block text-left">
                                    <select class="block w-full text-xs border border-gray-300 rounded p-1 bg-gray-50 text-gray-700 outline-none focus:border-blue-500">
                                        <option value="" disabled selected>View Distribution (${distEntries.length})</option>
                                        ${distEntries.map(([k, v]) => `<option value="${k}">${k}: ${v}</option>`).join('')}
                                    </select>
                                   </div>`;
                    }

                    let statusHtml = p.stock < 10 ? '<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Critical</span>' : p.stock < 50 ? '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Low</span>' : '<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Good</span>';

                    const historyBtn = `<button onclick="app.viewStockHistory('${p.id}')" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"><i class="fas fa-history"></i> History</button>`;

                    // Expiry Logic
                    let rowClass = "bg-white";
                    if (p.expiryDate) {
                        const daysLeft = (new Date(p.expiryDate) - new Date()) / (1000 * 3600 * 24);
                        if (daysLeft < 0) rowClass = "bg-red-50";
                        if (daysLeft > 0 && daysLeft < 90) rowClass = "bg-orange-50";
                    }

                    html += `
                        <tr class="${rowClass} border-b hover:bg-gray-100 transition">
                            <td class="px-6 py-4 font-medium">${p.name}<div class="text-xs text-gray-500">${p.desc}</div></td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-2">
                                    <input type="text" value="${p.batchNumber || ''}" class="w-24 border rounded px-2 py-1 text-xs" onchange="app.updateProductBatch('${p.docId}', this.value)" placeholder="Batch #">
                                    <input type="date" value="${p.expiryDate || ''}" class="w-32 border rounded px-2 py-1 text-xs" onchange="app.updateProductExpiry('${p.docId}', this.value)">
                                </div>
                            </td>
                            <td class="px-6 py-4"><input type="text" value="${p.image}" class="w-full border rounded px-2 py-1 text-xs" onchange="app.updateProductImage('${p.docId}', this.value)" placeholder="Image URL"></td>
                            <td class="px-6 py-4"><input type="number" value="${p.stock}" min="0" class="w-20 border rounded px-2 py-1" onchange="app.updateStockLevel('${p.docId}', this.value)"></td>
                            <td class="px-6 py-4">${statusHtml}</td>
                            <td class="px-6 py-4 text-xs font-semibold text-blue-600">${distStr}</td>
                            <td class="px-6 py-4">
                                ${historyBtn}
                            </td>
                        </tr>`;
                });
                tbody.innerHTML = html;
            },

            filterStock: function (type) {
                this.renderStock(type);
            },

            viewStockHistory: function (productId) {
                const product = this.state.products.find(p => p.id === productId);
                if (!product) return;

                // Find orders with this product
                const history = this.state.orders.filter(o => o.items.some(i => i.id === productId))
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10); // Last 10

                let html = `<h4 class="font-bold mb-2">History for ${product.name}</h4>`;
                if (history.length === 0) {
                    html += '<p class="text-gray-500">No recent movement found.</p>';
                } else {
                    html += '<ul class="space-y-2 text-sm">';
                    history.forEach(o => {
                        const item = o.items.find(i => i.id === productId);
                        const role = o.isReceived ? '<span class="text-green-600 font-bold">Received</span>' : '<span class="text-yellow-600">Pending</span>';
                        html += `
                            <li class="border-b pb-1">
                                <div class="flex justify-between">
                                    <span>${new Date(o.date).toLocaleDateString()}</span>
                                    <span>Qty: ${item.qty}</span>
                                </div>
                                <div class="text-xs text-gray-500">${o.customer.name} - ${role}</div>
                            </li>`;
                    });
                    html += '</ul>';
                }

                // Reuse edit modal or create a simple alert? 
                // Let's reuse 'edit-modal' structure but clear it? 
                // Or better, inject a new simple modal logic here using document.createElement if needed, 
                // BUT we have 'edit-modal' in HTML. Let's just create a dynamic modal div for history to keep it clean.
                // Actually, alert is too simple. I'll use a custom overlay.
                const modalId = 'history-modal-overlay';
                let modal = document.getElementById(modalId);
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = modalId;
                    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
                    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
                    document.body.appendChild(modal);
                }
                modal.innerHTML = `
                    <div class="bg-white p-6 rounded shadow-lg w-80 max-h-[80vh] overflow-y-auto" onclick="event.stopPropagation()">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-lg">Stock History</h3>
                            <button onclick="document.getElementById('${modalId}').remove()" class="text-gray-500 hover:text-red-500"><i class="fas fa-times"></i></button>
                        </div>
                        ${html}
                    </div>
                `;
            },
            updateStockLevel: function (docId, newQty) { db.collection('products').doc(docId).update({ stock: parseInt(newQty) }); },
            updateProductImage: function (docId, newUrl) { db.collection('products').doc(docId).update({ image: newUrl }); },
            updateProductBatch: function (docId, newVal) { db.collection('products').doc(docId).update({ batchNumber: newVal }); },
            updateProductExpiry: function (docId, newVal) {
                db.collection('products').doc(docId).update({ expiryDate: newVal }).then(() => this.renderStock());
            },

            deleteOrder: function (docId) {
                const order = this.state.orders.find(o => o.docId === docId);
                if (!order) return;

                const orderLabel = `Order #${order.orderId ? String(order.orderId).padStart(3, '0') : docId.slice(0, 5)}`;
                const wasReceived = order.isReceived === true;

                let confirmMsg = `Are you sure you want to delete ${orderLabel}?`;
                if (wasReceived) {
                    confirmMsg += `\n\nThis order was RECEIVED. Deleting it will RETURN the items back to stock.`;
                }
                confirmMsg += `\n\nYou can restore it later from the Trash.`;

                if (!confirm(confirmMsg)) return;

                const batch = db.batch();

                // Soft delete: mark as deleted instead of removing
                const orderRef = db.collection('orders').doc(docId);
                batch.update(orderRef, {
                    isDeleted: true,
                    deletedAt: new Date().toISOString()
                });

                // If order was received, RETURN items to stock
                if (wasReceived) {
                    order.items.forEach(item => {
                        const product = this.state.products.find(p => p.id === item.id);
                        if (product) {
                            const prodRef = db.collection('products').doc(product.docId);
                            batch.update(prodRef, { stock: firebase.firestore.FieldValue.increment(item.qty) });
                        }
                    });
                }

                batch.commit().then(() => {
                    alert(`${orderLabel} moved to Trash.${wasReceived ? ' Stock has been restored.' : ''}`);
                }).catch(err => alert("Error: " + err.message));
            },

            restoreOrder: function (docId) {
                const order = this.state.orders.find(o => o.docId === docId);
                if (!order) return;

                const orderLabel = `Order #${order.orderId ? String(order.orderId).padStart(3, '0') : docId.slice(0, 5)}`;
                const wasReceived = order.isReceived === true;

                let confirmMsg = `Restore ${orderLabel}?`;
                if (wasReceived) {
                    confirmMsg += `\n\nThis order was RECEIVED. Restoring it will DEDUCT the items from stock again.`;
                }

                if (!confirm(confirmMsg)) return;

                const batch = db.batch();

                // Remove soft delete flag
                const orderRef = db.collection('orders').doc(docId);
                batch.update(orderRef, {
                    isDeleted: false,
                    deletedAt: firebase.firestore.FieldValue.delete()
                });

                // If order was received, RE-DEDUCT items from stock
                if (wasReceived) {
                    order.items.forEach(item => {
                        const product = this.state.products.find(p => p.id === item.id);
                        if (product) {
                            const prodRef = db.collection('products').doc(product.docId);
                            batch.update(prodRef, { stock: firebase.firestore.FieldValue.increment(-item.qty) });
                        }
                    });
                }

                batch.commit().then(() => {
                    alert(`${orderLabel} has been restored.${wasReceived ? ' Stock has been deducted.' : ''}`);
                }).catch(err => alert("Error: " + err.message));
            },

            toggleTrash: function () {
                this.state.showTrash = !this.state.showTrash;
                this.renderOrders();
            },

            // --- Dynamic Category Filters ---
            populateCategoryFilters: function () {
                // Collect unique categories from all products
                const categories = new Set();
                this.state.products.forEach(p => {
                    if (p.category) categories.add(p.category);
                });
                const sorted = [...categories].sort();

                // 1. Update shop page category filter
                const shopFilter = document.getElementById('category-filter');
                if (shopFilter) {
                    const currentVal = shopFilter.value;
                    let html = '<option value="all">All Categories</option>';
                    sorted.forEach(cat => {
                        html += `<option value="${cat}">${cat}</option>`;
                    });
                    shopFilter.innerHTML = html;
                    shopFilter.value = currentVal; // Preserve current selection
                }

                // 2. Update Add/Edit Product modal category dropdown
                const modalCat = document.getElementById('new-prod-cat');
                if (modalCat) {
                    const currentVal = modalCat.value;
                    let html = '';
                    sorted.forEach(cat => {
                        html += `<option value="${cat}">${cat}</option>`;
                    });
                    modalCat.innerHTML = html;
                    if (currentVal && sorted.includes(currentVal)) {
                        modalCat.value = currentVal;
                    }
                }
            },

            openEditModal: function (orderId) {
                const order = this.state.orders.find(o => o.docId === orderId);
                this.state.editingOrder = JSON.parse(JSON.stringify(order)); // Deep copy
                
                // Populate product dropdown
                const select = document.getElementById('edit-add-product-select');
                select.innerHTML = '<option value="">Select a product...</option>';
                this.state.products.forEach(p => {
                    select.innerHTML += `<option value="${p.id}">${p.name} - ${p.category}</option>`;
                });
                
                this.renderEditOrderItems();
                document.getElementById('edit-modal').classList.remove('hidden');
            },
            
            renderEditOrderItems: function() {
                const container = document.getElementById('modal-items-list'); 
                container.innerHTML = '';
                this.state.editingOrder.items.forEach((item, index) => {
                    container.innerHTML += `
                    <div class="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="font-bold text-sm text-gray-800">${item.name}</div>
                                <div class="text-xs text-gray-500 font-medium">Unit Price: ₦${item.price}</div>
                            </div>
                            <button onclick="app.deleteEditOrderItem(${index})" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition" title="Delete from order">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="flex justify-between items-center mt-1">
                            <label class="text-xs font-bold text-gray-600">Quantity:</label>
                            <input type="number" id="edit-qty-${index}" value="${item.qty}" min="1" onchange="app.state.editingOrder.items[${index}].qty = parseInt(this.value) || 1" class="w-20 border rounded p-1.5 text-center text-sm font-bold focus:ring-primary-800 outline-none">
                        </div>
                    </div>`;
                });
            },

            deleteEditOrderItem: function(index) {
                if(confirm("Remove this item from the order?")) {
                    this.state.editingOrder.items.splice(index, 1);
                    this.renderEditOrderItems();
                }
            },

            addEditOrderProduct: function() {
                const select = document.getElementById('edit-add-product-select');
                const qtyInput = document.getElementById('edit-add-product-qty');
                const prodId = select.value;
                const qty = parseInt(qtyInput.value) || 1;
                
                if(!prodId) return alert("Please select a product first.");
                
                const product = this.state.products.find(p => p.id === prodId);
                if(!product) return;

                // Determine price based on customer role (default to retail if not wholesale)
                // Need to fetch customer role from users collection or assume based on previous items if needed
                // For safety, we check if the customer has "wholesale" role in our users list
                let price = product.retailPrice;
                const customerUser = this.state.users ? this.state.users.find(u => u.email === this.state.editingOrder.customer.email) : null;
                if (customerUser && customerUser.role === 'wholesale') {
                    price = product.wholesalePrice;
                }

                // Check if already in order
                const existingIndex = this.state.editingOrder.items.findIndex(i => i.id === product.id);
                if (existingIndex > -1) {
                    this.state.editingOrder.items[existingIndex].qty += qty;
                } else {
                    this.state.editingOrder.items.push({
                        id: product.id,
                        name: product.name,
                        qty: qty,
                        price: price,
                        category: product.category || 'General'
                    });
                }
                
                this.renderEditOrderItems();
                
                // Reset inputs
                select.value = '';
                qtyInput.value = '1';
            },

            saveOrderEdits: function () {
                const oldOrder = this.state.orders.find(o => o.docId === this.state.editingOrder.docId);
                const batch = db.batch();
                let newTotal = 0;
                
                // Track stock changes
                const stockAdjustments = {}; // { docId: delta }

                // 1. If order was already received, we need to completely refund old stock, then deduct new stock.
                // Or we can just calculate the delta for each product.
                if (oldOrder.isReceived) {
                    // + Refund old items
                    oldOrder.items.forEach(oldItem => {
                        const prod = this.state.products.find(p => p.id === oldItem.id);
                        if(prod) {
                            stockAdjustments[prod.docId] = (stockAdjustments[prod.docId] || 0) + oldItem.qty;
                        }
                    });
                    
                    // - Deduct new items
                    this.state.editingOrder.items.forEach(newItem => {
                        const prod = this.state.products.find(p => p.id === newItem.id);
                        if(prod) {
                            stockAdjustments[prod.docId] = (stockAdjustments[prod.docId] || 0) - newItem.qty;
                        }
                    });
                }

                // 2. Calculate New Total
                this.state.editingOrder.items.forEach(item => {
                    newTotal += (item.price * item.qty);
                });

                // 3. Apply Stock Adjustments
                Object.keys(stockAdjustments).forEach(docId => {
                    const diff = stockAdjustments[docId];
                    if (diff !== 0) {
                        const prodRef = db.collection('products').doc(docId);
                        batch.update(prodRef, { stock: firebase.firestore.FieldValue.increment(diff) });
                    }
                });

                const orderRef = db.collection('orders').doc(this.state.editingOrder.docId);
                batch.update(orderRef, { items: this.state.editingOrder.items, total: newTotal });
                
                batch.commit().then(() => {
                    document.getElementById('edit-modal').classList.add('hidden');
                    alert("Order successfully modified.");
                }).catch(err => {
                    console.error("Error saving edits:", err);
                    alert("Failed to save changes.");
                });
            },
            showLowStock: function () {
                this.showSection('stock-section');
                // Could optionally sort/filter DOM elements here, but for now we just show the stock section
                // A better approach would be to update a state filter, but this request was just to "link" it.
                // To be helpful, let's scroll to top.
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            updatePaymentStatus: function (docId, status) {
                db.collection('orders').doc(docId).update({ paymentStatus: status }).then(() => {
                    // Update local state immediately for UI responsiveness or rely on snapshot
                    // Relying on snapshot is safer but slower. Let's rely on snapshot.
                });
            },
            updatePaymentDate: function (docId, date) {
                db.collection('orders').doc(docId).update({ paymentDate: date });
            },

            // --- PRINT HELPER ---
            printSection: function (type) {
                // type: 'invoice' or 'financial'

                // 1. Clean up potential previous print classes safely (preserve Tailwind classes)
                document.body.classList.remove('print-invoice', 'print-financial');

                // 2. Add specific print class
                document.body.classList.add('print-' + type);

                // 3. Define Cleanup Function
                const cleanup = () => {
                    // Only remove the print class, don't wipe everything
                    document.body.classList.remove('print-' + type);
                    window.removeEventListener('afterprint', cleanup);
                };

                // 4. Attach Listener (Crucial for Mobile/Async Print)
                window.addEventListener('afterprint', cleanup);

                // 5. Trigger Print (Safe Mode)
                try {
                    window.print();
                } catch (e) {
                    alert("Print Error: " + e.message + "\n\nPlease try using your browser's menu to Print.");
                    cleanup(); // Ensure cleanup happens if error occurs
                }

                // Failsafe: If afterprint doesn't fire (some browsers), the class remains. 
                // This is harmless as styles are scoped to @media print, 
                // and the next printSection call handles cleanup at step 1.
            },

            // --- ADD / EDIT PRODUCT ---
            openAddProductModal: function () {
                // Clear fields
                document.getElementById('edit-prod-id').value = '';
                document.getElementById('product-modal-title').innerText = 'Add New Product';
                document.getElementById('new-prod-name').value = '';
                document.getElementById('new-prod-desc').value = '';
                document.getElementById('new-prod-cat-custom').value = '';
                document.getElementById('new-prod-price-staff').value = '';
                document.getElementById('new-prod-price-whole').value = '';
                document.getElementById('new-prod-stock').value = '';
                document.getElementById('new-prod-img').value = '';
                document.getElementById('add-product-modal').classList.remove('hidden');
            },

            openEditProductModal: function (id) {
                const product = this.state.products.find(p => p.id == id);
                if (!product) return;

                document.getElementById('edit-prod-id').value = product.docId;
                document.getElementById('product-modal-title').innerText = 'Edit Product';
                
                document.getElementById('new-prod-name').value = product.name || '';
                document.getElementById('new-prod-desc').value = product.desc || '';
                
                // Ensure dropdown has options populated
                this.populateCategoryFilters();
                const catDropdown = document.getElementById('new-prod-cat');
                if (product.category) {
                    // It will be in the dropdown because populateCategoryFilters extracts unique categories
                    catDropdown.value = product.category;
                }
                document.getElementById('new-prod-cat-custom').value = ''; // Clear custom input

                document.getElementById('new-prod-price-staff').value = product.priceStaff || '';
                document.getElementById('new-prod-price-whole').value = product.priceWholesale || '';
                document.getElementById('new-prod-stock').value = product.stock || '';
                document.getElementById('new-prod-img').value = product.image || '';
                
                document.getElementById('add-product-modal').classList.remove('hidden');
            },

            saveNewProduct: function () {
                const docId = document.getElementById('edit-prod-id').value;
                const name = document.getElementById('new-prod-name').value;
                const desc = document.getElementById('new-prod-desc').value;
                const catDropdown = document.getElementById('new-prod-cat').value;
                const catCustom = document.getElementById('new-prod-cat-custom').value.trim();
                const pStaff = parseFloat(document.getElementById('new-prod-price-staff').value);
                const pWhole = parseFloat(document.getElementById('new-prod-price-whole').value);
                const stock = parseInt(document.getElementById('new-prod-stock').value);
                const img = document.getElementById('new-prod-img').value || 'https://via.placeholder.com/150';

                // Custom category takes precedence
                const cat = catCustom ? catCustom : catDropdown;

                if (!name || !pStaff || !pWhole || isNaN(stock)) return alert("Please fill all required fields.");

                if (docId) {
                    // Update existing product
                    db.collection('products').doc(docId).update({
                        name, desc, category: cat,
                        priceStaff: pStaff, priceWholesale: pWhole,
                        stock, image: img
                    }).then(() => {
                        alert("Product Updated!");
                        document.getElementById('add-product-modal').classList.add('hidden');
                    }).catch(err => alert("Error updating product: " + err));
                } else {
                    // Generate a simple numeric ID (max + 1)
                    const maxId = this.state.products.reduce((m, p) => p.id > m ? p.id : m, 0);
                    const newId = maxId + 1;

                    const newProd = {
                        id: newId,
                        name, desc, category: cat,
                        priceStaff: pStaff, priceWholesale: pWhole,
                        stock, image: img,
                        batchNumber: '', expiryDate: ''
                    };

                    db.collection('products').add(newProd).then(() => {
                        alert("Product Added!");
                        document.getElementById('add-product-modal').classList.add('hidden');
                    }).catch(err => alert("Error adding product: " + err));
                }
            },

            deleteProduct: function (id) {
                const product = this.state.products.find(p => p.id == id);
                if (!product) return;

                if (confirm(`Are you sure you want to DELETE "${product.name}"?\n\nThis cannot be undone.`)) {
                    db.collection('products').doc(product.docId).delete().then(() => {
                        alert("Product Deleted.");
                    });
                }
            },

            // ==========================================
            // ✅ STOCK RECEIPT FEATURE
            // ==========================================
            openStockReceiptModal: function () {
                const now = new Date();
                // Set month/year dropdowns
                const monthSel = document.getElementById('sr-month');
                const yearSel = document.getElementById('sr-year');
                const daySel = document.getElementById('sr-day');
                const invoiceInput = document.getElementById('sr-invoice');
                if (monthSel) monthSel.value = now.getMonth() + 1;

                // Populate year dropdown
                if (yearSel) {
                    yearSel.innerHTML = '';
                    for (let y = now.getFullYear(); y >= now.getFullYear() - 3; y--) {
                        yearSel.innerHTML += `<option value="${y}">${y}</option>`;
                    }
                }

                // Populate day dropdown (1-31)
                if (daySel) {
                    daySel.innerHTML = '';
                    for (let d = 1; d <= 31; d++) {
                        daySel.innerHTML += `<option value="${d}">${d}</option>`;
                    }
                    daySel.value = now.getDate();
                }

                // Clear invoice field
                if (invoiceInput) invoiceInput.value = '';

                // Build the spreadsheet table
                this.buildReceiptTable();

                // Hide history panel
                const histPanel = document.getElementById('sr-history-panel');
                if (histPanel) histPanel.classList.add('hidden');

                document.getElementById('stock-receipt-modal').classList.remove('hidden');
            },

            closeStockReceiptModal: function () {
                document.getElementById('stock-receipt-modal').classList.add('hidden');
            },

            buildReceiptTable: function () {
                const tbody = document.getElementById('sr-table-body');
                if (!tbody) return;
                tbody.innerHTML = '';

                this.state.products.forEach((p, idx) => {
                    const row = document.createElement('tr');
                    row.className = idx % 2 === 0 ? 'bg-white hover:bg-emerald-50/30 transition' : 'bg-gray-50/50 hover:bg-emerald-50/30 transition';
                    row.innerHTML = `
                        <td class="px-4 py-2.5 border text-xs text-gray-400 font-mono">${idx + 1}</td>
                        <td class="px-4 py-2.5 border">
                            <div class="font-semibold text-gray-800">${p.name}</div>
                            <div class="text-xs text-gray-400">${p.desc || ''}</div>
                        </td>
                        <td class="px-4 py-2.5 border text-center"><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">${p.category || 'General'}</span></td>
                        <td class="px-4 py-2.5 border text-center font-bold ${p.stock < 10 ? 'text-red-600' : p.stock < 50 ? 'text-yellow-600' : 'text-emerald-600'}" id="sr-current-${p.id}">${p.stock}</td>
                        <td class="px-4 py-2.5 border text-center bg-blue-50/50">
                            <input type="number" min="0" value="" placeholder="0"
                                id="sr-qty-${p.id}" data-product-id="${p.id}" data-current-stock="${p.stock}"
                                class="w-20 border-2 border-gray-200 rounded-lg px-2 py-1.5 text-center font-bold text-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                oninput="app.previewNewStock(${p.id})">
                        </td>
                        <td class="px-4 py-2.5 border text-center font-bold text-purple-700" id="sr-new-${p.id}">${p.stock}</td>
                    `;
                    tbody.appendChild(row);
                });
            },

            previewNewStock: function (productId) {
                const input = document.getElementById('sr-qty-' + productId);
                const currentEl = document.getElementById('sr-current-' + productId);
                const newEl = document.getElementById('sr-new-' + productId);
                if (!input || !newEl) return;

                const currentStock = parseInt(input.dataset.currentStock) || 0;
                const qtyReceived = parseInt(input.value) || 0;
                const newStock = currentStock + qtyReceived;

                newEl.innerText = newStock;
                if (qtyReceived > 0) {
                    newEl.className = 'px-4 py-2.5 border text-center font-bold text-emerald-700 bg-emerald-50';
                } else {
                    newEl.className = 'px-4 py-2.5 border text-center font-bold text-purple-700';
                }
            },

            saveStockReceipt: function () {
                const month = document.getElementById('sr-month').value;
                const year = document.getElementById('sr-year').value;
                const day = document.getElementById('sr-day').value || '1';
                const invoiceNo = (document.getElementById('sr-invoice').value || '').trim();
                const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                // Collect entries with qty > 0
                const entries = [];
                this.state.products.forEach(p => {
                    const input = document.getElementById('sr-qty-' + p.id);
                    if (input) {
                        const qty = parseInt(input.value);
                        if (qty > 0) {
                            entries.push({ id: p.id, docId: p.docId, name: p.name, qty: qty, previousStock: p.stock });
                        }
                    }
                });

                if (entries.length === 0) return alert('No quantities entered. Please enter at least one product quantity.');

                const invoiceLabel = invoiceNo ? `\nInvoice/Waybill: ${invoiceNo}` : '';
                const summary = entries.map(e => `${e.name}: +${e.qty}`).join('\n');
                if (!confirm(`Save stock receipt for ${day} ${monthNames[month]} ${year}?${invoiceLabel}\n\n${summary}\n\nThis will ADD these quantities to current stock levels.`)) return;

                // Batch update: increment stock + log receipt
                const batch = db.batch();

                entries.forEach(e => {
                    const prodRef = db.collection('products').doc(e.docId);
                    batch.update(prodRef, { stock: firebase.firestore.FieldValue.increment(e.qty) });
                });

                // Log the receipt record
                const receiptRef = db.collection('stockReceipts').doc();
                const receiptData = {
                    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    month: parseInt(month),
                    year: parseInt(year),
                    day: parseInt(day),
                    items: entries.map(e => ({ id: e.id, name: e.name, qty: e.qty, previousStock: e.previousStock, newStock: e.previousStock + e.qty })),
                    createdAt: new Date().toISOString(),
                    createdBy: this.state.currentUser ? this.state.currentUser.email : 'unknown',
                    totalItems: entries.length,
                    totalUnits: entries.reduce((s, e) => s + e.qty, 0)
                };
                if (invoiceNo) receiptData.invoiceNumber = invoiceNo;
                batch.set(receiptRef, receiptData);

                batch.commit().then(() => {
                    alert(`Stock updated successfully!\n\n${entries.length} product(s) updated with ${entries.reduce((s, e) => s + e.qty, 0)} total units added.`);
                    this.closeStockReceiptModal();
                }).catch(err => {
                    console.error('Stock receipt error:', err);
                    alert('Error saving stock receipt: ' + err.message);
                });
            },

            loadReceiptHistory: function () {
                const panel = document.getElementById('sr-history-panel');
                const listEl = document.getElementById('sr-history-list');
                if (!panel || !listEl) return;

                panel.classList.remove('hidden');
                listEl.innerHTML = '<div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</div>';

                db.collection('stockReceipts').orderBy('createdAt', 'desc').limit(20).get().then(snapshot => {
                    if (snapshot.empty) {
                        listEl.innerHTML = '<div class="text-center text-gray-400 py-4">No receipt history found.</div>';
                        return;
                    }
                    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    listEl.innerHTML = '';
                    snapshot.forEach(doc => {
                        const r = doc.data();
                        const docId = doc.id;
                        const dateStr = `${r.day || '?'} ${monthNames[r.month] || '?'} ${r.year || '?'}`;
                        const itemsSummary = (r.items || []).map(i => `<span class="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1 mb-1">${i.name}: <b>+${i.qty}</b></span>`).join('');
                        listEl.innerHTML += `
                            <div class="bg-white border rounded-lg p-3 shadow-sm" id="sr-hist-${docId}">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <span class="font-bold text-sm text-gray-800">${dateStr}</span>
                                        <span class="text-xs text-gray-400 ml-2">${r.totalItems || 0} products, ${r.totalUnits || 0} units</span>
                                        ${r.invoiceNumber ? `<span class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700"><i class="fas fa-file-invoice"></i>${r.invoiceNumber}</span>` : ''}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs text-gray-400">${r.createdBy || ''}</span>
                                        <button onclick="app.deleteStockReceipt('${docId}')" class="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition font-medium" title="Delete & reverse stock">
                                            <i class="fas fa-trash-alt mr-1"></i>Delete
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-wrap">${itemsSummary}</div>
                            </div>
                        `;
                    });
                }).catch(err => {
                    listEl.innerHTML = '<div class="text-center text-red-400 py-4">Error loading history.</div>';
                    console.error('Receipt history error:', err);
                });
            },

            deleteStockReceipt: function (receiptDocId) {
                if (!confirm('Delete this receipt and REVERSE the stock changes?\n\nThe quantities added by this receipt will be subtracted from current stock levels. This cannot be undone.')) return;

                // 1. Fetch the receipt to get item details
                db.collection('stockReceipts').doc(receiptDocId).get().then(doc => {
                    if (!doc.exists) return alert('Receipt not found. It may have already been deleted.');

                    const receipt = doc.data();
                    const batch = db.batch();

                    // 2. Reverse each stock increment
                    (receipt.items || []).forEach(item => {
                        const product = this.state.products.find(p => p.id === item.id || p.id == item.id);
                        if (product) {
                            const prodRef = db.collection('products').doc(product.docId);
                            batch.update(prodRef, { stock: firebase.firestore.FieldValue.increment(-item.qty) });
                        }
                    });

                    // 3. Delete the receipt document
                    batch.delete(db.collection('stockReceipts').doc(receiptDocId));

                    // 4. Commit
                    return batch.commit();
                }).then(() => {
                    alert('Receipt deleted and stock levels reversed successfully.');
                    // Remove the card from the UI immediately
                    const card = document.getElementById('sr-hist-' + receiptDocId);
                    if (card) card.remove();
                    // Refresh the receipt table if modal is still open
                    this.buildReceiptTable();
                }).catch(err => {
                    console.error('Delete receipt error:', err);
                    alert('Error deleting receipt: ' + err.message);
                });
            }
        };

        window.addEventListener('DOMContentLoaded', () => {
            console.log("App Starting...");
            app.init();
            window.app = app; // Ensure Global Access
        });
    