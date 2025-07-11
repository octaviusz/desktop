/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

add_task(async function test_link_drop_split_top() {
  info('Starting test: Splitting a new view by dropping a link on the top.');
  const initialTab = gBrowser.selectedTab;
  is(getNonEmptyTabCount(), 1, 'Should start with one tab.');

  await simulateLinkDragAndDrop('top');

  await TestUtils.waitForCondition(
    () => gZenViewSplitter.splitViewActive,
    'Wait for split view to become active'
  );

  is(getNonEmptyTabCount(), 2, 'Should have two tabs after split.');
  const groupData = gZenViewSplitter._data.find((g) => g.tabs.includes(initialTab));
  ok(groupData, 'A split view group should be created.');
  is(groupData.gridType, 'hsep', 'Grid type should be horizontal split.');

  await cleanupSplitView();
});
