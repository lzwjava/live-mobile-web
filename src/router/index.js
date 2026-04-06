import { createRouter, createWebHashHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const LiveView = () => import('@/views/LiveView.vue')
const IntroView = () => import('@/views/IntroView.vue')
const UsersView = () => import('@/views/UsersView.vue')
const WeChatView = () => import('@/views/WeChatView.vue')
const ScanView = () => import('@/views/ScanView.vue')
const ListView = () => import('@/views/ListView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const ContactView = () => import('@/views/ContactView.vue')
const MyListView = () => import('@/views/MyListView.vue')
const StaffView = () => import('@/views/StaffView.vue')
const RegAnchorView = () => import('@/views/RegAnchorView.vue')
const AgreementView = () => import('@/views/AgreementView.vue')
const BindPhoneView = () => import('@/views/BindPhoneView.vue')
const AccountView = () => import('@/views/AccountView.vue')
const InviteView = () => import('@/views/InviteView.vue')
const EditUserView = () => import('@/views/EditUserView.vue')
const RoomView = () => import('@/views/RoomView.vue')
const EditLiveView = () => import('@/views/EditLiveView.vue')
const EditDetailView = () => import('@/views/EditDetailView.vue')
const CardView = () => import('@/views/CardView.vue')

const routes = [
  { path: '/', component: HomeView },
  { path: '/intro/:liveId', component: IntroView },
  { path: '/live/:liveId', component: LiveView },
  { path: '/live/:liveId/users', component: UsersView },
  { path: '/live/:liveId/card', component: CardView },
  { path: '/wechat/:type', component: WeChatView },
  { path: '/scan', component: ScanView },
  { path: '/lives', component: ListView },
  { path: '/profile', component: ProfileView },
  { path: '/contact', component: ContactView },
  { path: '/mylist', component: MyListView },
  { path: '/staff', component: StaffView },
  { path: '/reganchor', component: RegAnchorView },
  { path: '/agreement', component: AgreementView },
  { path: '/bindPhone', component: BindPhoneView },
  { path: '/account', component: AccountView },
  { path: '/live/:liveId/invites', component: InviteView },
  { path: '/editUser', component: EditUserView },
  { path: '/room/:userId', component: RoomView },
  { path: '/editLive/:liveId', component: EditLiveView },
  { path: '/editDetail/:liveId/:type', component: EditDetailView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})

export default router
