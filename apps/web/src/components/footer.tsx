import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="border-muted-background border-t px-8">
      <div className="flex flex-col gap-10 py-14 md:flex-row md:gap-0">
        <div className="w-full">
          <Link href="/" className="col-span-2 flex items-center gap-1">
            <Image
              src="/media/logo.webp"
              alt="logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div className="-mb-1 flex items-end gap-1">
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
          <div className="text-secondary-foreground my-5 flex flex-col gap-4 text-sm px-2">
            <p className="">
              Your premier destination for quality products and exceptional
              shopping experience.
            </p>
            <div className="flex gap-2">
              <i className="ri-map-pin-line"></i>
              <p>
                Office no.27, Rc plaza Ground floor, Kirari Suleman Nagar, Dli -
                110086
              </p>
            </div>
            <div className="flex gap-2">
              <i className="ri-phone-line"></i>
              <p>+91 8448-820-500</p>
            </div>
            <div className="flex gap-2">
              <i className="ri-mail-line"></i>
              <p>help.qivee@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="w-full"></div>
        <div className="flex w-full">
          <div className="flex w-full flex-col">
            <div className="text-secondary-foreground flex flex-col gap-8 text-sm">
              <h1 className="text-primary-foreground text-xl font-semibold">
                Quick Links
              </h1>
              <Link
                href="/new-arrivals"
                className="hover:text-primary-foreground transition-colors duration-200"
              >
                New Arrivals
              </Link>
              <Link
                href="/featured"
                className="hover:text-primary-foreground transition-colors duration-200"
              >
                Featured
              </Link>
              <Link
                href="/orders"
                className="hover:text-primary-foreground transition-colors duration-200"
              >
                My Orders
              </Link>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <div className="text-secondary-foreground flex flex-col gap-8 text-sm">
              <h1 className="text-primary-foreground text-xl font-semibold">
                Customer Service
              </h1>
              <a
                href="mailto:help.qivee@gmail.com"
                target="_blank"
                className="hover:text-primary-foreground transition-colors duration-200"
              >
                Email us
              </a>
              <Link
                href="https://wa.me/8448820500"
                target="_blank"
                className="hover:text-primary-foreground transition-colors duration-200"
              >
                WhatsApp us
              </Link>
              <Link
                href="/faq"
                target="_blank"
                className="hover:text-primary-foreground transition-colors duration-200"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-secondary-foreground py-10 text-center text-sm">
        <p>© {new Date().getFullYear()} Qivee. All rights reserved</p>
      </footer>
    </div>
  );
}
