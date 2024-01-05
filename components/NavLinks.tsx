'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NavLinks = () => {
  const currentRoute = usePathname()

  return (
    <div className="space-x-4 space-y-2">
      {/* <Link className={`inline-flex ${currentRoute === '/' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`} href='/'>Duplicates</Link>
      <Link className={`inline-flex ${currentRoute === '/notregistered' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/notregistered'>Not&nbsp;Registered</Link>*/}
      {/* <Link className={`inline-flex ${currentRoute === '/households' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/households'>Households</Link> */}
      {/* <Link className={`inline-flex ${currentRoute === '/heads' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/heads'>Head&nbsp;SP</Link> */}
      <Link className={`inline-flex ${currentRoute === '/spmembers' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/spmembers'>SP Members</Link>
      <Link className={`inline-flex ${currentRoute === '/spmasterlist' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/spmasterlist'>SP Masterlist</Link>
      <Link className={`inline-flex ${currentRoute === '/spmembersotherbrgy' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/spmembersotherbrgy'>Other Barangay SP</Link>
      <Link className={`inline-flex ${currentRoute === '/search' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/search'>Search</Link>
    </div>
  )
}
