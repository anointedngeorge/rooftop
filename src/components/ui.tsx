import { X, LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

export function Button({className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={`button ${className}`} {...props}/>} 
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:'neutral'|'success'|'warning'|'danger'|'info'}){return <span className={`badge badge-${tone}`}>{children}</span>}
export function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className={`modal ${wide?'modal-wide':''}`} role="dialog" aria-modal="true"><header><div><p className="eyebrow">Rooftop Hub</p><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20}/></button></header>{children}</section></div>}
export function EmptyState({title,body,action}:{title:string;body:string;action?:ReactNode}){return <div className="empty"><div className="empty-mark">RH</div><h3>{title}</h3><p>{body}</p>{action}</div>}
export function Spinner(){return <div className="spinner"><LoaderCircle className="spin"/> Loading...</div>}
export function Card({children,className=''}:PropsWithChildren<{className?:string}>){return <section className={`card ${className}`}>{children}</section>}
