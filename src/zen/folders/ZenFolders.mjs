// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
{
  function formatRelativeTime(timestamp) {
    const now = Date.now();

    const sec = Math.floor((now - timestamp) / 1000);
    if (sec < 60) {
      return 'Just now';
    }

    const min = Math.floor(sec / 60);
    if (min < 60) {
      return `${min} minute${min === 1 ? '' : 's'} ago`;
    }

    const hour = Math.floor(min / 60);
    if (hour < 24) {
      return `${hour} hour${hour === 1 ? '' : 's'} ago`;
    }

    const day = Math.floor(hour / 24);
    if (day < 30) {
      return `${day} day${day === 1 ? '' : 's'} ago`;
    }

    const month = Math.floor(day / 30);
    return `${month} month${month === 1 ? '' : 's'} ago`;
  }

  class nsZenFolders extends nsZenPreloadedFeature {
    #popup = null;
    #popupTimer = null;
    #mouseTimer = null;
    #lastHighlightedGroup = null;

    #lastFolderContextMenu = null;

    #foldersEnabled = false;

    init() {
      this.#foldersEnabled = !gZenWorkspaces.privateWindowOrDisabled;

      if (!this.#foldersEnabled) {
        return;
      }

      this.#initContextMenu();
      this.#initTabsPopup();
      this.#initEventListeners();
    }

    #initContextMenu() {
      const contextMenuItems = window.MozXULElement.parseXULToFragment(
        `<menuitem id="zen-context-menu-new-folder" data-l10n-id="zen-toolbar-context-new-folder"/>`
      );
      document.getElementById('context_moveTabToGroup').before(contextMenuItems);

      const folderActionsMenu = document.getElementById('zenFolderActions');
      folderActionsMenu.addEventListener('popupshowing', (event) => {
        const folder =
          event.explicitOriginalTarget?.group || event.explicitOriginalTarget.parentElement?.group;
        // We only want to rename zen-folders as firefox groups don't work well with this
        if (!folder || folder.tagName.toLowerCase() !== 'zen-folder') {
          return;
        }
        this.#lastFolderContextMenu = folder;
        const changeFolderSpace = document
          .getElementById('context_zenChangeFolderSpace')
          .querySelector('menupopup');
        changeFolderSpace.innerHTML = '';
        for (const workspace of [...gZenWorkspaces._workspaceCache.workspaces].reverse()) {
          const item = document.createXULElement('menuitem');
          item.className = 'zen-workspace-context-menu-item';
          item.setAttribute('zen-workspace-id', workspace.uuid);
          item.setAttribute('disabled', workspace.uuid === gZenWorkspaces.activeWorkspace);
          let name = workspace.name;
          const iconIsSvg = workspace.icon && workspace.icon.endsWith('.svg');
          if (workspace.icon && workspace.icon !== '' && !iconIsSvg) {
            name = `${workspace.icon}  ${name}`;
          }
          item.setAttribute('label', name);
          if (iconIsSvg) {
            item.setAttribute('image', workspace.icon);
          }
          item.addEventListener('command', (event) => {
            if (!this.#lastFolderContextMenu) return;
            this.changeFolderToSpace(
              this.#lastFolderContextMenu,
              event.target.closest('menuitem').getAttribute('zen-workspace-id')
            );
          });
          changeFolderSpace.appendChild(item);
        }
      });

      folderActionsMenu.addEventListener(
        'popuphidden',
        (event) => {
          if (event.target === folderActionsMenu) {
            this.#lastFolderContextMenu = null;
          }
        },
        { once: true }
      );

      folderActionsMenu.addEventListener('command', (event) => {
        if (!this.#lastFolderContextMenu) return;
        switch (event.target.id) {
          case 'context_zenFolderRename':
            this.#lastFolderContextMenu.rename();
            break;
          case 'context_zenFolderExpand':
            this.#lastFolderContextMenu.expandGroupTabs();
            break;
          case 'context_zenFolderDelete':
            this.#lastFolderContextMenu.delete();
            break;
          case 'context_zenFolderToSpace':
            this.#convertFolderToSpace(this.#lastFolderContextMenu);
            break;
          case 'context_zenFolderChangeIcon':
            this.changeFolderUserIcon(this.#lastFolderContextMenu);
            break;
        }
      });
    }

    #initTabsPopup() {
      this.#popup = document.getElementById('zen-folder-tabs-popup');

      const search = this.#popup.querySelector('#zen-folder-tabs-list-search');
      const tabsList = this.#popup.querySelector('#zen-folder-tabs-list');

      search.addEventListener('input', () => {
        const query = search.value.toLowerCase();
        for (const item of tabsList.children) {
          item.hidden = !item.getAttribute('data-label').includes(query);
        }
      });

      this.#popup.addEventListener('mouseenter', () => {
        clearTimeout(this.#popupTimer);
      });

      this.#popup.addEventListener('mouseleave', () => {
        this.#popupTimer = setTimeout(() => {
          if (this.#popup.matches(':hover')) return;
          this.#popup.hidePopup();
        }, 200);
      });
    }

    #initEventListeners() {
      window.addEventListener('TabGrouped', this.#onTabGrouped.bind(this));
      window.addEventListener('TabUngrouped', this.#onTabUngrouped.bind(this));
      window.addEventListener('TabGroupRemoved', this.#onTabGroupRemoved.bind(this));
      window.addEventListener('TabGroupCreate', this.#onTabGroupCreate.bind(this));
      window.addEventListener('TabPinned', this.#onTabPinned.bind(this));
      window.addEventListener('TabUnpinned', this.#onTabUnpinned.bind(this));
      window.addEventListener('TabGroupExpand', this.#onTabGroupExpand.bind(this));
      window.addEventListener('TabGroupCollapse', this.#onTabGroupCollapse.bind(this));
      window.addEventListener('FolderGrouped', this.#onFolderGrouped.bind(this));
      document
        .getElementById('zen-context-menu-new-folder')
        .addEventListener('command', this.#onNewFolder.bind(this));
    }

    #onTabGrouped(event) {
      const tab = event.detail;
      const group = tab.group;
      group.pinned = tab.pinned;

      if (group.hasAttribute('split-view-group') && group.hasAttribute('zen-pinned-changed')) {
        // zen-pinned-changed remove it and set it to had-zen-pinned-changed to keep
        // track of the original pinned state
        group.removeAttribute('zen-pinned-changed');
        group.setAttribute('had-zen-pinned-changed', true);
      }

      if (group.collapsed && !this._sessionRestoring) {
        group.collapsed = false;
      }
    }

    #onFolderGrouped(event) {
      const folder = event.detail;
      folder.group.collapsed = false;
    }

    #onTabUngrouped(event) {
      const tab = event.detail;
      const group = event.target;
      tab.removeAttribute('folder-active');
      if (group.hasAttribute('split-view-group') && tab.hasAttribute('had-zen-pinned-changed')) {
        tab.setAttribute('zen-pinned-changed', true);
        tab.removeAttribute('had-zen-pinned-changed');
      }
    }

    #onTabGroupCreate(event) {
      const group = event.target;
      const tabs = group.tabs;
      if (!group.pinned) {
        return;
      }
      for (const tab of tabs) {
        if (tab.hasAttribute('zen-pinned-changed')) {
          tab.removeAttribute('zen-pinned-changed');
          tab.setAttribute('had-zen-pinned-changed', true);
        }
      }
    }

    #onTabGroupRemoved() {}

    #onTabPinned(event) {
      const tab = event.target;
      const group = tab.group;
      if (group && group.hasAttribute('split-view-group')) {
        group.pinned = true;
      }
    }

    #onTabUnpinned(event) {
      const tab = event.target;
      const group = tab.group;
      if (group && group.hasAttribute('split-view-group')) {
        group.pinned = false;
      }
    }

    #cancelPopupTimer() {
      if (this.#mouseTimer) {
        clearTimeout(this.#mouseTimer);
        this.#mouseTimer = null;
      }
      this.#popup.hidePopup();
    }

    async #onTabGroupCollapse(event) {
      const group = event.target;

      this.#cancelPopupTimer();

      const tabsContainer = group.querySelector('.tab-group-container');
      const animations = [];
      const groupStart = group.querySelector('.zen-tab-group-start');
      let heightUntilSelected = 0;
      let selectedItem = null;
      let selectedGroupId = null;
      let itemsAfterSelected = [];

      const splitViewGroups = new Set();

      const items = group.childGroupsAndTabs.map((item) => {
        if (gBrowser.isTabGroupLabel(item)) item = item.parentNode;

        const isSplitView = item.group?.hasAttribute?.('split-view-group');
        const splitGroupId = isSplitView ? item.group.id : null;

        if (item.hasAttribute('visuallyselected')) {
          selectedItem = item;
          selectedGroupId = splitGroupId;
        }

        return { item, isSplitView, splitGroupId };
      });

      for (const { item, isSplitView, splitGroupId } of items) {
        if (item === selectedItem || (selectedGroupId && splitGroupId === selectedGroupId)) break;

        let itemHeight = 0;
        if (!splitViewGroups.has(splitGroupId)) {
          // FIX: split-view-group have a completely different margin and height
          itemHeight = item.getBoundingClientRect().height;
          splitViewGroups.add(splitGroupId);
        } else if (!isSplitView) {
          itemHeight = item.getBoundingClientRect().height;
        }

        heightUntilSelected += itemHeight;
        if (gBrowser.isTabGroupLabel(item.lastChild)) heightUntilSelected += 2;
      }

      let afterSelected = false;
      for (const { item, groupId } of items) {
        if (item === selectedItem) {
          afterSelected = true;
          continue;
        }
        if (selectedGroupId && groupId === selectedGroupId) continue;
        if (afterSelected) itemsAfterSelected.push(item);
      }

      if (selectedItem) {
        group.setAttribute('has-active', 'true');
        selectedItem.setAttribute('folder-active', 'true');
      }

      animations.push(...this.updateFolderIcon(group));
      animations.push(
        gZenUIManager.motion.animate(
          groupStart,
          {
            marginTop: [0, -(heightUntilSelected + 4 * !selectedItem)],
          },
          { duration: 0.15, ease: 'easeInOut' }
        )
      );

      await Promise.all(animations);
      if (!selectedItem) tabsContainer.setAttribute('hidden', true);
    }

    async #onTabGroupExpand(event) {
      const group = event.target;

      this.#cancelPopupTimer();

      const tabsContainer = group.querySelector('.tab-group-container');
      tabsContainer.removeAttribute('hidden');

      const groupStart = group.querySelector('.zen-tab-group-start');
      const animations = [];
      tabsContainer.style.overflow = 'hidden';
      if (group.hasAttribute('has-active')) {
        group.removeAttribute('has-active');
      }

      // Since the folder is now expanded, we should remove active attribute
      // to the tab that was previously visible
      for (const tab of group.tabs) {
        if (tab.group === group && tab.hasAttribute('folder-active')) {
          tab.removeAttribute('folder-active');
        }
      }

      animations.push(...this.updateFolderIcon(group));
      animations.push(
        gZenUIManager.motion.animate(
          groupStart,
          {
            marginTop: 0,
          },
          {
            duration: 0.15,
            ease: 'linear',
          }
        )
      );
      await Promise.all(animations);
      tabsContainer.style.overflow = '';
    }

    #onNewFolder(event) {
      const contextMenu = event.target.parentElement;
      let tabs = [];
      let triggerTab =
        contextMenu.triggerNode &&
        (contextMenu.triggerNode.tab || contextMenu.triggerNode.closest('tab'));

      tabs.push(triggerTab, ...gBrowser.selectedTabs);

      const group = this.createFolder(tabs, { insertBefore: triggerTab });
      this.#groupInit(group);
    }

    async #convertFolderToSpace(folder) {
      const currentWorkspace = gZenWorkspaces.getActiveWorkspaceFromCache();
      let selectedTab = folder.tabs.find((tab) => tab.selected);
      const newSpace = await gZenWorkspaces.createAndSaveWorkspace(
        folder.label,
        /* icon= */ undefined,
        /* dontChange= */ false,
        currentWorkspace.containerTabId,
        {
          beforeChangeCallback: async (newWorkspace) => {
            await new Promise((resolve) => {
              requestAnimationFrame(async () => {
                const workspacePinnedContainer = gZenWorkspaces.workspaceElement(
                  newWorkspace.uuid
                ).pinnedTabsContainer;
                const tabs = folder.allItems.filter((tab) => !tab.hasAttribute('zen-empty-tab'));
                workspacePinnedContainer.append(...tabs);
                await folder.delete();
                gBrowser.tabContainer._invalidateCachedTabs();
                if (selectedTab) {
                  selectedTab.setAttribute('zen-workspace-id', newWorkspace.uuid);
                  gZenWorkspaces._lastSelectedWorkspaceTabs[newWorkspace.uuid] = selectedTab;
                }
                resolve();
              });
            });
          },
        }
      );
      // Change the ID for all tabs
      for (const tab of gBrowser.tabs) {
        if (!tab.hasAttribute('zen-essential')) {
          tab.setAttribute('zen-workspace-id', newSpace.uuid);
        }
        gBrowser.TabStateFlusher.flush(tab.linkedBrowser);
        if (gZenWorkspaces._lastSelectedWorkspaceTabs[currentWorkspace.uuid] === tab) {
          // This tab is no longer the last selected tab in the previous workspace because it's being moved to
          // the current workspace
          delete gZenWorkspaces._lastSelectedWorkspaceTabs[currentWorkspace.uuid];
        }
      }
    }

    changeFolderToSpace(folder, workspaceId) {
      const currentWorkspace = gZenWorkspaces.getActiveWorkspaceFromCache();
      if (currentWorkspace.uuid === workspaceId) {
        return;
      }
      const workspaceElement = gZenWorkspaces.workspaceElement(workspaceId);
      const pinnedTabsContainer = workspaceElement.pinnedTabsContainer;
      pinnedTabsContainer.insertBefore(folder, pinnedTabsContainer.lastChild);
      for (const tab of folder.tabs) {
        tab.setAttribute('zen-workspace-id', workspaceId);
        gBrowser.TabStateFlusher.flush(tab.linkedBrowser);
        if (gZenWorkspaces._lastSelectedWorkspaceTabs[workspaceId] === tab) {
          // This tab is no longer the last selected tab in the previous workspace because it's being moved to a new workspace
          delete gZenWorkspaces._lastSelectedWorkspaceTabs[workspaceId];
        }
      }
      gZenWorkspaces.changeWorkspaceWithID(workspaceId);
    }

    createFolder(tabs = [], options = {}) {
      for (const tab of tabs) {
        gBrowser.pinTab(tab);
      }
      const insertBefore =
        options.insertBefore ||
        gZenWorkspaces.pinnedTabsContainer.querySelector('.pinned-tabs-container-separator');
      const emptyTab = gBrowser.addTab('about:blank', {
        skipAnimation: true,
        pinned: true,
        triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
        _forZenEmptyTab: true,
      });

      tabs = [...tabs, emptyTab];

      const folder = this._createFolderNode(options);

      insertBefore.before(folder);
      gZenVerticalTabsManager.animateItemOpen(folder);

      folder.addTabs(tabs);

      // Fixes bug1953801 and bug1954689
      // Ensure that the tab state cache is updated immediately after creating
      // a group. This is necessary because we consider group creation a
      // deliberate user action indicating the tab has importance for the user.
      // Without this, it is not possible to save and close a tab group with
      // a short lifetime.
      folder.tabs.forEach((tab) => {
        gBrowser.TabStateFlusher.flush(tab.linkedBrowser);
      });

      this.updateFolderIcon(folder, 'auto', false);

      if (options.renameFolder) {
        folder.rename();
      }
      return folder;
    }

    _createFolderNode(options = {}) {
      const folder = document.createXULElement('zen-folder', { is: 'zen-folder' });
      let id = options.id;
      if (!id) {
        // Note: If this changes, make sure to also update the
        // getExtTabGroupIdForInternalTabGroupId implementation in
        // browser/components/extensions/parent/ext-browser.js.
        // See: Bug 1960104 - Improve tab group ID generation in addTabGroup
        id = `${Date.now()}-${Math.round(Math.random() * 100)}`;
      }
      folder.id = id;
      folder.label = options.label || 'New Folder';
      folder.collapsed = !!options.collapsed;
      folder.pinned = options.pinned ?? true;
      folder.saveOnWindowClose = !!options.saveOnWindowClose;
      folder.color = 'zen-workspace-color';

      return folder;
    }

    handleTabPin(tab) {
      const group = tab.group;
      if (!group) {
        return false;
      }
      if (group.hasAttribute('split-view-group') && !this._piningFolder) {
        this._piningFolder = true;
        for (const otherTab of group.tabs) {
          gZenPinnedTabManager.resetPinChangedUrl(otherTab);
          if (tab === otherTab) {
            continue;
          }
          gBrowser.pinTab(otherTab);
        }
        this._piningFolder = false;
        gBrowser.pinnedTabsContainer.insertBefore(group, gBrowser.pinnedTabsContainer.lastChild);
        gBrowser.tabContainer._invalidateCachedTabs();
        return true;
      }
      return this._piningFolder;
    }

    handleTabUnpin(tab) {
      const group = tab.group;
      if (!group) {
        return false;
      }
      if (group.hasAttribute('split-view-group') && !this._piningFolder) {
        this._piningFolder = true;
        for (const otherTab of group.tabs) {
          if (tab === otherTab) {
            continue;
          }
          gBrowser.unpinTab(otherTab);
        }
        this._piningFolder = false;
        gZenWorkspaces.activeWorkspaceStrip.prepend(group);
        gBrowser.tabContainer._invalidateCachedTabs();
        return true;
      }
      return this._piningFolder;
    }

    openTabsPopup(event) {
      event.stopPropagation();

      const activeGroup = event.target.parentElement;

      this.#populateTabsList(activeGroup);

      const search = this.#popup.querySelector('#zen-folder-tabs-list-search');
      document.l10n.setArgs(search, {
        'folder-name': activeGroup.name,
      });
      const tabsList = this.#popup.querySelector('#zen-folder-tabs-list');

      search.addEventListener('input', () => {
        const query = search.value.toLowerCase();
        let foundTabs = 0;
        for (const item of tabsList.children) {
          const found = item.getAttribute('data-label').includes(query);
          item.hidden = !found;
          if (found) {
            foundTabs++;
          }
        }
        document.getElementById('zen-folder-tabs-search-no-results').hidden = foundTabs > 0;
      });

      const target = event.target;
      target.setAttribute('open', true);

      const handlePopupHidden = (event) => {
        if (event.target !== this.#popup) return;
        search.value = '';
        target.removeAttribute('open');
      };

      this.#popup.addEventListener(
        'popupshown',
        () => {
          search.focus();
          search.select();
        },
        { once: true }
      );

      this.#popup.addEventListener('popuphidden', handlePopupHidden, { once: true });
      this.#popup.openPopup(target, this.#searchPopupOptions);
    }

    get #searchPopupOptions() {
      const isRightSide = gZenVerticalTabsManager._prefsRightSide;
      const position = isRightSide ? 'topleft topright' : 'topright topleft';
      return {
        position: position,
        x: 0,
        y: 3,
      };
    }

    #populateTabsList(group) {
      const tabsList = this.#popup.querySelector('#zen-folder-tabs-list');
      tabsList.replaceChildren();

      for (const tab of group.tabs) {
        if (tab.hidden || tab.hasAttribute('zen-empty-tab')) continue;

        const item = document.createElement('div');
        item.className = 'tabs-list-item';

        const content = document.createElement('div');
        content.className = 'tabs-list-item-content';

        const icon = document.createElement('img');
        icon.className = 'tabs-list-item-icon';

        let tabURL = tab.linkedBrowser?.currentURI?.spec || '';
        let tabLabel = tab.label || '';
        let iconURL =
          gBrowser.getIcon(tab) ||
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3C/svg%3E";

        icon.src = iconURL;

        const labelsContainer = document.createElement('div');
        labelsContainer.className = 'tabs-list-item-labels';

        const mainLabel = document.createElement('div');
        mainLabel.className = 'tabs-list-item-label';
        mainLabel.textContent = tabLabel;

        const secondaryLabel = document.createElement('div');
        secondaryLabel.className = 'tab-list-item-secondary-label';
        secondaryLabel.textContent = formatRelativeTime(tab.lastAccessed);

        labelsContainer.append(mainLabel, secondaryLabel);
        content.append(icon, labelsContainer);
        item.append(content);

        if (tab.selected) {
          item.setAttribute('selected', 'true');
        }

        item.setAttribute('data-label', `${tabLabel.toLowerCase()} ${tabURL.toLowerCase()}`);

        item.addEventListener('click', () => {
          gBrowser.selectedTab = tab;
          this.#popup.hidePopup();
        });

        tabsList.appendChild(item);
      }
    }

    updateFolderIcon(group, state = 'auto', play = true) {
      if (!gBrowser.isTabGroup(group)) return [];
      const svg = group.querySelector('svg');
      if (!svg) return [];

      const isCollapsed = group.collapsed;
      const hasActive = group.hasAttribute('has-active');
      const animStates = {
        open: 0.3,
        close: 0,
        auto: isCollapsed ? 0 : 0.3,
      };

      svg.unpauseAnimations();
      if (!play) {
        svg.pauseAnimations();
        svg.setCurrentTime(animStates[state]);
        return [];
      }

      const animations = svg.querySelectorAll('animate, animateTransform, animateMotion');
      animations.forEach((anim) => {
        const origValues = anim.dataset.origValues;
        const [fromValue, toValue] = origValues.split(';');
        let newValues;

        const parentId = anim.parentElement.id;
        const isOpacity = anim.getAttribute('attributeName') === 'opacity';
        const isActive = isCollapsed && hasActive && isOpacity;

        if (parentId === 'folder-dots' && isActive) {
          newValues = '0;1';
          anim.dataset.origValues = '1;0';
        } else if (parentId === 'folder-icon' && isActive) {
          newValues = '1;0';
          anim.dataset.origValues = '0;1';
        } else {
          if (parentId === 'folder-dots' && isOpacity) {
            anim.dataset.origValues = '0;0';
          } else if (parentId === 'folder-icon' && isOpacity) {
            anim.dataset.origValues = '1;1';
          }
          const stateValues = {
            open: `${fromValue};${toValue}`,
            close: `${toValue};${fromValue}`,
            auto: isCollapsed ? `${toValue};${fromValue}` : `${fromValue};${toValue}`,
          };
          newValues = stateValues[state];
        }

        anim.setAttribute('values', newValues);
        anim.beginElement();
      });
      return [];
    }

    changeFolderUserIcon(group) {
      if (!group) return;

      gZenEmojiPicker
        .open(group, { onlySvgIcons: true })
        .then((icon) => {
          this.setFolderUserIcon(group, icon);
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    }

    setFolderUserIcon(group, icon) {
      const svgIcon = group.icon.querySelector('svg #folder-icon image');
      if (!svgIcon) return;
      svgIcon.setAttribute('href', icon);
      svgIcon.setAttribute('transform', 'translate(-53, 2.5) scale(0.8)');
    }

    collapseVisibleTab(group) {
      const groupStart = group.querySelector('.zen-tab-group-start');
      groupStart.setAttribute('old-margin', groupStart.style.marginTop);
      let itemHeight = 0;
      for (const item of group.allItems) {
        itemHeight += item.getBoundingClientRect().height;
      }
      const newMargin = -(itemHeight + 4);
      groupStart.setAttribute('new-margin', newMargin);

      gZenUIManager.motion.animate(
        groupStart,
        {
          marginTop: newMargin,
        },
        { duration: 0.15, ease: 'easeInOut' }
      );
    }

    expandVisibleTab(group) {
      const groupStart = group.querySelector('.zen-tab-group-start');
      let oldMargin = groupStart.getAttribute('old-margin');
      let newMargin = groupStart.getAttribute('new-margin');

      gZenUIManager.motion.animate(
        groupStart,
        {
          marginTop: [`${newMargin}px`, oldMargin],
        },
        { duration: 0.15, ease: 'easeInOut' }
      );
      groupStart.removeAttribute('old-margin');
      groupStart.removeAttribute('new-margin');
    }

    #groupInit(group, stateData) {
      // Setup zen-folder icon to the correct position
      this.updateFolderIcon(group, 'auto', false);
      this.setFolderUserIcon(group, stateData.userIcon);

      const tabsContainer = group.querySelector('.tab-group-container');
      const groupStart = group.querySelector('.zen-tab-group-start');
      let containerMargin = 0;
      for (const item of tabsContainer.children) {
        const rect = item.getBoundingClientRect();
        containerMargin += rect.height;
      }
      if (group.collapsed) {
        groupStart.style.marginTop = `-${containerMargin}px`;
      }

      const labelContainer = group.querySelector('.tab-group-label-container');
      // Setup mouseenter/mouseleave events for the folder
      labelContainer.addEventListener('mouseenter', (event) => {
        if (!group.collapsed || !Services.prefs.getBoolPref('zen.folders.search.enabled')) {
          return;
        }
        this.#mouseTimer = setTimeout(() => {
          this.openTabsPopup(event);
        }, Services.prefs.getIntPref('zen.folders.search.hover-delay'));
      });
      labelContainer.addEventListener('mouseleave', () => {
        clearTimeout(this.#mouseTimer);
        if (!group.collapsed) return;
        this.#mouseTimer = setTimeout(() => {
          // If popup is focused don't hide it
          if (this.#popup.matches(':hover')) return;
          this.#popup.hidePopup();
        }, 200);
      });
    }

    storeDataForSessionStore() {
      const folders = Array.from(gBrowser.tabContainer.querySelectorAll('zen-folder'));
      const splitGroups = Array.from(
        gBrowser.tabContainer.querySelectorAll('tab-group[split-view-group]')
      );
      const allData = [...folders, ...splitGroups];

      // Sort elements in the order in which they appear in the DOM
      allData.sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });

      const storedData = [];

      for (const folder of allData) {
        const parentFolder = folder.parentElement.closest('zen-folder');
        // Skip split-view-group if it's not a zen-folder child
        if (!parentFolder && folder.hasAttribute('split-view-group')) continue;
        const emptyFolderTabs = folder.tabs
          .filter((tab) => tab.hasAttribute('zen-empty-tab'))
          .map((tab) => tab.getAttribute('zen-pin-id'));

        let prevSiblingInfo = null;
        const prevSibling = folder.previousElementSibling;
        const userIcon = folder?.icon?.querySelector('svg #folder-icon image') || '';

        if (prevSibling) {
          if (gBrowser.isTabGroup(prevSibling)) {
            prevSiblingInfo = { type: 'group', id: prevSibling.id };
          } else if (gBrowser.isTab(prevSibling)) {
            const zenPinId = prevSibling.getAttribute('zen-pin-id');
            prevSiblingInfo = { type: 'tab', id: zenPinId };
          } else {
            prevSiblingInfo = { type: 'start', id: null };
          }
        }

        storedData.push({
          pinned: folder.pinned,
          essential: folder.essential,
          splitViewGroup: folder.hasAttribute('split-view-group'),
          id: folder.id,
          name: folder.label,
          collapsed: folder.collapsed,
          saveOnWindowClose: folder.saveOnWindowClose,
          parentId: parentFolder ? parentFolder.id : null,
          prevSiblingInfo: prevSiblingInfo,
          emptyTabIds: emptyFolderTabs,
          userIcon: userIcon.getAttribute('href'),
        });
      }
      return storedData;
    }

    restoreDataFromSessionStore(data) {
      if (!data || this._sessionRestoring) {
        return;
      }

      this._sessionRestoring = true;

      const tabFolderWorkingData = new Map();

      for (const folderData of data) {
        const workingData = {
          stateData: folderData,
          node: null,
          containingTabsFragment: document.createDocumentFragment(),
        };
        tabFolderWorkingData.set(folderData.id, workingData);

        const oldGroup = document.getElementById(folderData.id);
        folderData.emptyTabIds.forEach((zenPinId) => {
          oldGroup
            ?.querySelector(`tab[zen-pin-id="${zenPinId}"]`)
            ?.setAttribute('zen-empty-tab', true);
        });
        if (oldGroup) {
          if (!folderData.splitViewGroup) {
            const folder = this._createFolderNode({
              id: folderData.id,
              label: folderData.name,
              collapsed: folderData.collapsed,
              pinned: folderData.pinned,
              saveOnWindowClose: folderData.saveOnWindowClose,
            });
            workingData.node = folder;
            oldGroup.before(folder);
          } else {
            workingData.node = oldGroup;
          }
          while (oldGroup.tabs.length > 0) {
            workingData.containingTabsFragment.appendChild(oldGroup.tabs[0]);
          }
          if (!folderData.splitViewGroup) {
            oldGroup.remove();
          }
        }
      }

      for (const { node, containingTabsFragment } of tabFolderWorkingData.values()) {
        if (node) {
          node.appendChild(containingTabsFragment);
        }
      }

      // Nesting folders into each other according to parentId.
      for (const { stateData, node } of tabFolderWorkingData.values()) {
        if (node && stateData.parentId) {
          const parentWorkingData = tabFolderWorkingData.get(stateData.parentId);
          if (parentWorkingData && parentWorkingData.node) {
            switch (stateData?.prevSiblingInfo?.type) {
              case 'group': {
                const folder = document.querySelector(`[id="${stateData.prevSiblingInfo.id}"]`);
                gBrowser.moveTabAfter(node, folder);
                break;
              }
              case 'tab': {
                const tab = parentWorkingData.node.querySelector(
                  `[zen-pin-id="${stateData.prevSiblingInfo.id}"]`
                );
                gBrowser.moveTabAfter(node, tab);
                break;
              }
              default: {
                const start = parentWorkingData.node.querySelector('.zen-tab-group-start');
                start.after(node);
              }
            }
          }
        }
      }

      // Initialize UI state for all folders.
      for (const { stateData, node } of tabFolderWorkingData.values()) {
        if (node && !stateData.splitViewGroup) {
          this.#groupInit(node, stateData);
        }
      }

      gBrowser.tabContainer._invalidateCachedTabs();
      this._sessionRestoring = false;
    }

    /**
     * Highlights the given tab group and removes highlight from any previously highlighted group.
     * @param {MozTabbrowserTabGroup|undefined|null} folder The folder to highlight, or null to clear highlight.
     * @param {Array<MozTabbrowserTab>|null} movingTabs The tabs being moved.
     */
    highlightGroupOnDragOver(folder, movingTabs) {
      if (folder === this.#lastHighlightedGroup) return;
      const tab = movingTabs ? movingTabs[0] : null;
      if (this.#lastHighlightedGroup && this.#lastHighlightedGroup !== folder) {
        this.#lastHighlightedGroup.removeAttribute('selected');
        if (this.#lastHighlightedGroup.collapsed) {
          this.updateFolderIcon(this.#lastHighlightedGroup, 'close');
        }
        this.#lastHighlightedGroup = null;
      }

      if (
        folder &&
        (!folder.hasAttribute('split-view-group') || !folder.hasAttribute('selected')) &&
        folder !== tab?.group
      ) {
        folder.setAttribute('selected', 'true');
        folder.style.transform = '';
        if (folder.collapsed) {
          this.updateFolderIcon(folder, 'open');
        }
        this.#lastHighlightedGroup = folder;
      }
    }
  }

  window.gZenFolders = new nsZenFolders();
}
