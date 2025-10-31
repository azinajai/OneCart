const API_URL = "http://localhost:5000/api"; // Change to your backend URL when hosted

// ✅ Local fallback data (used when API is unavailable)
export const localProducts = [
  { id: 1, name: "Perfume", price: 50, image: "perfume.jpg",
    description:"A long-lasting fragrance with a blend of floral and woody notes that keeps you fresh all day." },
  { id: 2, name: "Luxury Watch", price: 250, image: "watch.jpg",
    description:"A premium stainless steel wristwatch with chronograph functionality and water resistance." },
  { id: 3, name: "Leather Shoes", price: 150, image: "shoes.jpg",
    description:"Stylish and durable handcrafted leather shoes offering maximum comfort and a classic look." },
  { id: 4, name: "iPhone 17 Pro Max", price: 1099, image: "i phone.jpg",
    description:"Apple’s latest flagship phone with A19 Bionic chip, ultra-retina XDR display, and triple-camera." },
  { id: 5, name: "Power Bank", price: 180, image: "power bank.jpg",
    description:"20,000mAh fast-charging power bank with dual USB ports and LED indicator." },
  { id: 6, name: "Shampoo", price: 250, image: "shampoo.jpg",
    description:"Enriched with natural extracts to nourish your hair and leave it silky smooth." },
  { id: 7, name: "Sunglasses", price: 150, image: "sunglasses.jpg",
    description:"UV-protected polarized sunglasses with sleek design for maximum comfort." },
  { id: 8, name: "GTA VI Game PS5 Edition", price: 450, image: "GTA vi.jpg",
    description:"Next-gen open-world gaming with stunning visuals and immersive storylines." },
  { id: 9, name: "Silver Bracelet", price: 150, image: "Silver bracelet.jpg",
    description:"Elegant and timeless silver bracelet crafted with precision." },
  { id: 10, name: "Headphones", price: 450, image: "Headphones.jpg",
    description:"Wireless over-ear headphones with deep bass, noise cancellation, and long battery." },
  { id: 11, name: "MacBook M4", price: 200, image: "mac.jpg",
    description:"Apple MacBook M4 with M4 chip, Liquid Retina display, and all-day battery." },
  { id: 12, name: "Nothing Mobile", price: 2990, image: "Nothing.jpg",
    description:"Futuristic smartphone with transparent design and next-gen performance." }
];

// ✅ Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Using LOCAL PRODUCTS instead of API:", error.message);
    return localProducts;
  }
};

// ✅ Fetch single product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch {
    return localProducts.find((p) => p.id === parseInt(id));
  }
};

// ✅ User registration
export const registerUser = async (username, password) =>
  (
    await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
  ).json();

// ✅ Login
export const loginUser = async (username, password) =>
  (
    await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
  ).json();

// ✅ Place order
export const placeOrderAPI = async (order) =>
  (
    await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
  ).json();
