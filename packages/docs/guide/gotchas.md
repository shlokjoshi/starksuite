# Common Gotchas and Edge Cases

This document outlines common issues, edge cases, and their solutions when working with BlockSuite's block system.

## Document Initialization

### Issue: Missing or Invalid Document Structure

```ts
// ❌ Wrong: Missing initialization
const doc = createEmptyDoc();
editor.attach(doc);

// ✅ Correct: Proper initialization
const doc = createEmptyDoc();
const rootId = doc.addBlock('affine:page');
doc.addBlock('affine:note', {}, rootId);
editor.attach(doc);
```

### Issue: Race Conditions During Initialization

```ts
// ❌ Wrong: Not waiting for initialization
async function setupEditor() {
  const doc = createEmptyDoc();
  editor.attach(doc);
  await loadContent(); // May cause race condition
}

// ✅ Correct: Proper async handling
async function setupEditor() {
  const doc = createEmptyDoc();
  await doc.load();
  editor.attach(doc);
  await loadContent();
}
```

## Block Operations

### Issue: Lost Undo/Redo States

```ts
// ❌ Wrong: Operations not properly grouped
doc.addBlock('custom:block');
doc.updateBlock(block, { content: 'new' });
doc.updateBlock(block, { metadata: {} });

// ✅ Correct: Proper operation grouping
doc.captureSync();
doc.addBlock('custom:block');
doc.updateBlock(block, {
  content: 'new',
  metadata: {},
});
doc.captureSync();
```

### Issue: Improper Block Tree Structure

```ts
// ❌ Wrong: Invalid nesting
doc.addBlock('custom:child', {}, parentId); // Parent may not accept children

// ✅ Correct: Check schema first
if (parentBlock.schema.children.includes('custom:child')) {
  doc.addBlock('custom:child', {}, parentId);
}
```

## Widget Management

### Issue: Widget State During Mode Changes

```ts
// ❌ Wrong: Not handling mode changes
class CustomBlock {
  constructor() {
    this.toolbar = new Toolbar();
  }
}

// ✅ Correct: Mode-aware widgets
class CustomBlock {
  constructor() {
    this.toolbar = new Toolbar({
      onModeChange: mode => this.updateToolbarState(mode),
    });
  }
}
```

### Issue: Widget Memory Leaks

```ts
// ❌ Wrong: Not cleaning up
class CustomBlock {
  disconnect() {
    this.remove(); // Widgets still attached
  }
}

// ✅ Correct: Proper cleanup
class CustomBlock {
  disconnect() {
    this.widgets.forEach(w => w.dispose());
    this.remove();
  }
}
```

## Type Safety

### Issue: Missing Type Definitions

```ts
// ❌ Wrong: Loose typing
const schema = {
  props: {
    data: 'any', // Too permissive
  },
};

// ✅ Correct: Strong typing
interface BlockData {
  content: string;
  metadata: Record<string, unknown>;
}

const schema = defineBlockSchema({
  props: {
    data: { type: 'object' as const, default: {} },
  },
});
```

## Testing Considerations

1. **Block Operations**

   - Test all CRUD operations
   - Verify undo/redo stack
   - Check operation ordering

2. **State Management**

   - Test cross-document operations
   - Verify state persistence
   - Check state recovery

3. **UI Interactions**

   - Test all widget modes
   - Verify event handling
   - Check accessibility

4. **Edge Cases**
   - Test with empty/invalid data
   - Check boundary conditions
   - Verify error handling
