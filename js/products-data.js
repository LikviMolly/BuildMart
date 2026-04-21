window.BUILDMART_PRODUCTS = [
  {
    id: "exterior-paint-set",
    name: "Exterior Paint Set",
    rating: 3.5,
    price: 45.99,
    category: "Paint & Coatings",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185130a7f0c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589939705384-5185130a7f0c?w=800&q=80",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
      "https://images.unsplash.com/photo-1494389544920-244904cb185a?w=800&q=80",
    ],
    description:
      "Professional-grade exterior paint formulated for durability and weather resistance. Ideal for residential and commercial facades, this set includes primer-compatible topcoat with excellent coverage and a smooth finish that lasts for years.",
  },
  {
    id: "plywood-sheets",
    name: "Plywood Sheets",
    rating: 4.5,
    price: 52.99,
    category: "Wood & Lumber",
    image:
      "https://images.unsplash.com/photo-1541123603104-512fce293344?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541123603104-512fce293344?w=800&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185130a7f0c?w=800&q=80",
    ],
    description:
      "High-quality structural plywood sheets, sanded smooth for cabinetry and construction. Suitable for interior and protected exterior applications.",
  },
  {
    id: "premium-cement-bags",
    name: "Premium Cement Bags",
    rating: 5,
    price: 24.99,
    category: "Cement & Concrete",
    image:
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      "https://images.unsplash.com/photo-1541123603104-512fce293344?w=800&q=80",
    ],
    description:
      "Type I Portland cement blend for foundations, slabs, and repairs. Consistent setting time and high compressive strength.",
  },
  {
    id: "premium-lumber-planks",
    name: "Premium Lumber Planks",
    rating: 4.5,
    price: 89.99,
    category: "Wood & Lumber",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      "https://images.unsplash.com/photo-1541123603104-512fce293344?w=800&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185130a7f0c?w=800&q=80",
    ],
    description:
      "Kiln-dried premium planks, straight-grained and ready for finishing. Perfect for decking, framing, and visible woodwork.",
  },
  {
    id: "red-clay-bricks",
    name: "Red Clay Bricks",
    rating: 4,
    price: 0.89,
    category: "Bricks & Blocks",
    image:
      "https://images.unsplash.com/photo-1595846517345-68e3e368ccb8?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595846517345-68e3e368ccb8?w=800&q=80",
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    ],
    description:
      "Classic red clay bricks fired for strength and color retention. Sold per unit for small repairs or sample orders.",
  },
  {
    id: "steel-i-beams",
    name: "Steel I-Beams",
    rating: 5,
    price: 349.99,
    category: "Steel & Metal",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
      "https://images.unsplash.com/photo-1595846517345-68e3e368ccb8?w=800&q=80",
    ],
    description:
      "Structural steel I-beams for load-bearing applications. Mill-certified and ready for engineering review.",
  },
];

window.buildMartGetProductById = function (id) {
  return window.BUILDMART_PRODUCTS.find((p) => p.id === id) || null;
};
