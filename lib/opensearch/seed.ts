import { config } from "dotenv";
import path from "path";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

config({ path: path.resolve(process.cwd(), ".env.local") });

const OPENSEARCH_ENDPOINT =
  process.env.OPENSEARCH_ENDPOINT ||
  "https://ws7rk9i4hrsodv2dwo7b.ap-northeast-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "ap-northeast-1";
const INDEX_NAME = "recipes";

const recipes = [
  {
    title: "Classic Margherita Pizza",
    description: "A simple Neapolitan pizza with fresh mozzarella, San Marzano tomatoes, and basil on a thin crispy crust.",
    cuisine: "Italian",
    diet: ["Vegetarian"],
    cookTimeMinutes: 25,
    ingredients: ["pizza dough", "San Marzano tomatoes", "fresh mozzarella", "basil", "olive oil", "salt"],
  },
  {
    title: "Chicken Tikka Masala",
    description: "Tender chicken pieces in a creamy spiced tomato sauce, a beloved British-Indian classic.",
    cuisine: "Indian",
    diet: ["Gluten-Free"],
    cookTimeMinutes: 45,
    ingredients: ["chicken thighs", "yogurt", "garam masala", "tomato puree", "cream", "ginger", "garlic", "cumin"],
  },
  {
    title: "Pad Thai",
    description: "Stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind sauce — Thailand's most famous street food.",
    cuisine: "Thai",
    diet: [],
    cookTimeMinutes: 30,
    ingredients: ["rice noodles", "shrimp", "tofu", "bean sprouts", "peanuts", "tamarind paste", "fish sauce", "lime"],
  },
  {
    title: "Beef Bourguignon",
    description: "A rich French stew of beef braised in red wine with mushrooms, pearl onions, and bacon.",
    cuisine: "French",
    diet: [],
    cookTimeMinutes: 180,
    ingredients: ["beef chuck", "red wine", "mushrooms", "pearl onions", "bacon", "carrots", "thyme", "bay leaf"],
  },
  {
    title: "Sushi Rolls (Maki)",
    description: "Hand-rolled sushi with seasoned rice, fresh fish, and vegetables wrapped in nori seaweed.",
    cuisine: "Japanese",
    diet: ["Dairy-Free"],
    cookTimeMinutes: 60,
    ingredients: ["sushi rice", "nori", "salmon", "avocado", "cucumber", "rice vinegar", "wasabi", "soy sauce"],
  },
  {
    title: "Tacos al Pastor",
    description: "Marinated pork tacos with pineapple, cilantro, and onion on soft corn tortillas — Mexico City street food.",
    cuisine: "Mexican",
    diet: ["Dairy-Free"],
    cookTimeMinutes: 40,
    ingredients: ["pork shoulder", "pineapple", "corn tortillas", "cilantro", "onion", "achiote paste", "lime"],
  },
  {
    title: "Falafel Bowl",
    description: "Crispy chickpea fritters served over hummus with tabbouleh, pickled vegetables, and tahini drizzle.",
    cuisine: "Middle Eastern",
    diet: ["Vegan", "Dairy-Free"],
    cookTimeMinutes: 35,
    ingredients: ["chickpeas", "parsley", "cumin", "tahini", "lemon", "bulgur wheat", "tomatoes", "cucumber"],
  },
  {
    title: "Bibimbap",
    description: "Korean mixed rice bowl topped with sautéed vegetables, gochujang, a fried egg, and sesame oil.",
    cuisine: "Korean",
    diet: ["Vegetarian"],
    cookTimeMinutes: 40,
    ingredients: ["rice", "spinach", "carrots", "zucchini", "mushrooms", "gochujang", "sesame oil", "egg"],
  },
  {
    title: "Fish and Chips",
    description: "Beer-battered cod with thick-cut chips, mushy peas, and tartar sauce — the British pub classic.",
    cuisine: "British",
    diet: [],
    cookTimeMinutes: 35,
    ingredients: ["cod fillets", "flour", "beer", "potatoes", "peas", "tartar sauce", "lemon", "malt vinegar"],
  },
  {
    title: "Tom Yum Soup",
    description: "A hot and sour Thai soup with shrimp, mushrooms, lemongrass, and kaffir lime leaves.",
    cuisine: "Thai",
    diet: ["Gluten-Free", "Dairy-Free"],
    cookTimeMinutes: 20,
    ingredients: ["shrimp", "lemongrass", "galangal", "kaffir lime leaves", "mushrooms", "chili", "fish sauce", "lime juice"],
  },
  {
    title: "Shakshuka",
    description: "Eggs poached in a spiced tomato and pepper sauce, served with crusty bread for dipping.",
    cuisine: "Middle Eastern",
    diet: ["Vegetarian", "Gluten-Free"],
    cookTimeMinutes: 25,
    ingredients: ["eggs", "tomatoes", "bell peppers", "onion", "cumin", "paprika", "garlic", "feta cheese"],
  },
  {
    title: "Pho Bo",
    description: "Vietnamese beef noodle soup with a fragrant star anise and cinnamon broth, served with fresh herbs.",
    cuisine: "Vietnamese",
    diet: ["Dairy-Free"],
    cookTimeMinutes: 120,
    ingredients: ["beef bones", "rice noodles", "star anise", "cinnamon", "ginger", "bean sprouts", "basil", "hoisin sauce"],
  },
  {
    title: "Risotto ai Funghi",
    description: "Creamy Italian rice slowly cooked with porcini mushrooms, white wine, and Parmesan cheese.",
    cuisine: "Italian",
    diet: ["Vegetarian", "Gluten-Free"],
    cookTimeMinutes: 40,
    ingredients: ["arborio rice", "porcini mushrooms", "white wine", "Parmesan", "butter", "shallots", "vegetable broth"],
  },
  {
    title: "Butter Chicken",
    description: "Tender tandoori chicken in a velvety tomato-butter sauce with aromatic spices and cream.",
    cuisine: "Indian",
    diet: ["Gluten-Free"],
    cookTimeMinutes: 50,
    ingredients: ["chicken", "butter", "tomato puree", "cream", "garam masala", "fenugreek leaves", "ginger", "garlic"],
  },
  {
    title: "Caesar Salad",
    description: "Crisp romaine lettuce with creamy Caesar dressing, croutons, and shaved Parmesan.",
    cuisine: "American",
    diet: ["Vegetarian"],
    cookTimeMinutes: 15,
    ingredients: ["romaine lettuce", "Parmesan", "croutons", "anchovy paste", "garlic", "lemon juice", "egg yolk", "olive oil"],
  },
  {
    title: "Ramen (Tonkotsu)",
    description: "Rich pork bone broth ramen with chashu pork, soft-boiled egg, nori, and green onions.",
    cuisine: "Japanese",
    diet: ["Dairy-Free"],
    cookTimeMinutes: 240,
    ingredients: ["pork bones", "ramen noodles", "chashu pork", "soft-boiled egg", "nori", "green onions", "soy sauce", "mirin"],
  },
  {
    title: "Greek Moussaka",
    description: "Layered eggplant and spiced lamb casserole topped with creamy béchamel sauce.",
    cuisine: "Greek",
    diet: [],
    cookTimeMinutes: 90,
    ingredients: ["eggplant", "ground lamb", "tomatoes", "onion", "cinnamon", "béchamel sauce", "Parmesan", "nutmeg"],
  },
  {
    title: "Ceviche",
    description: "Fresh raw fish cured in citrus juices with red onion, cilantro, and chili peppers.",
    cuisine: "Peruvian",
    diet: ["Gluten-Free", "Dairy-Free"],
    cookTimeMinutes: 20,
    ingredients: ["white fish", "lime juice", "red onion", "cilantro", "chili pepper", "sweet potato", "corn"],
  },
  {
    title: "Chocolate Lava Cake",
    description: "Individual warm chocolate cakes with a molten center, served with vanilla ice cream.",
    cuisine: "French",
    diet: ["Vegetarian"],
    cookTimeMinutes: 20,
    ingredients: ["dark chocolate", "butter", "eggs", "sugar", "flour", "vanilla extract"],
  },
  {
    title: "Dumplings (Jiaozi)",
    description: "Pan-fried pork and cabbage dumplings with a crispy bottom and savory dipping sauce.",
    cuisine: "Chinese",
    diet: ["Dairy-Free"],
    cookTimeMinutes: 45,
    ingredients: ["ground pork", "cabbage", "ginger", "garlic", "soy sauce", "sesame oil", "dumpling wrappers", "rice vinegar"],
  },
  {
    title: "Paella Valenciana",
    description: "Saffron-infused Spanish rice with chicken, rabbit, green beans, and snails — the original Valencia recipe.",
    cuisine: "Spanish",
    diet: ["Gluten-Free", "Dairy-Free"],
    cookTimeMinutes: 60,
    ingredients: ["bomba rice", "saffron", "chicken", "rabbit", "green beans", "tomatoes", "olive oil", "rosemary"],
  },
  {
    title: "Avocado Toast",
    description: "Smashed avocado on sourdough with chili flakes, microgreens, and a poached egg.",
    cuisine: "American",
    diet: ["Vegetarian"],
    cookTimeMinutes: 10,
    ingredients: ["avocado", "sourdough bread", "egg", "chili flakes", "lemon juice", "microgreens", "salt", "olive oil"],
  },
  {
    title: "Lamb Tagine",
    description: "Slow-cooked Moroccan lamb with apricots, almonds, and warm spices in a conical clay pot.",
    cuisine: "Moroccan",
    diet: ["Gluten-Free", "Dairy-Free"],
    cookTimeMinutes: 150,
    ingredients: ["lamb shoulder", "dried apricots", "almonds", "cinnamon", "cumin", "honey", "onions", "saffron"],
  },
  {
    title: "Caprese Salad",
    description: "Fresh buffalo mozzarella with ripe tomatoes, basil, and a drizzle of balsamic glaze.",
    cuisine: "Italian",
    diet: ["Vegetarian", "Gluten-Free"],
    cookTimeMinutes: 10,
    ingredients: ["buffalo mozzarella", "tomatoes", "basil", "balsamic glaze", "olive oil", "salt", "pepper"],
  },
  {
    title: "Kimchi Fried Rice",
    description: "Spicy stir-fried rice with aged kimchi, pork belly, and a crispy fried egg on top.",
    cuisine: "Korean",
    diet: ["Dairy-Free"],
    cookTimeMinutes: 15,
    ingredients: ["rice", "kimchi", "pork belly", "egg", "sesame oil", "gochujang", "green onions", "sesame seeds"],
  },
  {
    title: "Banoffee Pie",
    description: "A no-bake British dessert with layers of toffee, bananas, and whipped cream on a biscuit base.",
    cuisine: "British",
    diet: ["Vegetarian"],
    cookTimeMinutes: 30,
    ingredients: ["digestive biscuits", "butter", "condensed milk", "bananas", "whipping cream", "dark chocolate"],
  },
  {
    title: "Gazpacho",
    description: "Chilled Spanish tomato soup blended with peppers, cucumber, and sherry vinegar — perfect for summer.",
    cuisine: "Spanish",
    diet: ["Vegan", "Gluten-Free", "Dairy-Free"],
    cookTimeMinutes: 15,
    ingredients: ["tomatoes", "cucumber", "red pepper", "garlic", "olive oil", "sherry vinegar", "bread", "onion"],
  },
  {
    title: "Eggs Benedict",
    description: "Poached eggs on English muffins with Canadian bacon and silky hollandaise sauce.",
    cuisine: "American",
    diet: [],
    cookTimeMinutes: 25,
    ingredients: ["eggs", "English muffins", "Canadian bacon", "butter", "lemon juice", "egg yolks", "cayenne pepper"],
  },
  {
    title: "Green Curry",
    description: "Thai green curry with coconut milk, bamboo shoots, Thai basil, and your choice of protein.",
    cuisine: "Thai",
    diet: ["Gluten-Free", "Dairy-Free"],
    cookTimeMinutes: 30,
    ingredients: ["green curry paste", "coconut milk", "chicken", "bamboo shoots", "Thai basil", "fish sauce", "palm sugar", "eggplant"],
  },
  {
    title: "Tiramisu",
    description: "Layers of espresso-soaked ladyfingers and mascarpone cream dusted with cocoa powder.",
    cuisine: "Italian",
    diet: ["Vegetarian"],
    cookTimeMinutes: 30,
    ingredients: ["ladyfingers", "mascarpone", "espresso", "eggs", "sugar", "cocoa powder", "Marsala wine"],
  },
];

