/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Returns the count of tabs that do not have the 'zen-empty-tab' attribute.
 *
 * @returns {number} The number of non-empty tabs.
 */
function getNonEmptyTabCount() {
  return gBrowser.tabs.filter((tab) => !tab.hasAttribute('zen-empty-tab')).length;
}

/**
 * Simulates dragging and dropping a link to test split view.
 *
 * @param {string} side The side to drop on ('left', 'right', 'top', 'bottom', 'center').
 * @param {string} [url='https://example.com/'] The URL to be dragged.
 */
async function simulateLinkDragAndDrop(side, url = 'https://example.com/') {
  const tabBox = document.getElementById('tabbrowser-tabbox');
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/uri-list', url);
  dataTransfer.setData('text/plain', url);

  // 1. Enter the tab area to trigger drop zone creation.
  tabBox.dispatchEvent(new DragEvent('dragenter', { bubbles: true, view: window, dataTransfer }));

  const dropZone = await TestUtils.waitForCondition(
    () => document.getElementById('zen-drop-link-zone'),
    'Wait for link drop zone to appear'
  );

  // 2. Calculate coordinates for the drop.
  const rect = dropZone.getBoundingClientRect();
  const edgeRatio = 0.2; // Should be less than EDGE_SIZE_RATIO in the source
  const position = {
    left: rect.left + rect.width * edgeRatio,
    right: rect.right - rect.width * edgeRatio,
    top: rect.top + rect.height * edgeRatio,
    bottom: rect.bottom - rect.height * edgeRatio,
    hCenter: rect.left + rect.width / 2,
    vCenter: rect.top + rect.height / 2,
  };

  const coords = {
    left: { clientX: position.left, clientY: position.vCenter },
    right: { clientX: position.right, clientY: position.vCenter },
    top: { clientX: position.hCenter, clientY: position.top },
    bottom: { clientX: position.hCenter, clientY: position.bottom },
    center: { clientX: position.hCenter, clientY: position.vCenter },
  };

  // 3. Drag over the drop zone to set the side.
  dropZone.dispatchEvent(
    new DragEvent('dragover', { bubbles: true, view: window, dataTransfer, ...coords[side] })
  );
  await TestUtils.waitForCondition(
    () => dropZone.getAttribute('drop-side') === side,
    `Wait for drop-side to be '${side}'`
  );

  // 4. Drop.
  dropZone.dispatchEvent(
    new DragEvent('drop', { bubbles: true, view: window, dataTransfer, ...coords[side] })
  );

  // 5. End drag to clean up.
  tabBox.dispatchEvent(new DragEvent('dragend', { bubbles: true, view: window, dataTransfer }));
}

/**
 * Cleans up any split or glance views after a test and ensures only one clean tab remains.
 */
async function cleanupSplitView() {
  // 1. Ensure all split views are closed.
  if (gZenViewSplitter.splitViewActive) {
    gZenViewSplitter.unsplitCurrentView();
    await TestUtils.waitForCondition(
      () => !gZenViewSplitter.splitViewActive,
      'Wait for split view to become inactive during cleanup'
    );
  }

  // 2. Close any active glance view.
  const glanceTab = gBrowser.tabs.find((t) => t.hasAttribute('zen-glance-tab'));
  if (glanceTab) {
    await BrowserTestUtils.removeTab(glanceTab);
    await TestUtils.waitForCondition(
      () => gBrowser.tabs.find((t) => !t.hasAttribute('zen-glance-tab')), // Check if tab is removed from DOM
      'Wait for glance tab to be removed during cleanup'
    );
  }

  // 3. Create a new, clean tab that will be the only tab remaining.
  let newTab = await BrowserTestUtils.openNewForegroundTab(window.gBrowser, 'about:blank', true);
  gBrowser.selectedTab = newTab;

  // 4. Remove all other tabs, excluding the newly created one.
  // Convert gBrowser.tabs to an array to avoid issues with live collections changing during iteration.
  const tabsToRemove = Array.from(gBrowser.tabs).filter((tab) => tab !== newTab);

  for (const tab of tabsToRemove) {
    // BrowserTestUtils.removeTab correctly waits for the tab to be removed.
    await BrowserTestUtils.removeTab(tab);
  }

  // Final check: ensure exactly one non-empty tab remains and it is the new tab.
  await TestUtils.waitForCondition(
    () => getNonEmptyTabCount() === 1 && gBrowser.selectedTab === newTab,
    'Wait for only one non-empty tab to remain after cleanup, and it should be the new tab.'
  );
}
