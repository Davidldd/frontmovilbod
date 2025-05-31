import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import InventoryView from '../views/InventoryView.vue';
import ProfileView from '../views/ProfileView.vue';
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
        path: '/inventory',
        name: 'inventory',
        component: InventoryView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    }
]

export default routes