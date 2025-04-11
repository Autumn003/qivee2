"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { productSchema } from "schemas/product-schema";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "actions/product.action";
import { toast } from "sonner";

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductFormValues[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductFormValues | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const response = await getAllProducts();
      if (response.success) {
        setProducts(response.products);
      } else {
        console.error("Failed to fetch products:", response.error);
      }
    }
    fetchProducts();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "baby_products",
      stock: 1,
      images: [],
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.reset({
      name: "",
      description: "",
      price: 0,
      category: "baby_products",
      stock: 1,
      images: [],
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("category", data.category);
      formData.append("stock", String(data.stock));

      // Append images properly
      if (data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("images[]", image);
        });
      }

      if (editingProduct) {
        const response = await updateProduct(editingProduct.id || "", formData);

        if (response.error) {
          console.error("Error while updating product: ", response.error);
          toast.error("Failed to update product");
          return;
        }

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? response.updatedProduct : p
          )
        );
        toast.success("Product updated successfully");
      } else {
        const response = await createProduct(formData);

        if (response.error) {
          console.error("Validation Error:", response.error);
          toast.error("Failed to create product");
          return;
        }
        setProducts((prev) => [response.product, ...prev]);
        toast.success("Product created successfully");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: (typeof products)[0]) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteProduct(id);

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              form.reset();
              setIsModalOpen(true);
            }}
            className="bg-primary-foreground text-primary-background cursor-pointer px-4 py-2 rounded-lg flex items-center hover:bg-primary-foreground/80 transition-colors duration-150"
          >
            <i className="ri-add-line text-lg mr-2"></i>
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground text-lg"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring focus:ring-primary-foreground/20"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-late-background rounded-lg border border-muted-foreground overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted-foreground bg-muted-background/50">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-muted-foreground"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <i className="ri-image-line text-2xl text-muted-foreground"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-secondary-foreground">
                            {product.category
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      {new Date(product.createdAt || "").toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(product.id || "")}
                              className="p-2 hover:bg-destructive/10 rounded-md cursor-pointer text-destructive"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="animate-spin">
                                  <i className="ri-loader-4-line text-xl"></i>
                                </div>
                              ) : (
                                <i className="ri-check-line text-2xl"></i>
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-2 text-secondary-foreground hover:text-primary-foreground transition-colors duration-150"
                            >
                              <i className="ri-close-line text-2xl"></i>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 rounded-md text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-all duration-150"
                            >
                              <i className="ri-edit-box-line text-xl"></i>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmId(product.id || "")
                              }
                              className="p-2 text-secondary-foreground hover:text-destructive cursor-pointer transition-colors duration-150"
                            >
                              <i className="ri-delete-bin-6-line text-xl"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-error-warning-line text-6xl mx-auto text-muted-foreground"></i>
              <h2 className="mt-4 text-lg font-medium text-foreground">
                No products found
              </h2>
              <p className="mt-2 text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Try to search another product"}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-primary-background/90 backdrop-blur-sm z-50">
            <div className="fixed inset-0 flex items-center justify-center p-4 ">
              <div className="bg-late-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-muted-foreground custom-scrollbar">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-secondary rounded-md text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-colors duration-150"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Product Name
                      </label>
                      <input
                        {...form.register("name")}
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                      />
                      {form.formState.errors.name && (
                        <p className="mt-1 text-sm text-destructive">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        {...form.register("description")}
                        rows={3}
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                      />
                      {form.formState.errors.description && (
                        <p className="mt-1 text-sm text-destructive">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Price
                        </label>
                        <input
                          {...form.register("price")}
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                        />
                        {form.formState.errors.price && (
                          <p className="mt-1 text-sm text-destructive">
                            {form.formState.errors.price.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Stock
                        </label>
                        <input
                          {...form.register("stock")}
                          type="number"
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                        />
                        {form.formState.errors.stock && (
                          <p className="mt-1 text-sm text-destructive">
                            {form.formState.errors.stock.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Category
                        </label>
                        <select
                          {...form.register("category")}
                          className="px-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary-background"
                        >
                          <option value="baby_products">Baby Products</option>
                          <option value="mobile_accessories">
                            Mobile Accessories
                          </option>
                          <option value="women_bagpacks">Women Bagpacks</option>
                        </select>
                        {form.formState.errors.category && (
                          <p className="mt-1 text-sm text-destructive">
                            {form.formState.errors.category.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Image URLs
                      </label>
                      <div className="space-y-2">
                        {form.watch("images")?.map((url, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              value={url}
                              onChange={(e) => {
                                const newImages = [...form.watch("images")];
                                newImages[index] = e.target.value;
                                form.setValue("images", newImages);
                              }}
                              className="flex-1 px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = form
                                  .watch("images")
                                  .filter((_, i) => i !== index);
                                form.setValue("images", newImages);
                              }}
                              className="p-2 rounded-md text-secondary-foreground hover:text-destructive cursor-pointer duration-150"
                            >
                              <i className="ri-close-line text-2xl"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const currentImages = form.watch("images") || [];
                            form.setValue("images", [...currentImages, ""]);
                          }}
                          className="text-sm text-secondary-foreground hover:text-primary-foreground flex items-center cursor-pointer transition-colors duration-150 border border-muted-foreground hover:border-secondary-background/40 p-1 rounded-md"
                        >
                          <i className="ri-add-line mr-1"></i>
                          Add Image URL
                        </button>
                      </div>
                      {form.formState.errors.images && (
                        <p className="mt-1 text-sm text-destructive">
                          {form.formState.errors.images.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-colors duration-150"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md hover:bg-primary-foreground/80 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                      >
                        {isLoading && (
                          <div className="animate-spin mr-1">
                            <i className="ri-loader-4-line text-lg"></i>
                          </div>
                        )}
                        {editingProduct ? "Update Product" : "Add Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
