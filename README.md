# Pyrimid Buyer-Agent Purchase Demo

This is a reproducible demo for MYA job #22:

> Build or run an agent that discovers a Pyrimid seed product, receives the HTTP 402 payment requirement, pays through x402/Base USDC, retries with payment proof, and publishes a short reproducible demo.

## What this demo does

1. Fetches the Pyrimid seed catalog.
2. Picks a payment-compatible Pyrimid seed product.
3. Calls the endpoint without payment and records the `HTTP 402 Payment Required` response.
4. Saves evidence in `artifacts/`.

The payment step is intentionally not automatic by default. It requires a self-custody Base wallet with a tiny amount of USDC and ETH for gas. Do not paste a private key or seed phrase anywhere.

## Current payout wallet

- Base USDC: `0x6CBF4b5cb88b8C2B7af776Bc2B073163B5d3C08A`

## Commands

```powershell
npm install
npm run check
```

## Payment step

Open `payment-helper.html` with a browser wallet, then approve USDC and confirm `PyrimidRouter.routePayment`. Exchange withdrawals or ordinary USDC transfers to the router do not count as payment proof.
