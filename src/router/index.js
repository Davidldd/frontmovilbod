import LoginView from "../views/auth/LoginView.vue"
import RegisterView from "../views/auth/RegisterView.vue"
import ForgotPasswordView from "../views/auth/ForgotPasswordView.vue"
import ProfileView from "../views/auth/ProfileView.vue"

import InventoryInputView from "../views/inventory/InventoryInputView.vue"
import InventoryOutputView from "../views/inventory/InventoryOutputView.vue"
import InventoryTransferView from "../views/inventory/InventoryTransferView.vue"
import InventoryAdjustmentView from "../views/inventory/InventoryAdjustmentView.vue"
import InventoryDashboardView from "../views/inventory/InventoryDashboardView.vue"
import InventoryStockView from "../views/inventory/InventoryStockView.vue"
import InventoryLocationsView from "../views/inventory/InventoryLocationsView.vue"
import InventoryAlertsView from "../views/inventory/InventoryAlertsView.vue"

import CatalogProductsView from "../views/catalog/CatalogProductsView.vue"
import CatalogCategoriesView from "../views/catalog/CatalogCategoriesView.vue"
import CatalogProductsNewView from "../views/catalog/CatalogProductsNewView.vue"

import DashboardView from "../views/DashboardView.vue"
import ModuleConfigView from "../views/config/ModuleConfigView.vue"

import CrmDashboardView from "../views/crm/CrmDashboardView.vue"
import CrmContactsView from "../views/crm/CrmContactsView.vue"
import CrmCompaniesView from "../views/crm/CrmCompaniesView.vue"
import CrmLeadsView from "../views/crm/CrmLeadsView.vue"
import CrmOpportunitiesView from "../views/crm/CrmOpportunitiesView.vue"
import CrmTasksView from "../views/crm/CrmTasksView.vue"

import BillingDashboardView from "../views/billing/BillingDashboardView.vue"
import BillingInvoicesView from "../views/billing/BillingInvoicesView.vue"
import BillingInvoiceCreateView from "../views/billing/BillingInvoiceCreateView.vue"
import BillingCreditNotesView from "../views/billing/BillingCreditNotesView.vue"
import BillingCreditNoteCreateView from "../views/billing/BillingCreditNoteCreateView.vue"
import BillingPaymentsView from "../views/billing/BillingPaymentsView.vue"

import AccountingDashboardView from "../views/accounting/AccountingDashboardView.vue"
import ChartOfAccountsView from "../views/accounting/ChartOfAccountsView.vue"
import AccountCreateView from "../views/accounting/AccountCreateView.vue"
import JournalEntriesView from "../views/accounting/JournalEntriesView.vue"
import JournalEntryCreateView from "../views/accounting/JournalEntryCreateView.vue"
import CostCentersView from "../views/accounting/CostCentersView.vue"
import TrialBalanceReportView from "../views/accounting/TrialBalanceReportView.vue"

