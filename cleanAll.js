import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7-2eUXiARjiM0jx8cwPk7Kug7_zVCIPk",
  authDomain: "recloud-erp.firebaseapp.com",
  projectId: "recloud-erp",
  storageBucket: "recloud-erp.firebasestorage.app",
  messagingSenderId: "966817109587",
  appId: "1:966817109587:web:cf13129b554de24f9e98a6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS_TO_WIPE = [
  'employees', 'shifts', 'leaveRequests', 'payslips', 'documents', 'reviews',
  'applicants', 'jobs', 'customers', 'deals', 'invoices', 'products',
  'stockMovements', 'warehouses', 'suppliers', 'purchaseOrders', 'branchOrders',
  'sales', 'b2b_orders', 'ledger', 'expenses', 'chat_rooms', 'chat_messages',
  'history', 'webhook_configs'
];

async function wipeAllData() {
  console.log("Starting full FACTORY RESET across all workspaces...");
  
  try {
    const orgsRef = collection(db, 'organizations');
    const orgsSnapshot = await getDocs(orgsRef);
    let totalDeleted = 0;

    for (const orgDoc of orgsSnapshot.docs) {
      const tenantId = orgDoc.id;
      console.log(`\nProcessing workspace: ${tenantId}`);
      
      for (const colName of COLLECTIONS_TO_WIPE) {
        const subColRef = collection(db, `organizations/${tenantId}/${colName}`);
        const subColSnap = await getDocs(subColRef);
        for (const docSnap of subColSnap.docs) {
          await deleteDoc(doc(db, `organizations/${tenantId}/${colName}`, docSnap.id));
          totalDeleted++;
        }
      }
      // Delete the organization document itself
      await deleteDoc(doc(db, 'organizations', tenantId));
      console.log(`Deleted organization: ${tenantId}`);
      totalDeleted++;
    }

    // Delete Users
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    for (const userDoc of usersSnapshot.docs) {
      await deleteDoc(doc(db, 'users', userDoc.id));
      console.log(`Deleted user profile: ${userDoc.id}`);
      totalDeleted++;
    }
    
    console.log(`\n✅ FACTORY RESET complete! Total documents deleted: ${totalDeleted}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during data wipe:", err);
    process.exit(1);
  }
}

wipeAllData();
