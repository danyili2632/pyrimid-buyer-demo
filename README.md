# Pyrimid Buyer-Agent Purchase Demo

This is a reproducible demo for MYA job #22:

> Build or run an agent that discovers a Pyrimid seed product, receives the HTTP 402 payment requirement, pays through x402/Base USDC, retries with payment proof, and publishes a short reproducible demo.

## What this demo does

1. Fetches the Pyrimid seed catalog.
2. Picks the cheapest paid Base USDC product.
3. Calls the endpoint without payment and records the `HTTP 402 Payment Required` response.
4. Saves evidence in `artifacts/`.

The payment step is intentionally not automatic by default. It requires a Base wallet with a tiny amount of USDC and ETH for gas. Do not paste a main-wallet private key here.

## Current payout wallet

- Base USDC: `0x6CBF4b5cb88b8C2B7af776Bc2B073163B5d3C08A`

## Commands

```powershell
npm install
npm run check
```

## Payment step

Use a fresh burner wallet funded with the minimum needed for the selected product and gas, then run a payment-enabled variant after review.
