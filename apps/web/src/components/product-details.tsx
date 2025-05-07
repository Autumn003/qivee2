"use client";

import { FeaturedCard } from "@/components";
import { getproductById, getRecommendedProducts } from "actions/product.action";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useParams } from "next/navigation";
import { addToCart } from "actions/cart.action";
import { addToWishlist } from "actions/wishlist.action";
import { toast } from "sonner";

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { id: productId } = useParams() as { id: string };

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const shortDescription =
    product?.description?.split(" ").slice(0, 40).join(" ") + "...";

  const addToCartHandler = async () => {
    try {
      setLoading(true);
      const response = await addToCart(productId, 1);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlistHandler = async () => {
    try {
      setWishlistLoading(true);
      const response = await addToWishlist(productId);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      toast.success("Product added to wishlist");
    } catch (error) {
      console.error("Error while adding product to wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const shareHandler = () => {
    if (navigator.share) {
      const shareText = `Check out this product from Qivee: ${product?.name} - $${product?.price}`;

      navigator
        .share({
          title: "Product Share",
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const response = await getproductById(productId || "");
        if (response?.success) {
          setProduct(response.product);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      const fetchRecommendedProducts = async () => {
        const response = await getRecommendedProducts(
          product.id,
          product.category
        );
        if (response?.success) {
          setRecommendedProducts(response.products);
        }
      };
      fetchRecommendedProducts();
    }
  }, [product]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-secondary-foreground hover:text-primary-foreground mb-8 hover:bg-secondary-background/10 px-3 transition-all duration-150 py-1 rounded-full"
        >
          <i className="ri-arrow-left-line text-xl mr-2"></i>
          Back to Products
        </Link>

        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}

            <div className="space-y-4 lg:flex gap-4 lg:max-h-[30rem]">
              <div className="lg:grid grid-rows-4 hidden">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden w-26 ${
                      selectedImage === idx ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
              <div className="aspect-square flex justify-center overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className=" w-full h-full object-cover rounded-lg object-center"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 lg:hidden">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                      selectedImage === idx ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 space-y-2">
                  <p className="text-2xl font-semibold text-primary-foreground">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <p className="text-secondary-foreground leading-relaxed">
                {product?.description && (
                  <>
                    {isMobileView && !showFullDescription
                      ? shortDescription
                      : product.description}
                    {isMobileView &&
                      product.description.split(" ").length > 50 && (
                        <button
                          onClick={toggleDescription}
                          className="text-primary ml-2 underline"
                        >
                          {showFullDescription ? "Show Less" : "More"}
                        </button>
                      )}
                  </>
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 ">
                <button
                  onClick={addToCartHandler}
                  className="flex-1 font-medium bg-primary-foreground text-primary-background px-4 py-2 rounded-lg cursor-pointer"
                >
                  {loading ? (
                    <div className=" flex items-center gap-2 justify-center">
                      <div className="animate-spin">
                        <i className="ri-loader-4-line text-xl"></i>
                      </div>
                      Add to Cart
                    </div>
                  ) : (
                    <div className=" flex items-center gap-2 justify-center">
                      <i className="ri-shopping-cart-line  text-xl"></i>
                      Add to Cart
                    </div>
                  )}
                </button>
                <button
                  onClick={addToWishlistHandler}
                  className="py-3 px-4 cursor-pointer rounded-lg bg-secondary-background text-primary-background "
                >
                  {wishlistLoading ? (
                    <div className="animate-spin">
                      <i className="ri-loader-4-line text-2xl"></i>
                    </div>
                  ) : (
                    <i className="ri-heart-line text-2xl"></i>
                  )}
                </button>
                <button
                  onClick={shareHandler}
                  className="py-3 px-4 cursor-pointer rounded-lg bg-secondary-background text-primary-background "
                >
                  <i className="ri-share-line text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECOMMENDED PRODUCTS */}
      <section className="container mx-auto my-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Recommended Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group"
            >
              <FeaturedCard
                title={product.name}
                imageURL={product.images[0] || ""}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
