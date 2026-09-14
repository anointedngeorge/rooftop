import { LayoutDashboard, Users, UserRound, Boxes, ShoppingCart, Target, WalletCards, Landmark, Bell, MessageSquareText, BarChart3, Settings, BadgeDollarSign, ReceiptText, PackageCheck } from 'lucide-react'
import type { Role } from '../types'

export type NavItem={label:string;path:string;icon:typeof LayoutDashboard}
const common={customers:{label:'Customers',path:'customers',icon:UserRound},sales:{label:'Sales',path:'sales',icon:ReceiptText},commissions:{label:'Earnings',path:'commissions',icon:BadgeDollarSign},wallet:{label:'Wallet',path:'wallet',icon:WalletCards},withdrawals:{label:'Withdrawals',path:'withdrawals',icon:Landmark}}
export const roleNav:Record<Role,NavItem[]>={
 super_admin:[{label:'Overview',path:'overview',icon:LayoutDashboard},{label:'Users',path:'users',icon:Users},common.customers,{label:'Products',path:'products',icon:Boxes},{label:'Categories',path:'categories',icon:PackageCheck},common.sales,{label:'Targets',path:'targets',icon:Target},common.commissions,common.wallet,common.withdrawals,{label:'Orders',path:'orders',icon:ShoppingCart},{label:'Payments',path:'payments',icon:Landmark},{label:'Notifications',path:'notifications',icon:Bell},{label:'Feedback',path:'feedback',icon:MessageSquareText},{label:'Reports',path:'reports',icon:BarChart3},{label:'Settings',path:'settings',icon:Settings}],
 staff:[{label:'Overview',path:'overview',icon:LayoutDashboard},common.customers,common.sales,{label:'My Targets',path:'targets',icon:Target},common.commissions,common.wallet,common.withdrawals,{label:'Leaderboard',path:'leaderboard',icon:BarChart3}],
 marketer:[{label:'Overview',path:'overview',icon:LayoutDashboard},common.customers,common.sales,common.commissions,common.wallet,common.withdrawals,{label:'Leaderboard',path:'leaderboard',icon:BarChart3}],
 partner:[{label:'Overview',path:'overview',icon:LayoutDashboard},common.customers,common.sales,common.commissions,common.wallet,common.withdrawals],
 customer:[{label:'My Account',path:'overview',icon:LayoutDashboard},{label:'Shop',path:'shop',icon:Boxes},{label:'My Orders',path:'orders',icon:ShoppingCart},{label:'Payments',path:'payments',icon:Landmark},{label:'Feedback',path:'feedback',icon:MessageSquareText}],
}