// Purchases Views
import PurchasesDashboardView from "../views/purchases/PurchasesDashboardView.vue"
import SuppliersView from "../views/purchases/SuppliersView.vue"
import SupplierCreateView from "../views/purchases/SupplierCreateView.vue"
import PurchaseOrdersView from "../views/purchases/PurchaseOrdersView.vue"
import PurchaseOrderCreateView from "../views/purchases/PurchaseOrderCreateView.vue"
import GoodsReceiptsView from "../views/purchases/GoodsReceiptsView.vue"
import SupplierInvoicesView from "../views/purchases/SupplierInvoicesView.vue"

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/forgot-password", name: "forgot-password", component: ForgotPasswordView },
  { path: "/dashboard", name: "dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/profile", name: "profile", component: ProfileView, meta: { requiresAuth: true } },
  // Configuration
  {
    path: "/config/modules",
    name: "module-config",
    component: ModuleConfigView,
    meta: { requiresAuth: true, requiresRoot: true },
  },
  // CRM
  {
    path: "/crm/dashboard",
    name: "crm-dashboard",
    component: CrmDashboardView,
    meta: { requiresAuth: true, module: "crm" },
  },
  {
    path: "/crm/contacts",
    name: "crm-contacts",
    component: CrmContactsView,
    meta: { requiresAuth: true, module: "crm" },
  },
  {
    path: "/crm/companies",
    name: "crm-companies",
    component: CrmCompaniesView,
    meta: { requiresAuth: true, module: "crm" },
  },
  { path: "/crm/leads", name: "crm-leads", component: CrmLeadsView, meta: { requiresAuth: true, module: "crm" } },
  {
    path: "/crm/opportunities",
    name: "crm-opportunities",
    component: CrmOpportunitiesView,
    meta: { requiresAuth: true, module: "crm" },
  },
  { path: "/crm/tasks", name: "crm-tasks", component: CrmTasksView, meta: { requiresAuth: true, module: "crm" } },
  // Inventory
  {
    path: "/inventory/dashboard",
    name: "inventory-dashboard",
    component: InventoryDashboardView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/stock",
    name: "inventory-stock",
    component: InventoryStockView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/locations",
    name: "inventory-locations",
    component: InventoryLocationsView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/alerts",
    name: "inventory-alerts",
    component: InventoryAlertsView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/input",
    name: "inventory-input",
    component: InventoryInputView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/output",
    name: "inventory-output",
    component: InventoryOutputView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/transfer",
    name: "inventory-transfer",
    component: InventoryTransferView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/inventory/adjustment",
    name: "inventory-adjustment",
    component: InventoryAdjustmentView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  // Catalog
  {
    path: "/catalog/products",
    name: "catalog-products",
    component: CatalogProductsView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/catalog/categories",
    name: "catalog-categories",
    component: CatalogCategoriesView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  {
    path: "/catalog/products/new",
    name: "catalog-products-new",
    component: CatalogProductsNewView,
    meta: { requiresAuth: true, module: "inventory" },
  },
  // Billing
  {
    path: "/billing/dashboard",
    name: "billing-dashboard",
    component: BillingDashboardView,
    meta: { requiresAuth: true, module: "billing" },
  },
  {
    path: "/billing/invoices",
    name: "billing-invoices",
    component: BillingInvoicesView,
    meta: { requiresAuth: true, module: "billing" },
  },
  {
    path: "/billing/invoices/new",
    name: "billing-invoice-new",
    component: BillingInvoiceCreateView,
    meta: { requiresAuth: true, module: "billing" },
  },
  {
    path: "/billing/invoices/:id",
    name: "billing-invoice-edit",
    component: BillingInvoiceCreateView,
    meta: { requiresAuth: true, module: "billing" },
    props: true,
  },
  {
    path: "/billing/credit-notes",
    name: "billing-credit-notes",
    component: BillingCreditNotesView,
    meta: { requiresAuth: true, module: "billing" },
  },
  {
    path: "/billing/credit-note/new",
    name: "billing-credit-note-new",
    component: BillingCreditNoteCreateView,
    meta: { requiresAuth: true, module: "billing" },
  },
  {
    path: "/billing/credit-note/:id",
    name: "billing-credit-note-edit",
    component: BillingCreditNoteCreateView,
    meta: { requiresAuth: true, module: "billing" },
    props: true,
  },
  {
    path: "/billing/payments",
    name: "billing-payments",
    component: BillingPaymentsView,
    meta: { requiresAuth: true, module: "billing" },
  },
  // Accounting
  {
    path: "/accounting/dashboard",
    name: "accounting-dashboard",
    component: AccountingDashboardView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  {
    path: "/accounting/chart-of-accounts",
    name: "accounting-chart-of-accounts",
    component: ChartOfAccountsView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  {
    path: "/accounting/account/new",
    name: "accounting-account-new",
    component: AccountCreateView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  {
    path: "/accounting/account/:id/edit",
    name: "accounting-account-edit",
    component: AccountCreateView,
    meta: { requiresAuth: true, module: "accounting" },
    props: true,
  },
  {
    path: "/accounting/journal-entries",
    name: "accounting-journal-entries",
    component: JournalEntriesView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  {
    path: "/accounting/journal-entry/new",
    name: "accounting-journal-entry-new",
    component: JournalEntryCreateView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  {
    path: "/accounting/journal-entry/:id/edit",
    name: "accounting-journal-entry-edit",
    component: JournalEntryCreateView,
    meta: { requiresAuth: true, module: "accounting" },
    props: true,
  },
  {
    path: "/accounting/cost-centers",
    name: "accounting-cost-centers",
    component: CostCentersView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  {
    path: "/accounting/reports/trial-balance",
    name: "accounting-report-trial-balance",
    component: TrialBalanceReportView,
    meta: { requiresAuth: true, module: "accounting" },
  },
  // Purchases
  {
    path: "/purchases/dashboard",
    name: "purchases-dashboard",
    component: PurchasesDashboardView,
    meta: { requiresAuth: true, module: "purchases" },
  },
  {
    path: "/purchases/suppliers",
    name: "purchases-suppliers",
    component: SuppliersView,
    meta: { requiresAuth: true, module: "purchases" },
  },
  {
    path: "/purchases/supplier/new",
    name: "purchases-supplier-new",
    component: SupplierCreateView,
    meta: { requiresAuth: true, module: "purchases" },
  },
  {
    path: "/purchases/supplier/:id/edit",
    name: "purchases-supplier-edit",
    component: SupplierCreateView,
    meta: { requiresAuth: true, module: "purchases" },
    props: true,
  },
  {
    path: "/purchases/orders",
    name: "purchases-orders",
    component: PurchaseOrdersView,
    meta: { requiresAuth: true, module: "purchases" },
  },
  {
    path: "/purchases/order/new",
    name: "purchases-order-new",
    component: PurchaseOrderCreateView,
    meta: { requiresAuth: true, module: "purchases" },
  },
  {
    path: "/purchases/order/:id/edit",
    name: "purchases-order-edit",
    component: PurchaseOrderCreateView,
    meta: { requiresAuth: true, module: "purchases" },
    props: true,
  },
  {
    path: "/purchases/receipts",
    name: "purchases-receipts",
    component: GoodsReceiptsView,
    meta: { requiresAuth: true, module: "purchases" },
  },
  {
    path: "/purchases/supplier-invoices",
    name: "purchases-supplier-invoices",
    component: SupplierInvoicesView,
    meta: { requiresAuth: true, module: "purchases" },
  },
]

export default routes
