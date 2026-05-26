export interface FashionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  style: string;
  season: string[];
  occasion: string[];
  color: string;
  priceRange: string;
}

export const fashionItems: FashionItem[] = [
  // Casual
  { id: "1", name: "Oversized Linen Shirt", description: "Relaxed-fit linen button-down in soft cream, perfect for warm weather layering with rolled sleeves", category: "Tops", style: "Casual", season: ["Spring", "Summer"], occasion: ["Brunch", "Beach", "Everyday"], color: "Cream", priceRange: "$$" },
  { id: "2", name: "High-Waisted Mom Jeans", description: "Vintage-inspired relaxed fit denim with a tapered leg, light wash with subtle distressing", category: "Bottoms", style: "Casual", season: ["Spring", "Fall", "Winter"], occasion: ["Everyday", "Shopping", "Coffee Date"], color: "Light Blue", priceRange: "$$" },
  { id: "3", name: "Chunky Knit Cardigan", description: "Cozy oversized cable-knit cardigan in oatmeal, perfect for layering on chilly autumn evenings", category: "Outerwear", style: "Casual", season: ["Fall", "Winter"], occasion: ["Cozy Night In", "Coffee Date", "Everyday"], color: "Oatmeal", priceRange: "$$" },
  { id: "4", name: "Canvas Sneakers", description: "Classic low-top canvas sneakers in white, goes with everything from jeans to sundresses", category: "Shoes", style: "Casual", season: ["Spring", "Summer", "Fall"], occasion: ["Everyday", "Walking", "Shopping"], color: "White", priceRange: "$" },
  { id: "5", name: "Cropped Graphic Tee", description: "Vintage band-inspired cropped t-shirt with faded print, pairs perfectly with high-waisted bottoms", category: "Tops", style: "Casual", season: ["Spring", "Summer"], occasion: ["Concert", "Everyday", "Festival"], color: "Black", priceRange: "$" },

  // Professional
  { id: "6", name: "Tailored Blazer", description: "Sharp single-breasted blazer in navy with subtle pinstripes, structured shoulders for a powerful silhouette", category: "Outerwear", style: "Professional", season: ["Fall", "Winter", "Spring"], occasion: ["Office", "Meeting", "Conference"], color: "Navy", priceRange: "$$$" },
  { id: "7", name: "Silk Blouse", description: "Elegant silk button-up blouse in ivory with a subtle sheen, perfect under a blazer or worn alone", category: "Tops", style: "Professional", season: ["Spring", "Summer", "Fall"], occasion: ["Office", "Presentation", "Business Dinner"], color: "Ivory", priceRange: "$$$" },
  { id: "8", name: "Pencil Skirt", description: "Classic knee-length pencil skirt in charcoal wool blend, timeless office staple with back slit", category: "Bottoms", style: "Professional", season: ["Fall", "Winter"], occasion: ["Office", "Meeting", "Interview"], color: "Charcoal", priceRange: "$$" },
  { id: "9", name: "Pointed-Toe Pumps", description: "Sleek black leather pumps with a 3-inch heel, comfortable enough for all-day wear at the office", category: "Shoes", style: "Professional", season: ["Spring", "Fall", "Winter"], occasion: ["Office", "Meeting", "Dinner"], color: "Black", priceRange: "$$$" },
  { id: "10", name: "Structured Tote Bag", description: "Minimalist leather tote in cognac with laptop compartment, professional yet stylish for commuting", category: "Accessories", style: "Professional", season: ["Spring", "Summer", "Fall", "Winter"], occasion: ["Office", "Travel", "Meeting"], color: "Cognac", priceRange: "$$$" },

  // Evening/Formal
  { id: "11", name: "Satin Slip Dress", description: "Elegant midi-length slip dress in emerald green satin with delicate spaghetti straps and cowl neck", category: "Dresses", style: "Evening", season: ["Spring", "Summer", "Fall"], occasion: ["Date Night", "Cocktail Party", "Wedding Guest"], color: "Emerald", priceRange: "$$$" },
  { id: "12", name: "Velvet Blazer", description: "Luxurious midnight blue velvet blazer with satin lapels, perfect for holiday parties and formal events", category: "Outerwear", style: "Evening", season: ["Fall", "Winter"], occasion: ["Holiday Party", "Gala", "Theater"], color: "Midnight Blue", priceRange: "$$$" },
  { id: "13", name: "Strappy Heeled Sandals", description: "Delicate gold metallic strappy sandals with a stiletto heel, adds glamour to any evening outfit", category: "Shoes", style: "Evening", season: ["Spring", "Summer"], occasion: ["Wedding", "Date Night", "Cocktail Party"], color: "Gold", priceRange: "$$$" },
  { id: "14", name: "Sequin Mini Skirt", description: "Dazzling silver sequin mini skirt that catches the light, perfect for New Year's Eve or club nights", category: "Bottoms", style: "Evening", season: ["Fall", "Winter"], occasion: ["New Year's Eve", "Club", "Birthday Party"], color: "Silver", priceRange: "$$" },
  { id: "15", name: "Statement Earrings", description: "Dramatic chandelier earrings with crystal drops, transforms any simple outfit into a showstopper", category: "Accessories", style: "Evening", season: ["Spring", "Summer", "Fall", "Winter"], occasion: ["Gala", "Wedding", "Date Night"], color: "Crystal", priceRange: "$$" },

  // Streetwear
  { id: "16", name: "Oversized Hoodie", description: "Heavy cotton oversized hoodie in washed black with dropped shoulders and kangaroo pocket", category: "Tops", style: "Streetwear", season: ["Fall", "Winter"], occasion: ["Everyday", "Concert", "Skatepark"], color: "Washed Black", priceRange: "$$" },
  { id: "17", name: "Cargo Pants", description: "Relaxed-fit cargo pants in olive with multiple utility pockets and adjustable ankle cuffs", category: "Bottoms", style: "Streetwear", season: ["Spring", "Fall"], occasion: ["Everyday", "Festival", "Concert"], color: "Olive", priceRange: "$$" },
  { id: "18", name: "Platform Boots", description: "Chunky black platform combat boots with thick lug sole and silver hardware details", category: "Shoes", style: "Streetwear", season: ["Fall", "Winter"], occasion: ["Concert", "Night Out", "Festival"], color: "Black", priceRange: "$$$" },
  { id: "19", name: "Bucket Hat", description: "Trendy corduroy bucket hat in rust orange, adds an effortless cool factor to any casual outfit", category: "Accessories", style: "Streetwear", season: ["Spring", "Fall"], occasion: ["Festival", "Everyday", "Shopping"], color: "Rust", priceRange: "$" },
  { id: "20", name: "Cropped Puffer Jacket", description: "Short cropped puffer jacket in lilac with high collar, warm yet fashion-forward for cold days", category: "Outerwear", style: "Streetwear", season: ["Fall", "Winter"], occasion: ["Everyday", "Concert", "Shopping"], color: "Lilac", priceRange: "$$" },

  // Bohemian
  { id: "21", name: "Flowy Maxi Dress", description: "Ethereal floral print maxi dress with tiered skirt and flutter sleeves, perfect for garden parties", category: "Dresses", style: "Bohemian", season: ["Spring", "Summer"], occasion: ["Garden Party", "Beach", "Vacation"], color: "Floral Multi", priceRange: "$$" },
  { id: "22", name: "Fringe Suede Bag", description: "Soft suede crossbody bag with long fringe detail in tan, adds boho charm to any outfit", category: "Accessories", style: "Bohemian", season: ["Spring", "Summer", "Fall"], occasion: ["Festival", "Vacation", "Brunch"], color: "Tan", priceRange: "$$" },
  { id: "23", name: "Embroidered Kimono", description: "Lightweight kimono jacket with intricate floral embroidery on sheer fabric, beautiful layering piece", category: "Outerwear", style: "Bohemian", season: ["Spring", "Summer"], occasion: ["Beach", "Festival", "Vacation"], color: "Dusty Rose", priceRange: "$$" },
  { id: "24", name: "Leather Sandals", description: "Handcrafted flat leather gladiator sandals with ankle straps, comfortable for all-day summer wear", category: "Shoes", style: "Bohemian", season: ["Spring", "Summer"], occasion: ["Beach", "Vacation", "Everyday"], color: "Brown", priceRange: "$$" },
  { id: "25", name: "Wide-Brim Straw Hat", description: "Oversized natural straw sun hat with ribbon trim, essential for beach days and outdoor events", category: "Accessories", style: "Bohemian", season: ["Spring", "Summer"], occasion: ["Beach", "Garden Party", "Vacation"], color: "Natural", priceRange: "$" },

  // Minimalist
  { id: "26", name: "Cashmere Crewneck", description: "Ultra-soft cashmere sweater in heather grey, clean lines and perfect fit for effortless elegance", category: "Tops", style: "Minimalist", season: ["Fall", "Winter"], occasion: ["Office", "Dinner", "Everyday"], color: "Heather Grey", priceRange: "$$$" },
  { id: "27", name: "Straight-Leg Trousers", description: "Perfectly tailored straight-leg trousers in black with pressed crease, versatile from office to dinner", category: "Bottoms", style: "Minimalist", season: ["Spring", "Fall", "Winter"], occasion: ["Office", "Dinner", "Meeting"], color: "Black", priceRange: "$$" },
  { id: "28", name: "White Leather Sneakers", description: "Clean minimal white leather sneakers with subtle branding, the perfect everyday shoe", category: "Shoes", style: "Minimalist", season: ["Spring", "Summer", "Fall"], occasion: ["Everyday", "Travel", "Brunch"], color: "White", priceRange: "$$" },
  { id: "29", name: "Trench Coat", description: "Classic double-breasted trench coat in camel with belt, timeless outerwear for transitional weather", category: "Outerwear", style: "Minimalist", season: ["Spring", "Fall"], occasion: ["Office", "Travel", "Everyday"], color: "Camel", priceRange: "$$$" },
  { id: "30", name: "Gold Chain Necklace", description: "Delicate layered gold chain necklace with small pendant, adds subtle elegance without being flashy", category: "Accessories", style: "Minimalist", season: ["Spring", "Summer", "Fall", "Winter"], occasion: ["Everyday", "Office", "Date Night"], color: "Gold", priceRange: "$$" },

  // Athletic/Athleisure
  { id: "31", name: "High-Waisted Leggings", description: "Buttery-soft high-waisted leggings in deep navy with hidden pocket, from yoga to errands", category: "Bottoms", style: "Athletic", season: ["Spring", "Summer", "Fall", "Winter"], occasion: ["Gym", "Yoga", "Errands"], color: "Navy", priceRange: "$$" },
  { id: "32", name: "Sports Bra", description: "Supportive racerback sports bra in sage green with moisture-wicking fabric for high-impact workouts", category: "Tops", style: "Athletic", season: ["Spring", "Summer", "Fall", "Winter"], occasion: ["Gym", "Running", "Yoga"], color: "Sage", priceRange: "$$" },
  { id: "33", name: "Running Shoes", description: "Lightweight cushioned running shoes in coral with responsive foam sole for long-distance comfort", category: "Shoes", style: "Athletic", season: ["Spring", "Summer", "Fall"], occasion: ["Running", "Gym", "Walking"], color: "Coral", priceRange: "$$$" },
  { id: "34", name: "Zip-Up Track Jacket", description: "Sleek fitted track jacket in black with white side stripes, sporty-chic for warm-ups or casual wear", category: "Outerwear", style: "Athletic", season: ["Spring", "Fall"], occasion: ["Gym", "Errands", "Travel"], color: "Black", priceRange: "$$" },
  { id: "35", name: "Crossbody Belt Bag", description: "Compact nylon belt bag in blush pink, hands-free convenience for workouts and festivals", category: "Accessories", style: "Athletic", season: ["Spring", "Summer", "Fall", "Winter"], occasion: ["Gym", "Festival", "Travel"], color: "Blush", priceRange: "$" },

  // Vacation/Resort
  { id: "36", name: "Linen Wrap Dress", description: "Breezy linen wrap dress in terracotta with tie waist, effortlessly chic for tropical getaways", category: "Dresses", style: "Resort", season: ["Spring", "Summer"], occasion: ["Vacation", "Beach Dinner", "Brunch"], color: "Terracotta", priceRange: "$$" },
  { id: "37", name: "Swim Cover-Up", description: "Sheer crochet cover-up in white, throws over any swimsuit for a polished poolside look", category: "Tops", style: "Resort", season: ["Summer"], occasion: ["Beach", "Pool", "Vacation"], color: "White", priceRange: "$" },
  { id: "38", name: "Espadrille Wedges", description: "Classic espadrille wedge sandals with ankle ties in navy stripe, adds height without sacrificing comfort", category: "Shoes", style: "Resort", season: ["Spring", "Summer"], occasion: ["Vacation", "Brunch", "Garden Party"], color: "Navy Stripe", priceRange: "$$" },
  { id: "39", name: "Printed Shorts", description: "Relaxed tropical print shorts in teal with elastic waist, perfect for beach-to-bar transitions", category: "Bottoms", style: "Resort", season: ["Summer"], occasion: ["Beach", "Vacation", "BBQ"], color: "Teal", priceRange: "$" },
  { id: "40", name: "Oversized Sunglasses", description: "Retro oversized cat-eye sunglasses in tortoiseshell, glamorous sun protection with vintage appeal", category: "Accessories", style: "Resort", season: ["Spring", "Summer"], occasion: ["Beach", "Vacation", "Driving"], color: "Tortoiseshell", priceRange: "$$" },
];
