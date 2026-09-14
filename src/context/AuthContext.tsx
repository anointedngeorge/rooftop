import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile, Role } from '../types'

type AuthState = { session: Session | null; profile: Profile | null; loading: boolean; demoRole: Role | null; signIn: (email:string,password:string)=>Promise<void>; signOut:()=>Promise<void>; enterDemo:(role:Role)=>void }
const AuthContext = createContext<AuthState | null>(null)

const demoProfiles: Record<Role, Profile> = {
  super_admin:{id:'demo-admin',full_name:'Amaka Okafor',email:'admin@rooftophub.demo',role:'super_admin',status:'active'},
  staff:{id:'demo-staff',full_name:'Daniel Obi',email:'daniel@rooftophub.demo',role:'staff',status:'active'},
  marketer:{id:'demo-marketer',full_name:'Ada Nwosu',email:'ada@rooftophub.demo',role:'marketer',status:'active'},
  partner:{id:'demo-partner',full_name:'Ikenna Eze',email:'ikenna@rooftophub.demo',role:'partner',status:'active'},
  customer:{id:'demo-customer',full_name:'Chidinma Eze',email:'chidinma@example.com',role:'customer',status:'active'},
}

export function AuthProvider({children}:PropsWithChildren){
  const [session,setSession]=useState<Session|null>(null); const [profile,setProfile]=useState<Profile|null>(null); const [loading,setLoading]=useState(true); const [demoRole,setDemoRole]=useState<Role|null>(null)
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)}); const {data}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);if(!s)setProfile(null)}); return()=>data.subscription.unsubscribe() },[])
  useEffect(()=>{ if(!session?.user)return; supabase.from('profiles').select('*').eq('id',session.user.id).single().then(({data})=>setProfile(data as Profile)) },[session])
  const value=useMemo<AuthState>(()=>({session,profile:demoRole?demoProfiles[demoRole]:profile,loading,demoRole,
    signIn:async(email,password)=>{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error},
    signOut:async()=>{setDemoRole(null);if(session)await supabase.auth.signOut()},enterDemo:(role)=>{setDemoRole(role);setLoading(false)}}),[session,profile,loading,demoRole])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth=()=>{const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider missing');return value}
