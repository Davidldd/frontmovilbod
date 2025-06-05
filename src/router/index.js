import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue';
import ProfileView from '../views/auth/ProfileView.vue';
import InventoryInputView from '../views/Inventory/InventoryInputView.vue';
import InventoryOutputView from '../views/Inventory/InventoryOutputView.vue';
import InventoryTransferView from '../views/Inventory/InventoryTransferView.vue';
import InventoryAdjustmentView from '../views/Inventory/InventoryAdjustmentView.vue';
import CatalogProductsView from '../views/catalog/CatalogProductsView.vue';
import CatalogCategoriesView from '../views/catalog/CatalogCategoriesView.vue';
import CatalogProductsNewView from '../views/catalog/CatalogProductsNewView.vue';
import DashboardView from "../views/DashboardView.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/inventory/input',
        name: 'inventory-input',
        component: InventoryInputView,
        meta: { requiresAuth: true }
    },
    {
        path: '/inventory/output',
        name: 'inventory-output',
        component: InventoryOutputView,
        meta: { requiresAuth: true }
    },
    {
        path: '/inventory/transfer',
        name: 'inventory-transfer',
        component: InventoryTransferView,
        meta: { requiresAuth: true }
    },
    {
        path: '/inventory/adjustment',
        name: 'inventory-adjustment',
        component: InventoryAdjustmentView,
        meta: { requiresAuth: true }
    },
    {
        path: '/catalog/products',
        name: 'catalog-products',
        component: CatalogProductsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/catalog/categories',
        name: 'catalog-categories',
        component: CatalogCategoriesView,
        meta: { requiresAuth: true }
    },
    {
        path: '/catalog/products/new',
        name: 'catalog-products-new',
        component: CatalogProductsNewView,
        meta: { requiresAuth: true }
    }
]
    export default routes