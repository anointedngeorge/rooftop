import { createRootRoute, createRoute, createRouter, Navigate, Outlet } from '@tanstack/react-router'
import { AppShell } from './components/layout/AppShell'
import { useAuth } from './context/AuthContext'
import { EntityPage } from './components/crud/EntityPage'
import { DashboardPage } from './pages/DashboardPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { LoginPage } from './pages/LoginPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ShopPage } from './pages/ShopPage'
import type { Role } from './types'
import type { ReactNode } from 'react'

const rootRoute=createRootRoute({component:()=> <Outlet/>})
const loginRoute=createRoute({getParentRoute:()=>rootRoute,path:'/login',component:LoginPage})
function Home(){const {profile,loading}=useAuth();if(loading)return <div className="boot">Loading Rooftop Hub...</div>;return <Navigate to={profile?`/${profile.role}/overview`:'/login'}/>}
const indexRoute=createRoute({getParentRoute:()=>rootRoute,path:'/',component:Home})

function Guard({role}:{role:Role}){const {profile,loading}=useAuth();if(loading)return <div className="boot">Loading workspace...</div>;if(!profile)return <Navigate to="/login"/>;if(profile.role!==role)return <Navigate to={`/${profile.role}/overview`}/>;return <AppShell/>}
const layouts={} as Record<Role,any>
for(const role of ['super_admin','staff','marketer','partner','customer'] as Role[]){layouts[role]=createRoute({getParentRoute:()=>rootRoute,path:`/${role}`,component:()=> <Guard role={role}/>})}
const page=(role:Role,path:string,component:()=>ReactNode)=>createRoute({getParentRoute:()=>layouts[role],path,component})
const overview=(role:Role)=>page(role,'overview',DashboardPage)
const entity=(role:Role,path:string,key:string,readOnly=false)=>page(role,path,()=> <EntityPage entityKey={key} readOnly={readOnly}/> )

const adminRoutes=[overview('super_admin'),entity('super_admin','users','users'),entity('super_admin','customers','customers'),entity('super_admin','products','products'),entity('super_admin','categories','categories'),entity('super_admin','sales','sales'),entity('super_admin','targets','targets'),entity('super_admin','commissions','commissions'),entity('super_admin','wallet','wallets'),entity('super_admin','withdrawals','withdrawals'),entity('super_admin','orders','orders'),entity('super_admin','payments','payments'),entity('super_admin','notifications','notifications'),entity('super_admin','feedback','feedback'),page('super_admin','reports',ReportsPage),page('super_admin','settings',SettingsPage)]
const staffRoutes=[overview('staff'),entity('staff','customers','customers'),entity('staff','sales','sales'),entity('staff','targets','targets',true),entity('staff','commissions','commissions',true),entity('staff','wallet','wallets',true),entity('staff','withdrawals','withdrawals'),page('staff','leaderboard',LeaderboardPage)]
const marketerRoutes=[overview('marketer'),entity('marketer','customers','customers'),entity('marketer','sales','sales',true),entity('marketer','commissions','commissions',true),entity('marketer','wallet','wallets',true),entity('marketer','withdrawals','withdrawals'),page('marketer','leaderboard',LeaderboardPage)]
const partnerRoutes=[overview('partner'),entity('partner','customers','customers',true),entity('partner','sales','sales',true),entity('partner','commissions','commissions',true),entity('partner','wallet','wallets',true),entity('partner','withdrawals','withdrawals')]
const customerRoutes=[overview('customer'),page('customer','shop',ShopPage),entity('customer','orders','orders',true),entity('customer','payments','payments',true),entity('customer','feedback','feedback')]

layouts.super_admin.addChildren(adminRoutes);layouts.staff.addChildren(staffRoutes);layouts.marketer.addChildren(marketerRoutes);layouts.partner.addChildren(partnerRoutes);layouts.customer.addChildren(customerRoutes)
const routeTree=rootRoute.addChildren([indexRoute,loginRoute,...Object.values(layouts)])
export const router=createRouter({routeTree,defaultPreload:'intent',scrollRestoration:true})
declare module '@tanstack/react-router'{interface Register{router:typeof router}}
