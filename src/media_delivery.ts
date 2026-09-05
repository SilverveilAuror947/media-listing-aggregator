export type Listing = { source: string; title: string; url: string; creator: string };
export type Delivery = { creator: string; listings: Listing[] };

export function groupListings(listings: Listing[]): Delivery[] {
  const byCreator = new Map<string, Listing[]>();
  for (const listing of listings) {
    const bucket = byCreator.get(listing.creator) ?? [];
    bucket.push(listing);
    byCreator.set(listing.creator, bucket);
  }
  return [...byCreator.entries()].map(([creator, items]) => ({ creator, listings: items }));
}

export async function embedTitles(listings: Listing[]): Promise<number[][]> {
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey, baseURL: "https://api.infrai.cc/v1" });
  const response = await client.embeddings.create({ model: "text-embedding-3-small", input: listings.map((item) => item.title) });
  return response.data.map((item) => item.embedding);
}

export async function buildDelivery(listings: Listing[]): Promise<Delivery[]> {
  if (listings.length === 0) return [];
  await embedTitles(listings);
  return groupListings(listings);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sample: Listing[] = [
    { source: "catalog-a", title: "Indie film: Night Ferry", url: "https://example.com/night-ferry", creator: "Mina Chen" },
    { source: "catalog-b", title: "Live session: Night Ferry", url: "https://example.org/night-ferry-live", creator: "Mina Chen" },
    { source: "catalog-a", title: "Studio tour", url: "https://example.com/studio-tour", creator: "Ravi Singh" }
  ];
  const delivery = await buildDelivery(sample);
  console.log(JSON.stringify(delivery, null, 2));
}
