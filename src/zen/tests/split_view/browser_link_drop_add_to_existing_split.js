/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

add_task(async function test_link_drop_add_to_existing_split() {
  info('Starting test: Adding a link to an existing split view.');
  const initialTab = gBrowser.selectedTab;

  await simulateLinkDragAndDrop('right'); // Create an initial split

  await TestUtils.waitForCondition(
    () => gZenViewSplitter.splitViewActive && getNonEmptyTabCount() === 2,
    'Wait for initial split view to become active'
  );

  // Drop another link to add to the existing split
  await simulateLinkDragAndDrop('left');

  await TestUtils.waitForCondition(
    () => getNonEmptyTabCount() === 3,
    'Wait for the third tab to be added'
  );

  const groupData = gZenViewSplitter._data.find((g) => g.tabs.includes(initialTab));
  is(groupData.tabs.length, 3, 'The group should now contain three tabs.');

  await cleanupSplitView();
});
