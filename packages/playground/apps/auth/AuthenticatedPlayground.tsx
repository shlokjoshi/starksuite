import { effects as blocksEffects } from '@blocksuite/blocks/effects';
import { effects as presetsEffects } from '@blocksuite/presets/effects';
import { useEffect } from 'react';

import { setupEdgelessTemplate } from '../_common/setup';
import {
  createDefaultDocCollection,
  initDefaultDocCollection,
} from '../default/utils/collection';
import { mountDefaultDocEditor } from '../default/utils/editor';

blocksEffects();
presetsEffects();

export function AuthenticatedPlayground() {
  useEffect(() => {
    async function initPlayground() {
      if (window.collection) return;

      setupEdgelessTemplate();

      const collection = await createDefaultDocCollection();
      await initDefaultDocCollection(collection);
      await mountDefaultDocEditor(collection);
    }

    initPlayground().catch(console.error);
  }, []);

  return (
    <div
      id="app"
      style={{
        margin: 0,
        overflow: 'initial',
        height: '100%',
        boxShadow: 'initial',
      }}
    >
      <div id="inspector"></div>
    </div>
  );
}
