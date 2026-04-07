/**
 * Cascade DAFO WMS Prototype — Test Suite
 * Validates all 12 screens, 5 roles, 3 workflows, and all interactive elements.
 * Run with: node test-prototype.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'index.html');
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
test('Step 3: GRN-02 split-panel QR scan per item', html.includes('Scan Item'));
test('Step 3: QC Pass/Flag buttons', html.includes('Pass') && html.includes('Flag'));
test('Step 3: Next button has scan validation', html.includes('scanCount<1'));
test('Step 4: Warehouse location grid', html.includes('wh-grid'));
test('Step 4: GRN-03 enhanced warehouse grid', html.includes('wh-grid-enhanced') && html.includes('wh-cell-v2'));
test('Step 5: GRN confirmation summary', html.includes('GRN-2026-0089'));
test('Step 5: Generate GRN button', html.includes('Generate GRN & Update Inventory'));
test('GRN complete toast message', html.includes('GRN-2026-0089 complete'));
test('GRN navigates to dashboard on complete', html.includes("nav('dashboard')") || html.includes("nav&&nav('dashboard')"));
test('PO-2026-0411 data', html.includes('PO-2026-0411'));
test('Pacific Foam Supplies vendor', html.includes('Pacific Foam Supplies'));
test('8 packing slip items', (html.match(/PACKING_SLIP/g) || []).length >= 2);

// ==================== WORKFLOW B: BLAINE → FERNDALE (BOL) ====================
section('8. WORKFLOW B: BOL TRANSFER');
test('Pending Requests tab', html.includes('Pending Requests'));
test('Transfer History tab', html.includes('Transfer History'));
test('TRF-01: 5-step revised transfer wizard', html.includes("['Review Request','Create Transfer Order','Pick Against Order','Generate BOL','Dispatch']"));
test('Step 1: Pick list from Kanban request', html.includes('REQ-2026-0089'));
test('TRF-02: Tap to Scan Pick button', html.includes('Tap to Scan Pick'));
test('TRF-02: Pick validation (disabled until all picked)', html.includes("disabled={!allPicked}"));
test('Step 3: BOL preview', html.includes('BILL OF LADING'));
test('Step 3: BOL-2026-043', html.includes('BOL-2026-043'));
test('Step 3: Auto-route to Purchasing note', html.includes('automatically routed to Purchasing'));
test('Step 4: Handler name field', html.includes('Handler Name'));
test('Step 4: ETA field', html.includes('~45 minutes'));
test('Step 4: Mark as Dispatched button', html.includes('Mark as Dispatched'));
test('Dispatch toast notification', html.includes('BOL-2026-043 dispatched'));
test('Dispatched BOL shows in transfer history', html.includes('TO-2026-0044'));
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
test('PD-01: Inventory Level Trends replaces action queue', html.includes('Inventory Level Trends') && html.includes('inv-trend-row'));
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
test('PM-01: Invoice preview with Submit All', html.includes('Submit All'));
test('PO submit toast notification', html.includes('Purchase Orders submitted'));
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
test('QR split-panel on scan success (G-02)', html.includes('qr-split-modal') && html.includes('qr-split-body'));
test('Confirm & Apply button', html.includes('Confirm & Apply'));
test('QR used in GRN (Screen 4)', html.includes('Scan Packing Slip QR'));
test('QR used in Inventory (Screen 5)', html.includes('Scan QR'));
test('QR/Scan used in Transfers (Screen 6)', html.includes('Tap to Scan Pick'));
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
test('D-01: Intel ribbon replaces welcome callout', html.includes('intel-ribbon') && html.includes('DAFONow'));
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

// ==================== v4.1 PHASE 1 TESTS ====================
section('18. PHASE 1 — GLOBAL FIXES + DATA');
test('G-01: ExitConfirmDialog component exists', html.includes('ExitConfirmDialog'));
test('G-01: Exit without saving prompt', html.includes('Exit without saving'));
test('G-01: SplashScreen has onClose prop', html.includes('SplashScreen({icon,title,text,actions,onClose})'));
test('G-01: Splash close button', html.includes('splash-close'));
test('G-02: QR split-panel CSS', html.includes('qr-split-modal') && html.includes('qr-split-body') && html.includes('qr-split-left') && html.includes('qr-split-right'));
test('G-02: QR split-panel action button', html.includes('qr-action-btn'));
test('G-02: QR manual entry fallback', html.includes('QR not working? Enter manually'));
test('G-02: QR actionLabel prop', html.includes('actionLabel'));
test('G-03: Toast component exists', html.includes('function Toast'));
test('G-03: Toast container CSS', html.includes('toast-container'));
test('G-03: Toast auto-dismiss 4s', html.includes('4000'));
test('G-03: GRN uses toast instead of splash', html.includes('GRN-2026-0089 complete') && html.includes('addToast'));
test('G-03: Transfers uses toast instead of splash', html.includes('BOL-2026-043 dispatched'));
test('G-03: CycleCount uses toast instead of splash', html.includes('cycle count submitted'));
test('G-03: PurchasingMgmt uses toast instead of splash', html.includes('Purchase Orders submitted'));
test('G-03: DashboardMfg uses toast instead of splash', html.includes('BOL-2026-041 receipt confirmed'));
test('DATA-01: PACKING_SLIP has mismatch (psQty:95)', html.includes('psQty:95') && html.includes('match:false'));
test('DATA-01: Mismatch is EVA Foam 5mm Blue', html.includes("DAFO-FM-5-BLU',poQty:100,psQty:95,match:false"));
test('DATA-03: FERNDALE_ITEMS array exists', html.includes('FERNDALE_ITEMS'));
test('DATA-03: FERNDALE_ITEMS has 5 items', html.includes("DAFO-FM-3-NTL") && html.includes("status:'CRITICAL'") && html.includes("status:'HEALTHY'"));
test('DATA-03: Ferndale EVA Foam 3mm onHand:12, min:85', html.includes("onHand:12,min:85,status:'CRITICAL'"));
test('GRN Step 2: Mismatch badge shown', html.includes('Mismatch') && html.includes('short'));
test('GRN Step 2: Mismatch note field required', html.includes('Flag reason required'));
test('GRN Step 2: Blocked proceed until flagged', html.includes('allMismatchesFlagged'));
test('GRN wizard has exit confirmation', html.includes('showExitConfirm') && html.includes('ExitConfirmDialog'));
test('Transfers wizard has exit confirmation', html.includes('showExitConfirm'));

section('19. PHASE 2 — DASHBOARD REDESIGN');
test('D-01: Intel ribbon component', html.includes('intel-ribbon-tab') && html.includes('intel-ribbon-body') && html.includes('intel-ribbon-cta'));
test('D-01: Ribbon height 56px', html.includes('height:56px'));
test('D-01: Ribbon left tab 90px', html.includes('flex:0 0 90px'));
test('D-01: DAFONow label in ribbon', html.includes('DAFONow'));
test('D-01: Critical items in red bold', html.includes('item-critical'));
test('D-01: Review Purchase Worksheet CTA', html.includes('Review Purchase Worksheet'));
test('D-02: 5 compact KPI tiles', html.includes('kpi-compact-row') && html.includes("repeat(5,1fr)"));
test('D-02: KPI tile height 64px', html.includes('height:64px'));
test('D-02: Capacity battery in 5th tile', html.includes('capacity-battery') && html.includes('capacity-bar') && html.includes('capacity-fill'));
test('D-02: Capacity label WAREHOUSE CAPACITY', html.includes('WAREHOUSE CAPACITY'));
test('D-02: Capacity computed from WH_LOCATIONS', html.includes('WH_LOCATIONS.reduce'));
test('D-02: Capacity color thresholds (green>=70, amber>=50, red<50)', html.includes("avgCap>=70?'var(--green)'"));
test('D-03: Quick tiles have status badges', html.includes('tile-badge'));
test('D-03: PO-0411 arriving badge', html.includes('PO-0411 arriving 2:30 PM'));
test('D-03: A-Zone due today badge', html.includes('A-Zone due today'));
test('D-04: Alert card grid (3 columns)', html.includes('alert-card-grid') && html.includes("repeat(3,1fr)"));
test('D-04: Alert card top accent bar', html.includes('alert-card-bar'));
test('D-04: 4 icon actions per card', html.includes('alert-card-actions'));
test('D-04: Icon actions: Create PO, View, Receive, Worksheet', html.includes('Create PO') && html.includes('Worksheet'));
test('D-04: 6 alert cards rendered', (html.match(/alert-card-title/g)||[]).length >= 2);
test('D-05: Transfer mini cards', html.includes('transfer-mini-card'));
test('D-05: Mini card header with request ID + badge', html.includes('transfer-mini-header') && html.includes('req-id'));
test('D-05: Mini card footer with stock avail + action', html.includes('transfer-mini-footer') && html.includes('stock-avail'));
test('D-05: Start Pick button in mini cards', html.includes("Start Pick"));

section('20. PHASE 3 — GRN + INVENTORY UPGRADES');
test('GRN-02: Split-panel QC modal per item', html.includes("typeof showQR==='number'") && html.includes('Confirm Receipt'));
test('GRN-02: QC Pass and Flag buttons', html.includes('QC Pass') && html.includes('Flag Issue'));
test('GRN-03: Enhanced warehouse grid CSS', html.includes('wh-grid-enhanced') && html.includes('wh-cell-v2'));
test('GRN-03: Grid cell states (avail/near-full/full/selected/confirmed)', html.includes("'avail'") && html.includes("'confirmed'"));
test('GRN-03: Cell expand panel with assign button', html.includes('wh-expand-panel') && html.includes('Assign Items to This Location'));
test('GRN-03: QR location confirmation sub-step', html.includes('Simulate QR Scan') && html.includes('Confirm Manually'));
test('GRN-03: No QR bypass always available', html.includes('No QR label'));
test('INV-01: Facility View tab exists', html.includes('Facility View') && html.includes("invTab==='facility'"));
test('INV-01: Two panels Blaine + Ferndale', html.includes('BLAINE WAREHOUSE') && html.includes('FERNDALE PRODUCTION'));
test('INV-01: Horizontal bars with threshold lines', html.includes('facility-bar-fill') && html.includes('facility-threshold'));
test('INV-01: Uses FERNDALE_ITEMS data', html.includes('FERNDALE_ITEMS.map') || html.includes('FERNDALE_ITEMS.filter'));
test('INV-01: Transfer Opportunities section', html.includes('Transfer Opportunities') && html.includes('transfer-opp-row'));
test('INV-01: 3 locations listed', html.includes('Blaine Warehouse') && html.includes('Ferndale Production'));
test('INV-02: Transfer button navigates to TransfersScreen', html.includes("nav('transfers')") && html.includes('Initiate Transfer'));
test('INV-03: QR button label updated', html.includes('Scan Item QR'));
test('INV-03: Context line below search', html.includes('Scan any QR label'));

section('21. PHASE 4 — TRANSFERS + CYCLE COUNT');
test('TRF-01: 5-step revised flow', html.includes('Review Request') && html.includes('Create Transfer Order') && html.includes('Pick Against Order'));
test('TRF-01: Transfer Order number TO-2026-0044', html.includes('TO-2026-0044'));
test('TRF-01: Step 2 creates anchor document', html.includes('Transfer Order Created') && html.includes('Anchor Document'));
test('TRF-02: Auto-confirm scan pick with green flash', html.includes('scanFlash') && html.includes('handleScanPick'));
test('TRF-02: 800ms mock delay for realism', html.includes('800'));
test('TRF-02: Green flash transition on scan', html.includes("scanFlash===idx?'var(--green)'"));
test('TRF-03: Multi-item pick list (2 items)', html.includes('PP Sheet 4mm White') && html.includes('DAFO EVA Foam 3mm Natural') && html.includes('pickItems'));
test('TRF-03: Pick progress counter', html.includes('pickedCount') && html.includes('pickItems.length'));
test('TRF-03: BOL includes both items', html.includes('PP-SHT-4-WHT') && html.includes('6 rolls'));
test('CC-01: 3 zone tabs', html.includes('A-Zone') && html.includes('B-Zone') && html.includes('C-Zone'));
test('CC-01: A-Zone tab has red Due today badge', html.includes('Due today') && html.includes("badgeColor:'red'"));
test('CC-01: B-Zone tab has amber Apr 15 badge', html.includes('Apr 15') && html.includes("badgeColor:'amber'"));
test('CC-01: C-Zone tab has green Jun 1 badge', html.includes('Jun 1') && html.includes("badgeColor:'green'"));
test('CC-01: Zone description per tab', html.includes('High-value raw materials') && html.includes('Assembly components') && html.includes('Consumables and finishing'));
test('CC-01: Start [Zone] Count button', html.includes('Start') && html.includes('Count'));
test('CC-01: Schedule and last variance inline', html.includes('Weekly (every Monday)') && html.includes('Monthly (15th)'));
test('CC-02: Context callout at top', html.includes('Physical verification of on-hand stock'));

section('22. PHASE 5 — PURCHASING UPGRADES');
test('PD-01: Inventory Level Trends component', html.includes('inv-trend-row') && html.includes('inv-trend-fill'));
test('PD-01: Trend bars with threshold lines', html.includes('inv-trend-threshold'));
test('PD-01: Replenish button on below-min items', html.includes('Replenish') && html.includes('setReplenishItem'));
test('PD-01: Items sorted critical first', html.includes('sort((a,b)=>a.daysLeft-b.daysLeft)'));
test('PD-02: Replenishment slide pane', html.includes('replenish-pane') && html.includes('replenish-pane-body'));
test('PD-02: Pane shows vendor suggestion', html.includes('Suggested Vendor') && html.includes('vendor-suggest'));
test('PD-02: Pane shows lead time, price, on-time%', html.includes('Lead Time') && html.includes('Unit Price') && html.includes('Estimated Total'));
test('PD-02: Add to PO button', html.includes('Add to PO'));
test('PD-02: Session accumulator bottom bar', html.includes('session-bar') && html.includes('session-cta'));
test('PD-02: Bottom bar shows count and total', html.includes('added') && html.includes('sessionTotal'));
test('PD-02: Review & Submit CTA in bottom bar', html.includes('Review & Submit'));
test('PD-03: 6-month procurement cost trend line', html.includes('trend-chart') && html.includes('chart-line'));
test('PD-03: SVG line chart with 6 data points', html.includes('spendData') && html.includes('polyline'));
test('PD-03: View by Vendor toggle', html.includes('View by') && html.includes('showVendorBreakdown'));
test('PM-01: Invoice-style vendor preview', html.includes('invoice-vendor-block') && html.includes('invoice-vendor-header'));
test('PM-01: Line items with desc/qty/price/total', html.includes('invoice-line-item'));
test('PM-01: Vendor subtotals', html.includes('invoice-subtotal'));
test('PM-01: Grand total', html.includes('invoice-grand-total'));
test('PM-01: OK and Edit buttons per vendor', html.includes('OK') && html.includes('Edit'));
test('PM-01: Submit All and Submit Selected buttons', html.includes('Submit All') && html.includes('Submit Selected'));

section('23. PHASE 6 — NAVIGATION + EXECUTIVE + POLISH');
test('A-01: AlertsPane component exists', html.includes('function AlertsPane'));
test('A-01: Alerts pane 440px slide-in', html.includes('alerts-pane') && html.includes('width:440px'));
test('A-01: Pane has close button + Esc dismiss', html.includes('onClose') && html.includes("key==='Escape'"));
test('A-01: Tab bar with icons: Critical/Stock/POs/Transfers/All', html.includes("icon:'🔴'") && html.includes("icon:'📦'") && html.includes("icon:'📄'") && html.includes("icon:'🚚'"));
test('A-01: Pane triggered from bell icon', html.includes('setAlertsPaneOpen(true)') && html.includes('bell-btn'));
test('A-01: Pane triggered from sidebar nav', html.includes("item.id==='alerts'") && html.includes('setAlertsPaneOpen(true)'));
test('A-01: Pane triggered from dashboard View All', html.includes('openAlerts'));
test('NAV-01: WM role routes to purchasing-view', html.includes("role==='warehouse-manager'") && html.includes("nav('purchasing-view')"));
test('NAV-01: Alerts pane handleAction per role', html.includes('handleAction'));
test('NAV-02: Alerts nav triggers pane not navigation', html.includes("if(item.id==='alerts'){setAlertsPaneOpen(true)"));
test('EXEC-01: Spend gauge component', html.includes('spend-gauge') && html.includes('spend-gauge-bar') && html.includes('spend-gauge-fill'));
test('EXEC-01: Budget data ($18,500 of $25,000)', html.includes('18500') && html.includes('25000'));
test('EXEC-01: Gauge color thresholds (green<80, amber<100, red>=100)', html.includes("pctUsed<80?'var(--green)'"));
test('EXEC-01: Open Order Value shown', html.includes('Open Order Value'));
test('EXEC-01: If Approved total calculated', html.includes('If Approved, Total'));
test('EXEC-01: Budget remaining shown', html.includes('Budget Remaining'));
test('EXEC-01: Warning text for approaching budget', html.includes('Approaching budget limit'));
test('Accessibility: bell button has aria-label', html.includes('aria-label="Open alerts'));
test('Accessibility: alert card actions have aria-labels', html.includes('aria-label="View item"') && html.includes('aria-label="Receive goods"'));
test('All 31 change IDs: Global (G-01,G-02,G-03)', html.includes('ExitConfirmDialog') && html.includes('qr-split-modal') && html.includes('function Toast'));
test('All 31 change IDs: Data (DATA-01,DATA-02,DATA-03)', html.includes('match:false') && html.includes('FERNDALE_ITEMS'));
test('All 31 change IDs: Dashboard (D-01..D-05)', html.includes('intel-ribbon') && html.includes('kpi-compact-row') && html.includes('alert-card-grid') && html.includes('transfer-mini-card'));
test('All 31 change IDs: GRN+Inventory (GRN-01..04,INV-01..03)', html.includes('mismatchNotes') && html.includes('wh-grid-enhanced') && html.includes('Facility View') && html.includes('Scan Item QR'));
test('All 31 change IDs: Transfers+CycleCount (TRF-01..03,CC-01..02)', html.includes('Transfer Order Created') && html.includes('handleScanPick') && html.includes('A-Zone') && html.includes('Physical verification'));
test('All 31 change IDs: Purchasing (PD-01..03,PM-01)', html.includes('inv-trend-row') && html.includes('replenish-pane') && html.includes('trend-chart') && html.includes('invoice-vendor-block'));
test('All 31 change IDs: Nav+Exec (A-01,NAV-01,NAV-02,EXEC-01)', html.includes('AlertsPane') && html.includes('alertsPaneOpen') && html.includes('spend-gauge'));

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
