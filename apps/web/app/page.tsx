import { Carousel } from "@/components/carousel";
import { PrismaClient } from "@repo/db/client";
import Link from "next/link";
const client = new PrismaClient();

export default function Home() {
  const heroSlides = [
    {
      url: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      title: "Bagpacks",
      description: "Carry your essentials in style with our premium backpacks.",
      cta: {
        text: "Shop Now",
        link: "/products?category=women-bagpacks",
      },
    },
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      title: "Miobile Accessories",
      description:
        "Enhance your mobile experience with top-quality accessories.",
      cta: {
        text: "Explore Collection",
        link: "/products?category=mobile-accessories",
      },
    },
    {
      url: "/media/baby.jpg",
      title: "Baby Products",
      description: "Ensure comfort and care with our premium baby products.",
      cta: {
        text: "Explore Collection",
        link: "/products?category=baby-products",
      },
    },
  ];
  const categories = [
    {
      name: "All",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2",
      target: "/products",
    },
    {
      name: "Women Bagpacks",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      target: "/products?category=women-bagpacks",
    },
    {
      name: "Mobile Accessories",
      image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
      target: "/products?category=mobile-accessories",
    },
    {
      name: "Baby Products",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      target: "/products?category=baby-products",
    },
  ];

  const featuredProducts = [
    {
      name: "Classic White Sneakers",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    },
    {
      name: "Leather Tote Bag",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    },
    {
      name: "Minimal Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
    },
    {
      name: "Silk Summer Dress",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    },
  ];
  return (
    <div>
      {/* Hero Section */}
      <section className="h-96 mb-20">
        <Carousel slides={heroSlides} className="h-full w-full" />
      </section>

      {/* Categories */}
      <section className="container mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.target}
              className="group relative rounded-lg overflow-hidden h-64"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link href="/" key={product.name} className="group">
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 bg-white/30 text-white backdrop-blur-2xl h-10 w-10 rounded-full opacity-0 group-hover:opacity-100  hover:text-red-500 cursor-pointer hover:bg-red-400/30 transition-all duration-200">
                  <i className="ri-poker-hearts-line text-xl"></i>
                </button>
              </div>
              <h3 className="font-medium mb-2">{product.name}</h3>
              <p className="text-secondary-foreground">${product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-muted-background py-16 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <i className="ri-box-1-line text-4xl "> </i>
              <h3 className="font-semibold mb-2 mt-5">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over ₹299</p>
            </div>
            <div className="text-center">
              <i className="ri-truck-line text-4xl "></i>
              <h3 className="font-semibold mb-2 mt-5">Fast Delivery</h3>
              <p className="text-sm text-gray-600">2-3 business days</p>
            </div>
            <div className="text-center">
              <i className="ri-shield-line text-4xl"></i>
              <h3 className="font-semibold mb-2 mt-5">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure checkout</p>
            </div>
            <div className="text-center">
              <i className="ri-customer-service-line text-4xl"></i>
              <h3 className="font-semibold mb-2 mt-5">24/7 Support</h3>
              <p className="text-sm text-gray-600">Here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto mb-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get 10% off your first order and stay updated with the latest trends
          </p>
          <form className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-black"
            />
            <button
              type="submit"
              className="px-8 py-2 bg-primary-foreground text-primary-background rounded-full cursor-pointer transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
