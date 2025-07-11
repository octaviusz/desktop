/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

add_task(async function test_link_drop_split_right() {
  info('Starting test: Splitting a new view by dropping a link on the right.');
  const initialTab = gBrowser.selectedTab;
  is(getNonEmptyTabCount(), 1, 'Should start with one tab.');
  ok(!gZenViewSplitter.splitViewActive, 'Split view should not be active initially.');

  await simulateLinkDragAndDrop('right');

  await TestUtils.waitForCondition(
    () => gZenViewSplitter.splitViewActive,
    'Wait for split view to become active'
  );

  is(getNonEmptyTabCount(), 2, 'Should have two tabs after split.');
  const groupData = gZenViewSplitter._data.find((g) => g.tabs.includes(initialTab));
  ok(groupData, 'A split view group should be created.');
  is(groupData.gridType, 'vsep', 'Grid type should be vertical split.');

  await cleanupSplitView();
});
