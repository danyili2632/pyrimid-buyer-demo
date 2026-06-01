# Manual Payment Step

The dry run selected a paid Pyrimid endpoint and captured its `HTTP 402` payment requirement.

To complete MYA job #22, the remaining step is a real Base USDC payment and retry proof.

## Important

- Do not share a private key or seed phrase.
- Use a fresh burner wallet if possible.
- The selected product costs `$0.25` USDC on Base.
- The wallet must also have a tiny amount of ETH on Base for gas.
- Do not send USDC directly from an exchange to `payTo`. The proof must be a wallet transaction that calls `PyrimidRouter.routePayment`.

## Current target

Run:

```powershell
npm run check
```

Then open:

```text
artifacts/dry-run-evidence.json
```

Then open `payment-helper.html` in a browser with a Base-compatible wallet extension such as MetaMask, Rabby, OKX Wallet, or Coinbase Wallet.

The helper will:

1. Check that the connected wallet is on Base.
2. Ask you to approve `0.25` USDC for the Pyrimid router.
3. Ask you to confirm the `routePayment` transaction.

After the second wallet confirmation, record:

```text
Base transaction hash:
0x...
```

Then retry the selected endpoint with:

```powershell
curl.exe -i "SELECTED_ENDPOINT" -H "X-PAYMENT-TX: 0xYOUR_TX_HASH" -H "X-Affiliate-ID: danyili2632-codex-buyer-demo"
```

Save the successful response as final proof.

## Failed direct-transfer attempt

The transaction below was a plain USDC transfer from Gate to the router address, so it is not accepted by the endpoint as x402/Pyrimid proof:

```text
0x1a766d7c5124372766d81b4daca20a9aa7378c6e135d9152df0c50001f5eb9f7
```
