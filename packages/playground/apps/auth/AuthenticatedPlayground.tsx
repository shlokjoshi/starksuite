import { effects as blocksEffects } from '@blocksuite/blocks/effects';
import { effects as presetsEffects } from '@blocksuite/presets/effects';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';

import { setupEdgelessTemplate } from '../_common/setup';
import {
  createDefaultDocCollection,
  initDefaultDocCollection,
} from '../default/utils/collection';
import { mountDefaultDocEditor } from '../default/utils/editor';
import { NavBar } from './components/NavBar';

blocksEffects();
presetsEffects();

const CONTROL_STYLES = `
  margin: 4px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--affine-border-color);
  color: var(--affine-text-primary-color);
  cursor: pointer;
  border-radius: 8px;
  font-family: var(--affine-font-family);
  font-size: 14px;
`;

export function AuthenticatedPlayground() {
  const { isSignedIn } = useAuth();
  const controlsRef = useRef<{
    container: HTMLDivElement;
    theme: HTMLButtonElement;
    presenter: HTMLButtonElement;
  } | null>(null);

  useEffect(() => {
    async function initPlayground() {
      if (window.collection) return;

      setupEdgelessTemplate();

      const collection = await createDefaultDocCollection();
      await initDefaultDocCollection(collection);
      await mountDefaultDocEditor(collection);

      // Create a persistent container for controls if it doesn't exist
      if (!controlsRef.current) {
        // Create container
        const container = document.createElement('div');
        container.className = 'editor-controls-container';
        container.style.cssText =
          'display: flex; gap: 8px; align-items: center;';

        // Create theme toggle
        const themeToggle = document.createElement('button');
        themeToggle.textContent = 'Toggle Theme';
        themeToggle.className = 'editor-control theme-toggle';
        themeToggle.style.cssText = CONTROL_STYLES;
        themeToggle.onclick = () => {
          const body = document.body;
          body.classList.toggle('dark');
          body.classList.toggle('light');
        };

        // Create presenter toggle
        const presenterToggle = document.createElement('button');
        presenterToggle.textContent = 'Toggle Presenter';
        presenterToggle.className = 'editor-control presenter-toggle';
        presenterToggle.style.cssText = CONTROL_STYLES;
        presenterToggle.onclick = () => {
          const editor = document.querySelector('affine-editor-container');
          if (editor) {
            (editor as { toggleMode?: () => void }).toggleMode?.();
          }
        };

        // Add buttons to container
        container.appendChild(themeToggle);
        container.appendChild(presenterToggle);

        // Store refs
        controlsRef.current = {
          container,
          theme: themeToggle,
          presenter: presenterToggle,
        };
      }

      // Function to move controls to appropriate container
      function moveControls() {
        if (!controlsRef.current) return;

        const { container } = controlsRef.current;
        const editor = document.querySelector('affine-editor-container');
        const isPageMode = editor?.classList.contains('page-mode');

        // Remove from current parent if exists
        container.parentElement?.removeChild(container);

        if (isPageMode) {
          // In page mode
          const pageHeader = document.querySelector(
            '.affine-page-mode-header-actions'
          );
          if (pageHeader) {
            pageHeader.appendChild(container);
          }
        } else {
          // In edgeless mode
          const debugMenu = document.querySelector('.debug-menu');
          if (debugMenu) {
            debugMenu.appendChild(container);
          }
        }

        // Verify controls are visible
        requestAnimationFrame(() => {
          if (!container.parentElement) {
            const fallbackContainer = document.querySelector('.debug-menu');
            fallbackContainer?.appendChild(container);
          }
        });
      }

      // Initial placement
      moveControls();

      // Set up observers for both immediate and delayed changes
      const editorObserver = new MutationObserver(mutations => {
        const shouldMove = mutations.some(
          mutation =>
            (mutation.type === 'attributes' &&
              mutation.attributeName === 'class') ||
            mutation.type === 'childList'
        );

        if (shouldMove) {
          moveControls();
          // Double-check after a short delay for async changes
          setTimeout(moveControls, 100);
        }
      });

      // Observe the app container
      const appContainer = document.getElementById('app');
      if (appContainer) {
        editorObserver.observe(appContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
        });
      }

      return () => {
        editorObserver.disconnect();
        controlsRef.current?.container.remove();
        controlsRef.current = null;
      };
    }

    if (isSignedIn) {
      initPlayground().catch(console.error);
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <NavBar />
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
    </>
  );
}
