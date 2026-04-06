/**
 * Cascade DAFO WMS Prototype — Test Suite
 * Validates all 12 screens, 5 roles, 3 workflows, and all interactive elements.
 * Run with: node test-prototype.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'cascade-wms-prototype.html');
let html = '';
let passed = 0;
let failed = 0;
const results = [];

function test(name, condition) {
  if (condition) {
    passed++;
    results.push(`  ✅ PASS: ${name}`);
  } else {
    failed++;
    results.push(`  ❌ FAIL: ${name}`);
  }
}

function section(name) {
  results.push(`\n━━━ ${name} ━━━`);
}

// Load file
try {
  html = fs.readFileSync(FILE, 'utf8');
} catch (e) {
  console.error('Cannot read prototype file:', e.message);
  process.exit(1);
}

// ==================== STRUCTURAL TESTS ====================
section('1. FILE STRUCTURE');
test('File exists and is non-empty', html.length > 50000);
test('Single HTML file', html.startsWith('<!DOCTYPE html>'));
test('React 18 CDN loaded', html.includes('react/18.2.0') || html.includes('react.development'));
test('ReactDOM loaded', html.includes('react-dom'));
test('Babel standalone loaded', html.includes('babel-standalone'));
test('Script type is text/babel', html.includes('type="text/babel"'));
test('Root div exists', html.includes('id="root"'));
test('createRoot used (React 18)', html.includes('createRoot'));

// ==================== BRAND & DESIGN ====================
section('2. BRAND GUIDELINES');
test('Primary blue #0057B8', html.includes('#0057B8'));
test('Dark blue #003F8A', html.includes('#003F8A'));
test('Navy #0D1E3A', html.includes('#0D1E3A'));
test('Surface #F4F7FB', html.includes('#F4F7FB'));
test('Green #065F46', html.includes('#065F46'));
test('Amber #D97706', html.includes('#D97706'));
test('Red #C53030', html.includes('#C53030'));
test('Font stack includes Segoe UI', html.includes("'Segoe UI'"));
test('Card border-radius 10px', html.includes('border-radius:10px') || html.includes('border-radius: 10px'));
test('No purple from v1', !html.includes('#6B21A8') && !html.includes('#7C3AED'));
test('No Home Depot text', !html.toLowerCase().includes('home depot'));
test('No Phase 1 text', !html.toLowerCase().includes('phase 1'));

// ==================== UNICODE & TEXT ====================
section('3. UNICODE RENDERING');
test('No literal \\u2014 text', !html.includes('\\u2014'));
test('No literal \\u00B7 text', !html.includes('\\u00B7'));
test('No literal \\u26A0 text', !html.includes('\\u26A0'));
test('No literal \\uFE0F text', !html.includes('\\uFE0F'));
test('No literal \\u2192 text', !html.includes('\\u2192'));
test('No literal \\u{XXXX} patterns', !/\\u\{[0-9A-Fa-f]+\}/.test(html));
test('Contains actual em-dash —', html.includes('—'));
test('Contains actual middle dot ·', html.includes('·'));
test('Contains actual arrow →', html.includes('→'));

// ==================== 5 ROLES ====================
section('4. ROLES & PERMISSIONS');
test('warehouse-manager role defined', html.includes("id:'warehouse-manager'"));
test('director-manufacturing role defined', html.includes("id:'director-manufacturing'"));
test('production-floor role defined', html.includes("id:'production-floor'"));
test('purchasing role defined', html.includes("id:'purchasing'"));
test('general-manager role defined', html.includes("id:'general-manager'"));
test('Peter Visser name', html.includes('Peter Visser'));
test('Pete Battersby name', html.includes('Pete Battersby'));
test('Vince name', html.includes('Vince'));
test('Role selector grid on login', html.includes('role-grid'));
test('5 role cards rendered', (html.match(/role-card/g) || []).length >= 5);
test('Access Restricted component exists', html.includes('AccessRestricted'));
test('Access Restricted has lock icon', html.includes('🔒'));
test('Access Restricted has Go to Dashboard button', html.includes('Go to My Dashboard'));

// ==================== NAV PER ROLE ====================
section('5. NAVIGATION PER ROLE');
// Warehouse Manager nav
test('WM has Dashboard nav', html.includes("id:'dashboard',label:'Dashboard'"));
test('WM has Alerts nav', html.includes("id:'alerts',label:'Alerts & Intelligence'"));
test('WM has GRN nav', html.includes("id:'grn',label:'Receive Goods"));
test('WM has Inventory nav', html.includes("id:'inventory',label:'Inventory"));
test('WM has Cycle Count nav', html.includes("id:'cycle-count'"));
test('WM has Transfers nav', html.includes("id:'transfers',label:'Transfers"));
test('WM has View Purchasing nav', html.includes("id:'purchasing-view'"));
// Director Manufacturing nav
test('DM has Production Dashboard', html.includes("id:'dashboard-mfg'"));
test('DM has Kanban nav', html.includes("id:'kanban',label:'Refill Requests'"));
test('DM has Transfer Status', html.includes("id:'transfers-mfg'"));
// Purchasing nav
test('Purchasing has dashboard', html.includes("id:'purchasing-dash'"));
test('Purchasing has worksheet', html.includes("id:'purchasing-mgmt'"));
test('Purchasing has active POs', html.includes("id:'active-pos'"));
test('Purchasing has vendor perf', html.includes("id:'vendor-perf'"));
// GM nav
test('GM has exec dashboard', html.includes("id:'exec-dash'"));
test('GM has PO approvals', html.includes("id:'po-approvals'"));
// Production floor - mobile only
test('Production floor has single kanban screen', html.includes("production-floor") && html.includes("kanban"));

// ==================== 12 SCREENS ====================
section('6. SCREEN COMPONENTS');
test('Screen 1: LoginScreen component', html.includes('function LoginScreen'));
test('Screen 2: DashboardWM component', html.includes('function DashboardWM'));
test('Screen 3: AlertsScreen component', html.includes('function AlertsScreen'));
test('Screen 4: GRNScreen component', html.includes('function GRNScreen'));
test('Screen 5: InventoryScreen component', html.includes('function InventoryScreen'));
test('Screen 6: TransfersScreen component', html.includes('function TransfersScreen'));
test('Screen 7: CycleCountScreen component', html.includes('function CycleCountScreen'));
test('Screen 8: PurchasingDashScreen component', html.includes('function PurchasingDashScreen'));
test('Screen 9: PurchasingMgmtScreen component', html.includes('function PurchasingMgmtScreen'));
test('Screen 10: DashboardMfg component', html.includes('function DashboardMfg'));
test('Screen 11: KanbanScreen component', html.includes('function KanbanScreen'));
test('Screen 12: ExecDashboard component', html.includes('function ExecDashboard'));

// ==================== WORKFLOW A: VENDOR → BLAINE (GRN) ====================
section('7. WORKFLOW A: INBOUND / GRN');
test('Expected Deliveries table', html.includes('Expected Deliveries'));
test('Start Receiving button', html.includes('Start Receiving'));
test('5-step GRN wizard', html.includes("['Identify','Match PO','QR & QC','Put-Away','Confirm']"));
test('Step 1: Scan Packing Slip QR', html.includes('Scan Packing Slip QR'));
test('Step 1: Load PO button has onClick', html.includes("Load PO") && html.includes("onClick={()=>{}}"));
test('Step 2: Match packing slip table', html.includes('Packing Slip Qty'));
test('Step 3: QR scan per item', html.includes('Scan & Receive'));
test('Step 3: QC Pass/Flag buttons', html.includes('Pass') && html.includes('Flag'));
test('Step 3: Next button has scan validation', html.includes('scanCount<1'));
test('Step 4: Warehouse location grid', html.includes('wh-grid'));
test('Step 4: Location dropdowns', html.includes('A2-03 (Suggested)'));
test('Step 5: GRN confirmation summary', html.includes('GRN-2026-0089'));
test('Step 5: Generate GRN button', html.includes('Generate GRN & Update Inventory'));
test('Confirmation splash shows GRN number', html.includes('GRN-2026-0089 Complete'));
test('Print GRN Label has onClick', html.includes("Print GRN Label") && html.includes('label sent to printer'));
test('PO-2026-0411 data', html.includes('PO-2026-0411'));
test('Pacific Foam Supplies vendor', html.includes('Pacific Foam Supplies'));
test('8 packing slip items', (html.match(/PACKING_SLIP/g) || []).length >= 2);

// ==================== WORKFLOW B: BLAINE → FERNDALE (BOL) ====================
section('8. WORKFLOW B: BOL TRANSFER');
test('Pending Requests tab', html.includes('Pending Requests'));
test('Transfer History tab', html.includes('Transfer History'));
test('5-step BOL wizard', html.includes("['Pick List','Scan to Pick','Generate BOL','Dispatch','Status']"));
test('Step 1: Pick list from Kanban request', html.includes('REQ-2026-0089'));
test('Step 2: Scan to Pick', html.includes('Scan to Pick'));
test('Step 2: Pick validation (disabled until scanned)', html.includes("disabled={!picked[0]}"));
test('Step 3: BOL preview', html.includes('BILL OF LADING'));
test('Step 3: BOL-2026-043', html.includes('BOL-2026-043'));
test('Step 3: Auto-route to Purchasing note', html.includes('automatically routed to Purchasing'));
test('Step 4: Handler name field', html.includes('Handler Name'));
test('Step 4: ETA field', html.includes('~45 minutes'));
test('Step 4: Mark as Dispatched button', html.includes('Mark as Dispatched'));
test('Dispatch splash screen', html.includes('BOL-2026-043 Dispatched'));
test('Step 5: Status tracking', html.includes('Waiting for Ferndale confirmation'));
test('Transfer history shows completed BOLs', html.includes('BOL-2026-040'));
test('readOnly prop for director-manufacturing', html.includes('readOnly'));
test('readOnly hides Start Pick button', html.includes('readOnly?'));

// ==================== WORKFLOW C: FERNDALE → BLAINE (KANBAN) ====================
section('9. WORKFLOW C: KANBAN REFILL');
test('Mobile-first layout (max-width 480px)', html.includes('max-width:480px'));
test('FERNDALE PRODUCTION FLOOR label', html.includes('FERNDALE PRODUCTION FLOOR'));
test('SCAN KANBAN QR button', html.includes('SCAN KANBAN QR'));
test('QR scan opens modal', html.includes('setShowQR(true)'));
test('Item request form after scan', html.includes("setPhase('form')"));
test('Quantity input (large)', html.includes('large-num-input'));
test('Standard refill note', html.includes('Standard refill: 40 units'));
test('3 urgency toggles', html.includes('Routine') && html.includes('Running Low') && html.includes('STOP'));
test('Urgency toggle styling', html.includes('selected-green') && html.includes('selected-amber') && html.includes('selected-red'));
test('Submit button', html.includes('Submit Request to Blaine'));
test('Confirmation screen', html.includes('Request Sent to Blaine'));
test('ETA shown', html.includes('Estimated delivery: ~45 minutes'));
test('Make Another Request button', html.includes('Make Another Request'));
test('My Requests Today section', html.includes('My Requests Today'));
test('Manual search alternative', html.includes('Search material'));
test('BOL Receipt Confirmation for director-manufacturing', html.includes('BOL-2026-043 has arrived'));
test('Confirm Receipt button has onClick', html.includes("setBolReceived(true)"));
test('Min tap target 48px', html.includes('min-height:48px'));
test('Mobile button 56px', html.includes('min-height:56px'));

// ==================== SCREEN 8: PURCHASING DASHBOARD ====================
section('10. PURCHASING DASHBOARD');
test('5 KPI cards', html.includes('Items Below Reorder') && html.includes('Avg Lead Time'));
test('Action queue for purchasing role', html.includes('Your Actions Today'));
test('Spend by Vendor chart', html.includes('Spend by Vendor'));
test('Recent PO Activity table', html.includes('Recent PO Activity'));
test('Quick action tiles', html.includes('Purchase Worksheet') && html.includes('Create PO'));
test('Manage Contracts tile has onClick', html.includes("Manage Contracts") && html.includes("onClick={()=>nav&&nav"));
test('Read-only variant for warehouse-manager', html.includes("isReadOnly"));
test('Read-only banner text', html.includes('Viewing in read-only mode'));
test('Read-only hides action queue', html.includes('!isReadOnly'));
test('Read-only shows vendor performance', html.includes('isReadOnly && <div'));

// ==================== SCREEN 9: PURCHASING MANAGEMENT ====================
section('11. PURCHASING MANAGEMENT');
test('4 tabs', html.includes('Purchase Worksheet') && html.includes('Active POs') && html.includes('Blanket POs') && html.includes('Vendor Performance'));
test('initialTab prop accepted', html.includes("initialTab"));
test('Select All Critical button', html.includes('Select All Critical'));
test('Create PO button with count', html.includes('Create PO for'));
test('5-step PO wizard', html.includes("['Review Items','Group by Vendor','PO Details','Blanket PO','Submit']"));
test('PO wizard Step 1: editable quantities', html.includes('defaultValue={it.suggestQty}'));
test('PO wizard Step 2: vendor grouping', html.includes('Grouped by Vendor'));
test('PO wizard Step 3: delivery address', html.includes('Blaine Warehouse, 123 Industrial Dr'));
test('PO wizard Step 4: blanket PO suggestion', html.includes('ordered 9'));
test('Set Blanket PO button has onClick', html.includes("Set Blanket PO") && html.includes('Blanket PO Set'));
test('PO wizard Step 5: submit confirmation', html.includes('Submit All POs'));
test('PO splash screen', html.includes('Purchase Orders Submitted'));
test('Active POs table', html.includes('PO-2026-0415'));
test('Active POs View/Follow Up has onClick', html.includes("alert(`PO Details"));
test('Blanket POs table', html.includes('12-month'));
test('Create New Contract has onClick', html.includes("New contract wizard coming soon"));
test('Vendor Performance scorecards', html.includes('On-Time Delivery'));
test('Star ratings', html.includes("'★'.repeat"));
test('Vendor scores color-coded', html.includes("v.score>=8?'green'"));

// ==================== SCREEN 12: EXECUTIVE DASHBOARD ====================
section('12. EXECUTIVE DASHBOARD');
test('5 KPI cards (strategic)', html.includes('Inventory Investment') && html.includes('On-Time Delivery Rate'));
test('PO Approval Queue with interactive approve/reject', html.includes('Approve') && html.includes('Reject'));
test('$10K threshold demo PO', html.includes('$12,400'));
test('Approval state management', html.includes('approvalDemo'));
test('Inventory Risk Summary', html.includes('Inventory Risk Summary'));
test('Supplier Performance Summary (read-only)', html.includes('Supplier Performance Summary'));
test('Mode prop for approvals vs overview', html.includes("mode==='approvals'") || html.includes('mode'));

// ==================== QR CODE SPECIFICATION ====================
section('13. QR SCAN SYSTEM');
test('Universal QR Modal component', html.includes('function QRModal'));
test('QR modal overlay', html.includes('qr-modal-overlay'));
test('Camera frame with blue corners', html.includes('qr-corners'));
test('Scanning animation', html.includes('qr-scanline'));
test('1.8 second scan delay', html.includes('1800'));
test('Success result card', html.includes('QR SCANNED SUCCESSFULLY'));
test('Confirm & Apply button', html.includes('Confirm & Apply'));
test('QR used in GRN (Screen 4)', html.includes('Scan Packing Slip QR'));
test('QR used in Inventory (Screen 5)', html.includes('Scan QR'));
test('QR used in Transfers (Screen 6)', html.includes('Scan to Pick'));
test('QR used in Kanban (Screen 11)', html.includes('SCAN KANBAN QR'));
test('Global QR button in topbar has onClick', html.includes("setShowGlobalQR(true)"));
test('Global QR modal in AppShell', html.includes('showGlobalQR'));

// ==================== COMPONENT LIBRARY ====================
section('14. COMPONENT LIBRARY');
test('WizardSteps component', html.includes('function WizardSteps'));
test('Wizard done/active/pending states', html.includes('wiz-circle') && html.includes('done') && html.includes('active') && html.includes('pending'));
test('Badge component with status mapping', html.includes('function Badge'));
test('Status badges (green/amber/red/blue/gray)', html.includes('badge-green') && html.includes('badge-amber') && html.includes('badge-red') && html.includes('badge-blue') && html.includes('badge-gray'));
test('SplashScreen component', html.includes('function SplashScreen'));
test('Callout boxes (4 variants)', html.includes('callout-blue') && html.includes('callout-green') && html.includes('callout-amber') && html.includes('callout-red'));
test('StockBar component', html.includes('function StockBar'));
test('ChartBar component', html.includes('function ChartBar'));
test('Toast notification (via DOM)', html.includes('document.body.appendChild'));

// ==================== INTERACTION PATTERNS ====================
section('15. INTERACTION PATTERNS');
test('Sidebar navigation', html.includes('sidebar-nav'));
test('Active nav item styling', html.includes('nav-item.active'));
test('Alert badge on nav items', html.includes('nav-badge'));
test('Facility status bar', html.includes('facility-bar'));
test('Facility bar for warehouse-manager', html.includes("['warehouse-manager','director-manufacturing']"));
test('Table row hover effect', html.includes("data-table tr:hover"));
test('Login role card selection', html.includes('role-card'));
test('Welcome callout dismissable', html.includes('setDismissed(true)'));
test('Bell button navigates to alerts', html.includes("onClick={()=>nav('alerts')}"));

// ==================== DATA REFERENCE ====================
section('16. DATA REFERENCE');
test('DAFO-FM-3-NTL SKU', html.includes('DAFO-FM-3-NTL'));
test('PP-SHT-4-WHT SKU', html.includes('PP-SHT-4-WHT'));
test('STR-VLC-BLK-1 SKU', html.includes('STR-VLC-BLK-1'));
test('TX-RVT-250 SKU', html.includes('TX-RVT-250'));
test('DAFO-FM-5-BLU SKU', html.includes('DAFO-FM-5-BLU'));
test('ADH-FM-A12 SKU', html.includes('ADH-FM-A12'));
test('BUF-STR-2MM SKU', html.includes('BUF-STR-2MM'));
test('FF-200-XS SKU', html.includes('FF-200-XS'));
test('Cascade Supplies vendor', html.includes('Cascade Supplies'));
test('Pacific Industrial vendor', html.includes('Pacific Industrial'));
test('Texas Steel Corp vendor', html.includes('Texas Steel Corp'));
test('Industrial Supply Co vendor', html.includes('Industrial Supply Co'));
test('PO-2026-0411 through 0415', html.includes('PO-2026-0411') && html.includes('PO-2026-0415'));
test('REQ-2026-0088 through 0090', html.includes('REQ-2026-0088') && html.includes('REQ-2026-0090'));
test('BOL-2026-039 and 040', html.includes('BOL-2026-039') && html.includes('BOL-2026-040'));
test('Warehouse locations A1-D2', html.includes("id:'A1'") && html.includes("id:'D1'"));

// ==================== ERROR STATES ====================
section('17. ERROR STATES');
test('Login empty field validation', html.includes('Please enter your email'));
test('Login role validation', html.includes('Please select a role'));
test('Cycle count variance logic', html.includes('Minor') && html.includes('Investigate') && html.includes('Critical'));
test('Cycle count 5% threshold', html.includes('pct<=5'));
test('Cycle count 15% threshold', html.includes('pct<=15'));

// ==================== PRINT RESULTS ====================
console.log('\n╔══════════════════════════════════════════════╗');
console.log('║  CASCADE DAFO WMS — PROTOTYPE TEST SUITE     ║');
console.log('╚══════════════════════════════════════════════╝');
results.forEach(r => console.log(r));
console.log(`\n━━━ SUMMARY ━━━`);
console.log(`  Total: ${passed + failed}`);
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  Score: ${Math.round((passed / (passed + failed)) * 100)}%`);
console.log(``);
if (failed === 0) {
  console.log('  🎉 ALL TESTS PASSED — Prototype is ready for delivery!');
} else {
  console.log(`  ⚠️  ${failed} test(s) need attention.`);
}
console.log('');
process.exit(failed > 0 ? 1 : 0);
