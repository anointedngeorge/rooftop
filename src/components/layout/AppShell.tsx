import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Bell, ChevronDown, LogOut, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { roleNav } from '../../config/navigation'
import { useAuth } from '../../context/AuthContext'

export function AppShell(){
 const {profile,signOut}=useAuth(); const [open,setOpen]=useState(false); const location=useLocation(); const navigate=useNavigate()
 if(!profile)return null; const prefix=`/${profile.role}`; const nav=roleNav[profile.role]
 async function leave(){await signOut();await navigate({to:'/login'})}
 return <div className="app-shell">
  <aside className={`sidebar ${open?'open':''}`}><div className="brand"><div className="brand-mark">RH</div><div><strong>Rooftop Hub</strong><span>Sales command centre</span></div><button className="mobile-close" onClick={()=>setOpen(false)}><X/></button></div>
   <nav>{nav.map(item=>{const Icon=item.icon;const href=`${prefix}/${item.path}`;const active=location.pathname===href;return <Link key={href} to={href} onClick={()=>setOpen(false)} className={active?'active':''}><Icon size={19}/><span>{item.label}</span></Link>})}</nav>
   <div className="sidebar-foot"><div className="mini-avatar">{profile.full_name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>{profile.full_name}</strong><span>{profile.role.replace('_',' ')}</span></div><button onClick={leave} title="Sign out"><LogOut size={18}/></button></div>
  </aside>
  <main><header className="topbar"><button className="menu-button" onClick={()=>setOpen(true)}><Menu/></button><label className="global-search"><Search size={18}/><input placeholder="Search customers, sales, orders..."/></label><div className="top-actions"><button className="icon-button"><Bell size={19}/><i/></button><button className="profile-chip"><div className="mini-avatar">{profile.full_name[0]}</div><span>{profile.full_name.split(' ')[0]}</span><ChevronDown size={16}/></button></div></header><div className="page"><Outlet/></div></main>
 </div>
}
