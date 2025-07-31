"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
const Sidebar = () => {
    const router = useRouter();
  return (
    <aside className="w-64 bg-zinc-950 flex flex-col px-4 py-6">
        <div className="text-2xl font-bold mb-8">Treeloo</div>
        <nav className="space-y-3">
          <Button variant="ghost" className="justify-start w-full text-left">Boards</Button>
          <Button onClick={()=>router.push('/dashboard')} variant="ghost" className="justify-start w-full text-left">Home</Button>
        </nav>
        <div className="mt-10">
          <div className="font-semibold mb-2 text-zinc-400">Workspaces</div>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <Avatar className="h-5 w-5 bg-green-500" />
              <span>EV Systems Engine Clup</span>
            </li>
            {/* Tambah workspace lain... */}
          </ul>
        </div>
      </aside>
  )
}

export default Sidebar
