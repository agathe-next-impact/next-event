"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/events", label: "Événements" },
  { href: "/speakers", label: "Speakers" },
  { href: "/about", label: "À propos" },
  { href: "/become-speaker", label: "Devenir Speaker" },
  { href: "/contact", label: "Contact" },
]

export default function MobileMenu() {
  const [activePath, setActivePath] = useState("")
  useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-6 w-6 text-accent" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="p-0 pt-6 pb-8 bg-background/95 backdrop-blur-xl border-b-0 rounded-b-3xl shadow-xl">
          <div className="flex items-center justify-center py-4">
            <Image
              src="/images/logo-next-event.png"
              alt="Logo Next Event"
              width={140}
              height={40}
              className="object-contain drop-shadow-lg"
              placeholder="blur"
              blurDataURL="/images/logo-next-event.png"
              sizes="140px"
              priority
            />
          </div>
          <nav>
            <ul className="flex flex-col gap-2 px-6">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="block py-3 px-6"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
