# Challenge: Production Infrastructure Boundary v0

## Challenge

The main risk is letting product-readiness and paid-beta planning blur into an
unsafe assumption that personal/local machines can temporarily serve real
customers.

## Response

This boundary is explicit:

- Work Desktop is not production
- MacBook is not production
- Raspberry Pi is not production
- local machines remain dev/runtime lab/control-plane/private operator infrastructure only
- future customer-facing workloads require later hosted infrastructure and supporting controls
- no deployment or customer-data handling is authorized here

That preserves a hard separation between local experimentation and future
customer-serving systems.
