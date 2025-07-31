"use client";
import { useBoards } from "@/hook/useBoard";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import  Link from "next/link";
export default function KanbanProject({ session,children }: { session: any, children?: React.ReactNode }) {
  const { boards, addBoard } = useBoards();
  const [newName, setNewName] = useState("");

  function handleCreate() {
    if (newName.trim()) {
      addBoard(newName.trim(), session.user.id);
      setNewName("");
    }
  }
  
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex">
      {/* Sidebar */}
      {children}
      

      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col gap-8">
        {/* Recently Viewed */}
        <section>
          <div className="font-bold mb-3 text-xl">Recently viewed</div>
          <div className="flex gap-4">
            {boards.slice(-4).reverse().map(b => (
              <div key={b.id} className="bg-zinc-800 rounded-md w-44 h-20 flex items-end p-2 cursor-pointer hover:bg-zinc-700">
                <div className="font-semibold">{b.name}</div>
              </div>
            ))}
          </div>
        </section>
        {/* Your Workspaces */}
        <section>
          <div className="font-bold mb-3 text-xl">Your Workspaces</div>
          <div className="mb-2 flex items-center gap-2">
            <Avatar className="h-6 w-6 bg-green-500" />
            <span className="font-medium">EV Systems Engine Clup</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {boards.map(b => (
            <Link legacyBehavior href={`/dashboard/${b.id}`} key={b.id}>
              <div key={b.id} className="bg-zinc-800 rounded-md w-44 h-20 flex items-end p-2 cursor-pointer hover:bg-zinc-700">
                <div className="font-semibold">{b.name}</div>
              </div>
            </Link>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-44 h-20 flex items-center justify-center">Create new board</Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-zinc-900 bg-amber-300">
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-lg">Create Board</div>
                  <Input
                    placeholder="Board name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="dark:text-white text-white"
                  />
                  <Button onClick={handleCreate}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>

      {/* Profile */}
      <div className="absolute top-4 right-6">
        <Avatar className="h-8 w-8 bg-zinc-700" />
      </div>
    </div>
  );
}
