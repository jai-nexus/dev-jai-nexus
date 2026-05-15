## Challenge

A model file can drift from the underlying fixture if it is treated as a second source of truth.

## Response

The model is explicitly a UI-consumable representation that:

- references the source fixture path
- references the related canon paths
- preserves review-only labels
- does not claim canon or operability

This keeps the model narrow and inspectable.