async function main() {
  const opensearch = new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: OPENSEARCH_ENDPOINT,
  });

  // OpenSearch Serverless doesn't support checking if index exists the same way.
  // Try to delete, ignore if it doesn't exist.
  try {
    await opensearch.indices.delete({ index: INDEX_NAME });
    console.log(`Deleted existing index "${INDEX_NAME}".`);
  } catch (e: any) {
    if (e.statusCode !== 404) {
      console.log("Index does not exist yet, creating fresh.");
    }
  }

  // Create index with mappings
  // Note: OpenSearch Serverless doesn't support custom settings like
  // number_of_shards, number_of_replicas, or custom analyzers with synonyms.
  // We use a simplified mapping compatible with Serverless.
  console.log(`Creating index "${INDEX_NAME}"...`);
  await opensearch.indices.create({
    index: INDEX_NAME,
    body: {
      mappings: {
        properties: {
          title: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          description: { type: "text" },
          cuisine: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          diet: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          cookTimeMinutes: { type: "integer" },
          ingredients: { type: "text" },
        },
      },
    },
  });
  console.log("Index created.");

  // Bulk index
  console.log(`Indexing ${recipes.length} recipes...`);
  const body = recipes.flatMap((recipe, i) => [
    { index: { _index: INDEX_NAME, _id: String(i + 1) } },
    recipe,
  ]);

  const bulkResponse = await opensearch.bulk({ body });

  if (bulkResponse.body.errors) {
    const errors = bulkResponse.body.items.filter(
      (item: any) => item.index?.error,
    );
    console.error("Errors:", JSON.stringify(errors, null, 2));
  } else {
    console.log(`Successfully indexed ${recipes.length} recipes.`);
  }

  // Wait a moment for serverless to make docs searchable
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Verify
  const count = await opensearch.count({ index: INDEX_NAME });
  console.log(`Total documents in index: ${count.body.count}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
