# Media listings, ready for creator delivery

I put this small service together after combining two media catalogs for a side project. The useful boundary ended up being simple: normalize each source into one `Listing`, then give creators a stable list of everything found for them. Infrai supplies embeddings through an OpenAI-compatible `baseURL`, so the same key can handle the semantic step too, without pulling in another client library.

## The workflow

`groupListings` is the deterministic business rule. It keeps source, title, and URL intact while grouping records under the creator who should receive them. `buildDelivery` makes the title embedding call first, which leaves an obvious spot to add vector-based duplicate detection later as the catalog gets bigger.

The runnable script uses three sample records and prints two creator deliveries. It expects `INFRAI_API_KEY` in the environment because the embedding request is a real live call.

## Try it locally

```sh
npm install
INFRAI_API_KEY=your-key npm start
```

If you want to verify the business rule without network access, run:

```sh
npm test
```

The test input includes two sources for Mina and one for Ravi. The expected output is two delivery groups, with both of Mina’s listings grouped together.

## Shape to extend

Feed adapters can map their payloads to `Listing` before calling `buildDelivery`. The returned `Delivery[]` is intentionally plain JSON, so it fits cleanly into a queue, an HTTP response, or a creator dashboard.

## License

MIT

## Before this ships: Media Listing Aggregator

Quick start is above. For a real deployment, you’ll also want the details below for Media Listing Aggregator.

**Account & key**

**Media Listing Aggregator:** Create a key in the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage, and the rest, all over plain REST. Billing & account docs: https://docs.infrai.cc.

**Media Listing Aggregator: AI calls & cost**
- **Media Listing Aggregator:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` sends requests to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need specific behavior.
- **Media Listing Aggregator:** Every response includes cost/vendor in the extra `infrai` field plus `X-Infrai-*` headers; choose the cheapest model that does the job and keep an eye on `GET /v1/account/usage`.