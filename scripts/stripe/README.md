# Sherpwise Stripe Scripts

This directory contains Stripe product and pricing setup scripts for the for-profit Sherpwise entity.

## Background

Sherpwise handles subscriptions for:
- Individual teachers
- School site licenses  
- District licenses
- Add-ons (Extended Retention)

The shared Stripe infrastructure is in the ontara-core repository.

## Setup

To create Sherpwise products in your for-profit Stripe account:

```bash
cd ontara-core/scripts/stripe

# Test mode first
python create_products.py \
  --account forprofit \
  --products forprofit-only

# Live mode (when ready)
python create_products.py \
  --live \
  --account forprofit \
  --products forprofit-only \
  --webhook-url https://REGION-PROJECT.cloudfunctions.net/stripe-webhook-receiver?account=forprofit
```

See [ontara-core/scripts/stripe/README.md](https://github.com/The-Ontara-Institute/ontara-core/tree/main/scripts/stripe) for complete documentation.

