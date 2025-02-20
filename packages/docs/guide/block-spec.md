# Block Spec

In BlockSuite, a `BlockSpec` defines the structure and interactive elements for a specific block type within the editor. BlockSuite editors are typically composed entirely of block specs, with the top-level UI often implemented as a dedicated block, usually of the `affine:page` type.

A block spec contains the following properties:

- [`schema`](./block-schema): Defines the structure and data types for the block's content.
- [`service`](./block-service): Used for registering methods for specific actions and external invocations.
- [`view`](./block-view): Represents the visual representation and layout of the block.
  - `component`: The primary user interface element of the block.
  - `widgets`: Additional interactive elements enhancing the block's functionality.

![block-spec](../images/block-spec.png)

## Example

Note that in block spec, the definition of `view` is related to UI frameworks. By default, we provide a `@blocksuite/lit` package to help build a lit block view. But it's still possible to use other UI frameworks. We'll introduce later about how to write custom block renderers.

Here is a example of a lit-based block spec:

```ts
import type { BlockSpec } from '@blocksuite/block-std';
import { literal } from 'lit/static-html.js';

const MyBlockSepc: BlockSpec = {
  schema: MyBlockSchema,
  service: MyBlockService,
  view: {
    component: literal`my-block-component`,
    widgets: {
      myBlockToolbar: literal`my-block-toolbar`,
      myBlockMenu: literal`my-block-menu`,
    },
  },
};
```

We'll introduce each part of the block spec in the following sections.

## Implementation Patterns

There are two main approaches to creating blocks in BlockSuite:

### 1. Full Block Spec

For blocks requiring complete control over their behavior and presentation:

```ts
const ComplexBlockSpec: BlockSpec = {
  schema: {
    // Define block properties and structure
    props: {
      content: 'string',
      metadata: { type: 'object' },
    },
    // Define allowed child block types
    children: ['child-block-type'],
  },
  service: {
    // Block-specific methods
    methods: {
      customMethod() {
        /* ... */
      },
    },
  },
  view: {
    component: literal`complex-block`,
    widgets: {
      toolbar: literal`block-toolbar`,
    },
  },
};
```

### 2. Embed Blocks

For simpler, self-contained blocks:

```ts
class SimpleEmbedModel extends defineEmbedModel<{
  title: string;
  content: string;
}>(BlockModel) {
  // Optional custom methods
}
```

## Best Practices

1. **Initialization**

   - Always initialize valid document structure before editor attachment
   - Use proper type definitions for all properties
   - Consider widget combinations for different modes (e.g., read-only)

2. **State Management**

   - Use doc.captureSync() for granular undo/redo control
   - Group related operations appropriately
   - Handle cross-document state when needed

3. **Common Pitfalls**

   - Missing document initialization
   - Improper block tree structure
   - Incomplete type definitions
   - Insufficient widget configuration

4. **Testing Requirements**
   - Verify all block operations
   - Test nesting relationships
   - Validate undo/redo functionality
   - Check widget behavior in different modes

## Implementation Example

Here's a complete example of a custom block implementation:

```ts
// 1. Define the schema
const CustomBlockSchema = defineBlockSchema({
  flavour: 'custom:block',
  props: {
    title: 'string',
    content: 'string',
    metadata: { type: 'object', default: {} },
  },
  children: ['custom:child-block'],
});

// 2. Create the service
class CustomBlockService extends BlockService {
  methods = {
    updateContent(content: string) {
      this.doc.updateBlock(this.model, { content });
    },
  };
}

// 3. Define the view
const CustomBlockSpec: BlockSpec = {
  schema: CustomBlockSchema,
  service: CustomBlockService,
  view: {
    component: literal`custom-block-component`,
    widgets: {
      toolbar: literal`custom-toolbar`,
    },
  },
};
```
