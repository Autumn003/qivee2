import { FeaturedCard } from "@/components";
import { Carousel } from "@/components/carousel";
import Link from "next/link";
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
      id: 1,
      name: "Classic White Sneakers",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    },
    {
      id: 2,
      name: "Leather Tote Bag",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    },
    {
      id: 3,
      name: "Minimal Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
    },
    {
      id: 4,
      name: "Silk Summer Dress",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    },
  ];

  const features = [
    {
      icon: "ri-shopping-bag-3-line",
      title: "Premium Selection",
      description:
        "Curated collection of high-quality footwear from top brands",
    },
    {
      icon: "ri-truck-line",
      title: "Fast Delivery",
      description: "Free shipping on orders over ₹999 with 3-day delivery",
    },
    {
      icon: "ri-shield-line",
      title: "Secure Shopping",
      description: "100% secure payment processing and buyer protection",
    },
  ];

  const whyChooseUs = [
    {
      icon: "ri-award-line",
      title: "Authentic Products",
      description:
        "100% authentic products directly from manufacturers with quality assurance",
      stat: "100+",
      statLabel: "Genuine Products",
    },
    {
      icon: "ri-refresh-line",
      title: "Easy Returns",
      description:
        "Hassle-free 15-day returns with our no-questions-asked policy",
      stat: "15",
      statLabel: "Day Returns",
    },
    {
      icon: "ri-time-line",
      title: "Fast Shipping",
      description:
        "Quick delivery with real-time tracking and updates on your order",
      stat: "Fast",
      statLabel: "Delivery",
    },
    {
      icon: "ri-headphone-line",
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you anytime",
      stat: "24/7",
      statLabel: "Support",
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
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group"
            >
              <FeaturedCard
                title={product.name}
                imageURL={product.image}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted-background/30 dark:bg-muted-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-muted-foreground p-6 hover:border-primary-foreground/50 transition-colors duration-200"
              >
                <i className={`${feature.icon} text-4xl`}></i>
                <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-secondary-foreground/50">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="py-16 bg-muted-background/30 dark:bg-muted-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Us</h2>
            <p className="mt-4 text-lg text-secondary-foreground">
              We're committed to providing the best shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-muted-background/40 rounded-lg border border-muted-foreground p-6 hover:border-primary-foreground/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-background/10">
                  <i className={`${item.icon} text-2xl`}></i>
                </div>
                <div className="mt-4 text-2xl font-bold">{item.stat}</div>
                <div className="text-sm">{item.statLabel}</div>
                <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-secondary-foreground/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
