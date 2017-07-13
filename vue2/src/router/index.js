import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomeView = resolve => require(['@/views/HomeView'], resolve)
const LiveView = resolve => require(['@/views/LiveView'], resolve)
const IntroView = resolve => require(['@/views/IntroView'], resolve)
const UsersView = resolve => require(['@/views/UsersView'], resolve)
const WeChatView = resolve => require(['@/views/WeChatView'], resolve)
const ScanView = resolve => require(['@/views/ScanView'], resolve)
const ListView = resolve => require(['@/views/ListView'], resolve)
const ProfileView = resolve => require(['@/views/ProfileView'], resolve)
const ContactView = resolve => require(['@/views/ContactView'], resolve)
const MyListView = resolve => require(['@/views/MyListView'], resolve)
const StaffView = resolve => require(['@/views/StaffView'], resolve)
const RegAnchorView = resolve => require(['@/views/RegAnchorView'], resolve)
const AgreementView = resolve => require(['@/views/AgreementView'], resolve)
const BindPhoneView = resolve => require(['@/views/BindPhoneView'], resolve)
const AccountView = resolve => require(['@/views/AccountView'], resolve)
const InviteView = resolve => require(['@/views/InviteView'], resolve)
const EditUserView = resolve => require(['@/views/EditUserView'], resolve)
const EditDetailView = resolve => require(['@/views/EditDetailView'], resolve)
const CardView = resolve => require(['@/views/CardView'], resolve)
const RoomView = resolve => require(['@/views/RoomView'], resolve)
const EditLiveView = resolve => require(['@/views/EditLiveView'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomeView
    }, {
      path: '/intro/:liveId',
      component: IntroView
    }, {
      path: '/live/:liveId',
      component: LiveView
    }, {
      path: '/live/:liveId/users',
      component: UsersView
    }, {
      path: '/live/:liveId/card',
      component: CardView
    }, {
      path: '/wechat/:type',
      component: WeChatView
    }, {
      path: '/scan',
      component: ScanView
    }, {
      path: '/lives',
      component: ListView
    }, {
      path: '/profile',
      component: ProfileView
    }, {
      path: '/contact',
      component: ContactView
    }, {
      path: '/mylist',
      component: MyListView
    }, {
      path: '/staff',
      component: StaffView
    }, {
      path: '/reganchor',
      component: RegAnchorView
    }, {
      path: '/agreement',
      component: AgreementView
    }, {
      path: '/bindPhone',
      component: BindPhoneView
    }, {
      path: '/account',
      component: AccountView
    }, {
      path: '/live/:liveId/invites',
      component: InviteView
    }, {
      path: '/editUser',
      component: EditUserView
    }, {
      path: '/room/:userId',
      component: RoomView
    }, {
      path: '/editLive/:liveId',
      component: EditLiveView
    }, {
      path: '/editDetail/:liveId/:type',
      component: EditDetailView
    }, {
      path: '*',
      redirect: to => {
        return '/'
      }
    }
  ]
})
