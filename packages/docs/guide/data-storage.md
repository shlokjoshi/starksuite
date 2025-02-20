# BlockSuite Data Storage and Synchronization

This guide explains BlockSuite's data storage architecture and how to integrate external storage providers like Octobase.

## Overview

BlockSuite uses a document-based storage system with support for real-time collaboration. The system is built on top of CRDT (Conflict-free Replicated Data Type) technology, making it suitable for both local and cloud storage with synchronization capabilities.

## Core Concepts

### Document Structure

1. Collection

   - Top-level container for documents
   - Manages document lifecycle
   - Handles synchronization

   ```typescript
   const collection = new DocCollection({
     id: 'unique-workspace-id',
     providers: [...] // Storage/sync providers
   });
   ```

2. Document

   - Contains block tree
   - Manages document state
   - Handles undo/redo

   ```typescript
   const doc = collection.createDoc({
     id: 'unique-doc-id',
   });
   ```

3. Blocks
   - Atomic units of content
   - Have unique flavors
   - Maintain their own state
   ```typescript
   doc.addBlock('affine:page', {
     title: new doc.Text(),
   });
   ```

## Storage Architecture

### Local Storage

1. In-Memory State

   - Real-time document state
   - Block tree structure
   - Temporary changes

2. Persistence Layer
   - IndexedDB for web storage
   - File system for desktop
   - Configurable storage adapters

### Cloud Storage Integration

1. Provider Interface

   ```typescript
   interface StorageProvider {
     // Connect to storage
     connect(): Promise<void>;

     // Save document state
     save(doc: Doc): Promise<void>;

     // Load document state
     load(id: string): Promise<Doc>;

     // Handle real-time updates
     subscribe(callback: UpdateCallback): void;
   }
   ```

2. Sync Protocol
   - CRDT-based synchronization
   - Conflict resolution
   - Delta updates
   ```typescript
   interface SyncProvider {
     // Send updates to remote
     sync(update: Update): Promise<void>;

     // Handle remote updates
     onUpdate(callback: (update: Update) => void): void;
   }
   ```

## Integrating Octobase

### Setup

1. Provider Configuration

   ```typescript
   import { OctobaseProvider } from '@octobase/provider';

   const collection = new DocCollection({
     id: 'workspace-id',
     providers: [
       new OctobaseProvider({
         endpoint: 'your-endpoint',
         apiKey: 'your-api-key',
       }),
     ],
   });
   ```

2. Storage Options
   ```typescript
   interface OctobaseConfig {
     // Local storage options
     local: {
       enabled: boolean;
       path?: string;
     };

     // Cloud storage options
     cloud: {
       enabled: boolean;
       syncInterval?: number;
     };
   }
   ```

### Implementation

1. Local Storage

   ```typescript
   class OctobaseLocalStorage {
     // Save to local storage
     async save(doc: Doc) {
       const state = doc.toJSON();
       await this.storage.set(doc.id, state);
     }

     // Load from local storage
     async load(id: string) {
       const state = await this.storage.get(id);
       return Doc.fromJSON(state);
     }
   }
   ```

2. Cloud Sync
   ```typescript
   class OctobaseCloudSync {
     // Handle real-time updates
     subscribe(doc: Doc) {
       this.client.subscribe(doc.id, update => {
         doc.apply(update);
       });
     }

     // Send updates to cloud
     async sync(doc: Doc) {
       const updates = doc.getUpdates();
       await this.client.sync(updates);
     }
   }
   ```

## Collaboration Features

### Real-time Collaboration

1. Presence

   ```typescript
   interface Presence {
     userId: string;
     cursor: {
       blockId: string;
       offset: number;
     };
     selection?: Range;
   }
   ```

2. Awareness
   ```typescript
   collection.awareness.setLocalState({
     user: {
       name: 'User Name',
       color: '#color',
     },
   });
   ```

### Conflict Resolution

1. CRDT Operations

   - Automatically merged
   - Preserves intention
   - Eventually consistent

2. Custom Resolution
   ```typescript
   interface ConflictResolver {
     resolve(local: any, remote: any): any;
     priority?: number;
   }
   ```

## Best Practices

1. Storage Implementation

   - Implement both local and cloud storage
   - Handle offline support
   - Manage sync conflicts

2. Performance

   - Use incremental updates
   - Implement caching
   - Batch operations

3. Error Handling

   ```typescript
   try {
     await provider.save(doc);
   } catch (error) {
     if (error instanceof NetworkError) {
       // Handle network issues
     } else if (error instanceof StorageError) {
       // Handle storage issues
     }
   }
   ```

4. Security
   - Encrypt sensitive data
   - Validate permissions
   - Handle authentication

## Testing

1. Storage Tests

   ```typescript
   test('should persist document state', async () => {
     const doc = collection.createDoc();
     await provider.save(doc);
     const loaded = await provider.load(doc.id);
     expect(loaded).toEqual(doc);
   });
   ```

2. Sync Tests
   ```typescript
   test('should sync between clients', async () => {
     const doc1 = collection1.createDoc();
     const doc2 = collection2.getDoc(doc1.id);
     await doc1.updateBlock(...);
     await waitForSync();
     expect(doc2.getBlock(...)).toEqual(...);
   });
   ```

## Migration

1. Data Migration

   ```typescript
   interface MigrationStrategy {
     version: number;
     migrate(oldData: any): Promise<any>;
   }
   ```

2. Schema Evolution
   - Handle version changes
   - Preserve data integrity
   - Support rollback

## Conclusion

BlockSuite's storage system provides a flexible foundation for implementing various storage solutions. By following these patterns, you can integrate external providers like Octobase while maintaining the system's real-time collaboration capabilities.
