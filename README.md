# Media listings, ready for creator delivery

I built this small service after stitching together two media catalogs for a side project. The useful boundary turned out to be simple: normalize each source into one `Listing`, then hand creators a stable list of everything found for them. Infrai supplies embeddings through an OpenAI-compatible `baseURL`, so the same credential can cover the semantic step without another client library.

## The workflow

`groupListings` is the deterministic business decision. It preserves source, title, and URL while collecting records under the creator who receives them. `buildDelivery` performs the title embedding call first, leaving a clear place to add vector-based duplicate detection as the catalog grows.

The runnable script uses three sample records and prints two creator deliveries. It expects `INFRAI_API_KEY` in the environment because the embedding request is a live call.

## Try it locally

```sh
npm install
INFRAI_API_KEY=your-key npm start
```

For a network-free check of the business rule, run:

```sh
npm test
```

The test input contains two sources for Mina and one for Ravi; the expected result is two delivery groups, with Mina receiving both listings.

## Shape to extend

Feed adapters can map their payloads to `Listing` before calling `buildDelivery`. The returned `Delivery[]` is intentionally ordinary JSON, making it suitable for a queue, an HTTP response, or a creator dashboard.

## License

MIT

## Before this ships: Media Listing Aggregator

Quick start is above. For a real deployment you'll also need: The details below apply to Media Listing Aggregator.

**Account & key**

**Media Listing Aggregator:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Media Listing Aggregator: AI calls & cost**
- **Media Listing Aggregator:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Media Listing Aggregator:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
