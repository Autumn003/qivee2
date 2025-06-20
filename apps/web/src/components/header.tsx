"use client";

import Image from "next/image";
import "remixicon/fonts/remixicon.css";
import Link from "next/link";
import { useState } from "react";
import Dropdown from "./drop-down";
import ThemeToggler from "./theme-toggler";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuOpner = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-primary-background relative">
      <div className="bg-primary-background/30 fixed top-0 left-0 z-50 container hidden h-16 max-w-[88rem] grid-cols-12 px-8 backdrop-blur-md lg:grid">
        <Link href="/" className="col-span-2 flex items-center gap-2">
          <Image
            src="/media/logo.webp"
            alt="logo"
            width={28}
            height={28}
            className="rounded-lg bg-primary-background p-0.5"
          />
          <div className="flex items-end gap-1">
            <div className="-mb-1 flex items-end gap-1">
              <h1 className="text-primary-foreground text-2xl font-semibold">
                Qivee
              </h1>
              <p className=" text-secondary-foreground mb-1 rounded-md px-[2px] text-sm font-light">
                <i className="ri-shopping-bag-3-line"></i>
              </p>
            </div>
          </div>
        </Link>
        <div className="col-span-8 flex items-center gap-8 px-4 text-[15px] font-semibold">
          <Dropdown />

          <Link
            href="/new-arrivals"
            className="text-secondary-foreground hover:text-primary-foreground transition-colors duration-200 hover:cursor-pointer "
          >
            New Arrivals
          </Link>
          <Link
            href="/featured"
            className="text-secondary-foreground hover:text-primary-foreground transition-colors duration-200 hover:cursor-pointer"
          >
            Featured
          </Link>
          <Link
            href="/accesories"
            className="text-secondary-foreground hover:text-primary-foreground transition-colors duration-200 hover:cursor-pointer"
          >
            Accesories
          </Link>
        </div>
        <div className="col-span-2 flex items-center justify-around">
          <ThemeToggler />

          <Link
            href="/wishlist"
            className="text-secondary-foreground hover:text-primary-foreground text-[22px] transition-colors duration-200 hover:cursor-pointer"
          >
            <i className="ri-heart-line"></i>
          </Link>
          <Link
            href="/cart"
            className="text-secondary-foreground hover:text-primary-foreground text-[22px] transition-colors duration-200 hover:cursor-pointer"
          >
            <i className="ri-shopping-cart-line"></i>
          </Link>
          <Link
            href="/dashboard"
            className="text-secondary-foreground hover:text-primary-foreground text-2xl transition-colors duration-200 hover:cursor-pointer"
          >
            <i className="ri-user-line"></i>
          </Link>
        </div>
      </div>
      {isOpen ? (
        <div className="bg-primary-background/30 fixed top-0 z-40 flex h-full w-dvw flex-col gap-12 px-10 py-6 backdrop-blur-md transition-all duration-300 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex h-fit gap-2">
              <Image
                src="/media/logo.webp"
                alt="logo"
                width={28}
                height={28}
                className="h-fit rounded-lg bg-primary-background p-0.5"
              />
              <div className="text-accent-foreground -mb-1 flex items-end gap-1">
                <h1 className="text-primary-foreground text-2xl font-semibold">
                  Qivee
                </h1>
                <p className=" text-secondary-foreground mb-1 rounded-md  px-[1.5px] text-sm font-light">
                  <i className="ri-shopping-bag-3-line"></i>
                </p>
              </div>
            </Link>
            <div>
              <ThemeToggler />
              <button onClick={handleMenuOpner}>
                <i className="ri-close-large-line text-secondary-foreground ml-4 text-xl"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-8 px-4 font-semibold">
            <Dropdown />
            <Link
              href="/new-arrivals"
              className="text-secondary-foreground  transition-colors duration-200 hover:cursor-pointer"
            >
              New Arrivals
            </Link>
            <Link
              href="/featured"
              className="text-secondary-foreground transition-colors duration-200 hover:cursor-pointer"
            >
              Featured
            </Link>
            <Link
              href="/accesories"
              className="text-secondary-foreground transition-colors duration-200 hover:cursor-pointer"
            >
              Accesories
            </Link>
          </div>
          <div className="flex gap-5 px-4">
            <Link
              href="/wishlist"
              className="text-secondary-foreground hover:text-primary-foreground text-[22px] transition-colors duration-200 hover:cursor-pointer"
            >
              <i className="ri-heart-line"></i>
            </Link>
            <Link
              href="/cart"
              className="text-secondary-foreground hover:text-primary-foreground text-[22px] transition-colors duration-200 hover:cursor-pointer"
            >
              <i className="ri-shopping-cart-line"></i>
            </Link>
            <Link
              href="/dashboard"
              className="text-secondary-foreground hover:text-primary-foreground text-2xl transition-colors duration-200 hover:cursor-pointer"
            >
              <i className="ri-user-line"></i>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-primary-background/30 fixed top-0 z-50 flex w-full items-center justify-between p-4 backdrop-blur-md transition-all duration-400 lg:hidden">
          <Link href="/" className="col-span-2 flex items-center gap-2">
            <Image
              src="/media/logo.webp"
              alt="logo"
              width={28}
              height={28}
              className="rounded-lg bg-primary-background p-0.5"
            />
          </Link>
          <button onClick={handleMenuOpner}>
            <i className="ri-menu-3-line text-secondary-foreground ml-4 text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};
