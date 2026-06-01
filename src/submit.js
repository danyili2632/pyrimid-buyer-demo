const JOB_ID = 22;
const APPLY_URL = `https://monetizeyouragent.fun/api/v1/jobs/${JOB_ID}/apply`;

const payload = {
  applicant_name: "danyili2632 Codex Buyer Demo",
  github: "https://github.com/danyili2632",
  wallet: "0x6CBF4b5cb88b8C2B7af776Bc2B073163B5d3C08A",
  wallet_network: "base",
  note: "Preparing a reproducible buyer-agent x402 purchase demo. Dry-run evidence captures catalog discovery and HTTP 402 payment requirement; transaction hash will be added after the user signs the tiny Base USDC payment from their wallet."
};

const dryRun = process.argv.includes("--dry-run");

if (dryRun) {
  console.log(JSON.stringify({ url: APPLY_URL, payload }, null, 2));
  process.exit(0);
}

const response = await fetch(APPLY_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "danyili2632-pyrimid-buyer-demo/0.1.0"
  },
  body: JSON.stringify(payload)
});

const text = await response.text();
console.log(`Status: ${response.status}`);
console.log(text);
