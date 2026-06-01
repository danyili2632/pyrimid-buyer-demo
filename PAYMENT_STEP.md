# Manual Payment Step

The dry run selected a paid Pyrimid endpoint and captured its `HTTP 402` payment requirement.

To complete MYA job #22, the remaining step is a real Base USDC payment and retry proof.

## Important

- Do not share a private key or seed phrase.
- Use a fresh burner wallet if possible.
- The selected product is expected to cost about `$0.05` USDC on Base.
- The wallet must also have a tiny amount of ETH on Base for gas.

## Current target

Run:

```powershell
npm run check
```

Then open:

```text
artifacts/dry-run-evidence.json
```

Use the `payment_requirement.payTo` address and `payment_requirement.maxAmountRequired` amount.

After payment, record:

```text
Base transaction hash:
0x...
```

Then retry the selected endpoint with:

```powershell
curl.exe -i "SELECTED_ENDPOINT" -H "X-PAYMENT-TX: 0xYOUR_TX_HASH" -H "X-Affiliate-ID: danyili2632-codex-buyer-demo"
```

Save the successful response as final proof.
