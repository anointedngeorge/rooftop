import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.116.0'

const cors={ 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json' }
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
 try{
  const auth=req.headers.get('Authorization');if(!auth)throw new Error('Authentication required')
  const url=Deno.env.get('SUPABASE_URL')!;const publishable=Deno.env.get('SUPABASE_ANON_KEY')!;const serviceRole=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const caller=createClient(url,publishable,{global:{headers:{Authorization:auth}}});const {data:{user}}=await caller.auth.getUser();if(!user)throw new Error('Invalid session')
  const {data:profile}=await caller.from('profiles').select('role,status').eq('id',user.id).single();if(profile?.role!=='super_admin'||profile.status!=='active')throw new Error('Super Admin access required')
  const admin=createClient(url,serviceRole,{auth:{autoRefreshToken:false,persistSession:false}});const body=await req.json();const action=body.action as string
  if(action==='create'){const v=body.values;const {data,error}=await admin.auth.admin.createUser({email:v.email,password:v.temporary_password||crypto.randomUUID(),email_confirm:true,user_metadata:{full_name:v.full_name},app_metadata:{role:v.role}});if(error)throw error;await admin.from('profiles').update({full_name:v.full_name,phone:v.phone||null,role:v.role,status:v.status||'active'}).eq('id',data.user.id);return new Response(JSON.stringify({id:data.user.id}),{headers:cors})}
  if(action==='update'){const {temporary_password,...v}=body.values;const authUpdate:Record<string,unknown>={email:v.email,app_metadata:{role:v.role},user_metadata:{full_name:v.full_name}};if(temporary_password)authUpdate.password=temporary_password;const {error}=await admin.auth.admin.updateUserById(body.id,authUpdate);if(error)throw error;const {data,error:updateError}=await admin.from('profiles').update(v).eq('id',body.id).select().single();if(updateError)throw updateError;return new Response(JSON.stringify(data),{headers:cors})}
  if(action==='delete'){if(body.id===user.id)throw new Error('You cannot delete your own account');const {error}=await admin.auth.admin.deleteUser(body.id);if(error)throw error;return new Response(JSON.stringify({ok:true}),{headers:cors})}
  throw new Error('Unsupported action')
 }catch(error){return new Response(JSON.stringify({error:error instanceof Error?error.message:'Request failed'}),{status:400,headers:cors})}
})
