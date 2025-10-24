"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconChartBar,
  IconArrowLeft,
  IconBox,
  IconFileInvoice,
  IconBuildingWarehouse,
  IconClipboardList,
  IconTruckDelivery, // <-- Añadido
  IconHistory,
  IconCreditCardPay
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
     href: "/dashboard",
     icon: (
       <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
     ),
   },
    {
      label: "Productos",
      href: "/productos",
      icon: (
        <IconBox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "Depósitos",
      href: "/depositos",
      icon: (
        <IconBuildingWarehouse className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "Proveedores", // <-- Añadido
      href: "/proveedores",
      icon: (
          <IconTruckDelivery className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "movimientos",
      href: "/movimientos",
      icon: (
        <IconHistory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "Orden De Compra",
      href: "/orden-de-compra",
      icon: (
        <IconFileInvoice className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "Comprobantes",
      href: "/comprobantes",
      icon: (
        <IconClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "Orden de Pago",
      href: "/orden-de-pago",
      icon: (
        <IconCreditCardPay className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-900" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md bg-gray-100 md:flex-row dark:bg-gray-100",
        "h-dvh",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8  flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Usuario",
                href: "#",
                icon: (
                  <img
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="hidden" />
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black "
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-gray-400" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-black"
      >
        PetSalud
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-gray-400" />
    </a>
  );
};