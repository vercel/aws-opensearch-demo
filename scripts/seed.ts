import { Client } from "@opensearch-project/opensearch";

const INDEX_NAME = "movies";

const movies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: "Drama",
    plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Crime",
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Action",
    plot: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genre: "Crime",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Sci-Fi",
    plot: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
  },
  {
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Sci-Fi",
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    title: "Parasite",
    director: "Bong Joon-ho",
    year: 2019,
    genre: "Thriller",
    plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  },
  {
    title: "Spirited Away",
    director: "Hayao Miyazaki",
    year: 2001,
    genre: "Animation",
    plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
  },
  {
    title: "The Matrix",
    director: "Lana Wachowski",
    year: 1999,
    genre: "Sci-Fi",
    plot: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
  },
  {
    title: "Goodfellas",
    director: "Martin Scorsese",
    year: 1990,
    genre: "Crime",
    plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen and his partners.",
  },
];

async function seed() {
  const endpoint = process.env.OPENSEARCH_ENDPOINT;
  if (!endpoint) {
    console.error("Error: OPENSEARCH_ENDPOINT is not set");
    process.exit(1);
  }

  const username = process.env.OPENSEARCH_USERNAME;
  const password = process.env.OPENSEARCH_PASSWORD;

  const client = new Client({
    node: endpoint,
    ...(username && password ? { auth: { username, password } } : {}),
    ssl: { rejectUnauthorized: true },
  });

  // Delete index if it exists
  const exists = await client.indices.exists({ index: INDEX_NAME });
  if (exists.body) {
    console.log(`Deleting existing index "${INDEX_NAME}"...`);
    await client.indices.delete({ index: INDEX_NAME });
  }

  // Create index with mappings
  console.log(`Creating index "${INDEX_NAME}"...`);
  await client.indices.create({
    index: INDEX_NAME,
    body: {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
      },
      mappings: {
        properties: {
          title: { type: "text", analyzer: "standard" },
          director: { type: "text", analyzer: "standard" },
          year: { type: "integer" },
          genre: { type: "keyword" },
          plot: { type: "text", analyzer: "standard" },
        },
      },
    },
  });

  // Bulk index documents
  console.log("Indexing movies...");
  const body = movies.flatMap((movie, i) => [
    { index: { _index: INDEX_NAME, _id: String(i + 1) } },
    movie,
  ]);

  const bulkResponse = await client.bulk({ body, refresh: true });

  if (bulkResponse.body.errors) {
    console.error("Bulk indexing had errors:");
    bulkResponse.body.items.forEach((item: any) => {
      if (item.index?.error) {
        console.error(item.index.error);
      }
    });
  } else {
    console.log(`Successfully indexed ${movies.length} movies.`);
  }

  // Verify
  const count = await client.count({ index: INDEX_NAME });
  console.log(`Total documents in index: ${count.body.count}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
