/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

add_task(async function test_link_drop_center_opens_glance() {
  info('Starting test: Dropping a link in the center opens a glance view.');
  is(getNonEmptyTabCount(), 1, 'Should start with one tab.');
  ok(!gZenViewSplitter.splitViewActive, 'Split view should not be active initially.');

  await simulateLinkDragAndDrop('center');

  const glanceTab = await TestUtils.waitForCondition(
    () => gBrowser.tabs.find((t) => t.hasAttribute('zen-glance-tab')),
    'Wait for glance tab to appear'
  );

  ok(glanceTab, 'Glance tab should be created.');
  is(getNonEmptyTabCount(), 2, 'Should have two tabs after opening glance.');
  ok(!gZenViewSplitter.splitViewActive, 'Split view should not be activated for a center drop.');

  await cleanupSplitView();
});

