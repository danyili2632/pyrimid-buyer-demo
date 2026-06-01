import { mkdir, writeFile } from "node:fs/promises";
import { inspect } from "node:util";

const CATALOG_URL = "https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed";
const PAYOUT_BASE_USDC = "0x6CBF4b5cb88b8C2B7af776Bc2B073163B5d3C08A";

function parseArgs() {
  return new Set(process.argv.slice(2));
}

function pickPaymentCompatibleSeedProduct(products) {
  const preferred = products.find((product) => product.product_id === "pragma-signal-snapshot");
  if (preferred) return preferred;

  return products
    .filter((product) => product.network === "base")
    .filter((product) => product.asset === "USDC")
    .filter((product) => Number(product.price_usdc) > 0)
    .filter((product) => {
      try {
        return new URL(product.endpoint).hostname === "pyrimid.ai";
      } catch {
        return false;
      }
    })
    .sort((a, b) => Number(a.price_usdc) - Number(b.price_usdc))[0];
}

function headersToObject(headers) {
  return Object.fromEntries([...headers.entries()]);
}

function parsePaymentRequirement(response, body) {
  const header = response.headers.get("x-payment-required") ?? response.headers.get("payment-required");
  if (header) {
    try {
      return JSON.parse(header);
    } catch {
      try {
        return JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
      } catch {
        return header;
      }
    }
  }

  if (body?.accepts?.[0]) {
    return body.accepts[0];
  }

  return null;
}

async function main() {
  const args = parseArgs();
  const dryRun = args.has("--dry-run");

  await mkdir("artifacts", { recursive: true });

  const catalogResponse = await fetch(CATALOG_URL);
  if (!catalogResponse.ok) {
    throw new Error(`Catalog request failed: ${catalogResponse.status}`);
  }

  const catalog = await catalogResponse.json();
  const product = pickPaymentCompatibleSeedProduct(catalog.products ?? []);
  if (!product) {
    throw new Error("No paid Base USDC product found in Pyrimid catalog.");
  }

  const unpaidResponse = await fetch(product.endpoint, {
    method: product.method ?? "GET",
    headers: {
      "User-Agent": "danyili2632-pyrimid-buyer-demo/0.1.0",
      "X-Affiliate-ID": "danyili2632-codex-buyer-demo"
    }
  });

  const rawText = await unpaidResponse.text();
  let body;
  try {
    body = JSON.parse(rawText);
  } catch {
    body = rawText;
  }

  const paymentRequirement = parsePaymentRequirement(unpaidResponse, body);
  const evidence = {
    job: {
      id: 22,
      title: "Pyrimid bounty: buyer-agent purchase demo"
    },
    actor: {
      github: "danyili2632",
      payout: {
        network: "base",
        asset: "USDC",
        wallet: PAYOUT_BASE_USDC
      }
    },
    mode: dryRun ? "dry-run-no-payment" : "pre-payment",
    timestamp: new Date().toISOString(),
    catalog: {
      url: CATALOG_URL,
      product_count: catalog.products?.length ?? 0
    },
    selected_product: {
      product_id: product.product_id,
      vendor_id: product.vendor_id,
      vendor_name: product.vendor_name,
      endpoint: product.endpoint,
      method: product.method,
      price_display: product.price_display,
      price_usdc: product.price_usdc,
      affiliate_bps: product.affiliate_bps,
      network: product.network,
      asset: product.asset
    },
    unpaid_request: {
      status: unpaidResponse.status,
      status_text: unpaidResponse.statusText,
      headers: headersToObject(unpaidResponse.headers),
      body
    },
    payment_requirement: paymentRequirement,
    next_step: "Open payment-helper.html, connect a self-custody Base wallet, approve USDC, call PyrimidRouter.routePayment, retry with X-PAYMENT-TX, then add the Base transaction hash to this evidence."
  };

  await writeFile("artifacts/dry-run-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);

  console.log("Pyrimid buyer demo dry-run complete.");
  console.log(`Selected product: ${product.product_id} (${product.price_display})`);
  console.log(`Endpoint status without payment: ${unpaidResponse.status}`);
  console.log(`Evidence: artifacts/dry-run-evidence.json`);
  console.log("Payment requirement:");
  console.log(inspect(paymentRequirement, { colors: false, depth: 8 }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
