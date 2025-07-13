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

  class ZenFolder extends MozTabbrowserTabGroup {
    #initialized = false;

    static markup = `
      <hbox class="tab-group-label-container" pack="center">
        <html:div class="tab-group-folder-icon"/>
        <label class="tab-group-label" role="button"/>
      </hbox>
      <html:div class="tab-group-container">
        <html:div class="zen-tab-group-start" />
      </html:div>
    `;

    static rawIcon = new DOMParser().parseFromString(
      `
      <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="-67.409 -14.145 29.279 28.92">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" x1="-53.05" y1="-3.8" x2="-53.05" y2="8.998" id="gradient-1">
            <stop offset="0" style="stop-color: rgb(255, 255, 255);"/>
            <stop offset="1" style="stop-color: rgb(0% 0% 0%)"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" x1="-40.286" y1="-3.091" x2="-40.286" y2="13.31" id="gradient-0" gradientTransform="matrix(1, 0, 0, 1, -12.717999, -4.409)">
            <stop offset="0" style="stop-color: rgb(255, 255, 255);"/>
            <stop offset="1" style="stop-color: rgb(0% 0% 0%)"/>
          </linearGradient>
        </defs>
      <!--Back Folder (path)-->
        <path shape-rendering="geometricPrecision" d="M -61.3 -5.25 C -61.3 -6.492 -60.293 -7.5 -59.05 -7.5 L -55.102 -7.5 C -54.591 -7.5 -54.096 -7.326 -53.697 -7.007 L -52.84 -6.321 C -52.175 -5.79 -51.349 -5.5 -50.498 -5.5 L -47.05 -5.5 C -45.807 -5.5 -44.8 -4.492 -44.8 -3.25 L -44.731 4.42 L -44.708 6.651 C -44.708 7.894 -45.715 8.901 -46.958 8.901 L -58.958 8.901 C -60.201 8.901 -61.208 7.894 -61.208 6.651 L -61.3 4.752 L -61.3 -5.25 Z" style="stroke-width: 1.25px; transform-box: fill-box; transform-origin: 50% 50%; fill: var(--zen-folder-behind-bgcolor); stroke: var(--toolbox-textcolor);">
          <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;17" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-1 -1.2" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.95 0.95" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        </path>
        <path shape-rendering="geometricPrecision" d="M -61.3 -5.25 C -61.3 -6.492 -60.293 -7.5 -59.05 -7.5 L -55.102 -7.5 C -54.591 -7.5 -54.096 -7.326 -53.697 -7.007 L -52.84 -6.321 C -52.175 -5.79 -51.349 -5.5 -50.498 -5.5 L -47.05 -5.5 C -45.807 -5.5 -44.8 -4.492 -44.8 -3.25 L -44.731 4.42 L -44.708 6.651 C -44.708 7.894 -45.715 8.901 -46.958 8.901 L -58.958 8.901 C -60.201 8.901 -61.208 7.894 -61.208 6.651 L -61.3 4.752 L -61.3 -5.25 Z" style="stroke-width: 1.25; fill-opacity: 0.1; fill: url(&quot;#gradient-0&quot;); transform-origin: -53.004px 0.701px;">
          <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;17" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-1 -1.2" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.95 0.95" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        </path>
      <!--Front Folder (rect)-->
        <rect shape-rendering="geometricPrecision" x="-61.301" y="-3.768" width="16.5" height="12.798" rx="2.25" style="stroke-width: 1.25px; transform-box: fill-box; transform-origin: 50% 50%; fill: var(--zen-folder-front-bgcolor); stroke: var(--toolbox-textcolor);" id="object-0">
          <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;-17" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;3 -0.5" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.9 0.9" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        </rect>
        <rect shape-rendering="geometricPrecision" x="-61.3" y="-3.8" width="16.5" height="12.798" style="stroke-width: 1.25; fill-opacity: 0.1; transform-origin: -53.05px 2.599px; fill: url(&quot;#gradient-1&quot;);" id="rect-1" rx="2.25">
          <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;-17" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;3 -0.5" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.9 0.9" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        </rect>
      </svg>`,
      'image/svg+xml'
    ).documentElement;

    constructor() {
      super();
    }

    connectedCallback() {
      super.connectedCallback();
      if (this.#initialized) {
        return;
      }
      this.#initialized = true;
      this.icon.appendChild(ZenFolder.rawIcon.cloneNode(true));
      // Save original values for animations
      this.icon.querySelectorAll('animate, animateTransform, animateMotion').forEach((anim) => {
        const vals = anim.getAttribute('values');
        if (vals) {
          anim.dataset.origValues = vals;
        }
      });

      this.labelElement.pinned = true;
      this.labelElement.onRenameFinished = (newLabel) => {
        this.name = newLabel;
      };

      if (this.collapsed) {
        this.querySelector('.tab-group-container').setAttribute('hidden', true);
      }
    }

    get icon() {
      return this.querySelector('.tab-group-folder-icon');
    }

    /**
     * Returns the group this folder belongs to.
     * @returns {MozTabbrowserTabGroup|null} The group this folder belongs to, or null if it is not part of a group.
     **/
    get group() {
      if (gBrowser.isTabGroup(this.parentElement?.parentElement)) {
        return this.parentElement.parentElement;
      }
      return null;
    }

    get isZenFolder() {
      return true;
    }

    rename() {
      gZenVerticalTabsManager.renameTabStart({
        target: this.labelElement,
      });
    }
  }

  customElements.define('zen-folder', ZenFolder);

  class ZenFolders extends ZenPreloadedFeature {
    #popup = null;
    #popupTimer = null;
    #mouseTimer = null;

    init() {
      this.#initContextMenu();
      this.#initTabsPopup();
      this.#initEventListeners();
    }

    #initContextMenu() {
      const contextMenuItems = window.MozXULElement.parseXULToFragment(`
          <menuitem id="zen-context-menu-new-folder" data-l10n-id="zen-toolbar-context-new-folder"/>
          `);
      document.getElementById('context_moveTabToGroup').before(contextMenuItems);
    }

    #initTabsPopup() {
      this.#popup = document.getElementById('zen-folder-tabs-popup');

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
    }

    #onTabUngrouped(event) {
      const tab = event.detail;
      const group = event.target;
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

    #onTabGroupRemoved(event) {}

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
      let itemsAfterSelected = [];
      animations.push(...this.#updateFolderIcon(group));
      for (const item of tabsContainer.children) {
        const rect = item.getBoundingClientRect();
        if (item.hasAttribute('visuallyselected')) {
          selectedItem = item;
        } else if (!selectedItem) {
          heightUntilSelected += rect.height;
        } else {
          itemsAfterSelected.push(item);
        }
      }
      animations.push(
        gZenUIManager.motion.animate(
          groupStart,
          {
            marginTop: [0, -(heightUntilSelected + 4 * !selectedItem)],
          },
          {
            duration: 0.15,
            ease: 'linear',
          }
        )
      );
      // TODO: Do the rest of the items after the selected item
      await Promise.all(animations);
      tabsContainer.setAttribute('hidden', true);
    }

    async #onTabGroupExpand(event) {
      const group = event.target;

      this.#cancelPopupTimer();

      const tabsContainer = group.querySelector('.tab-group-container');
      tabsContainer.removeAttribute('hidden');

      const groupStart = group.querySelector('.zen-tab-group-start');
      const animations = [];
      tabsContainer.style.overflow = 'hidden';
      animations.push(...this.#updateFolderIcon(group));
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

    createFolder(tabs, options = {}) {
      for (const tab of tabs) {
        gBrowser.pinTab(tab);
      }
      const insertBefore =
        options.insertBefore ||
        gZenWorkspaces.pinnedTabsContainer.querySelector(
          '.vertical-pinned-tabs-container-separator'
        );

      const folder = this._createFolderNode();

      insertBefore.before(folder);
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

      this.#updateFolderIcon(folder, 'auto', false);

      folder.rename();
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

    expandGroupTabs(group) {
      for (const tab of group.tabs.reverse()) {
        gBrowser.ungroupTab(tab);
      }
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
        gBrowser.verticalPinnedTabsContainer.insertBefore(
          group,
          gBrowser.verticalPinnedTabsContainer.lastChild
        );
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
        for (const item of tabsList.children) {
          item.hidden = !item.getAttribute('data-label').includes(query);
        }
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
      return {
        position: 'topright topleft',
        x: 0,
        y: 3,
      };
    }

    #populateTabsList(group) {
      const tabsList = this.#popup.querySelector('#zen-folder-tabs-list');
      tabsList.replaceChildren();

      for (const tab of group.tabs) {
        if (tab.hidden) continue;

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

    #updateFolderIcon(group, state = 'auto', play = true) {
      const svg = group.querySelector('svg');
      if (!svg) return [];

      const isCollapsed = group.collapsed;
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

        // Select animation state
        let newValues = {
          open: `${fromValue};${toValue}`,
          close: `${toValue};${fromValue}`,
          auto: isCollapsed ? `${toValue};${fromValue}` : `${fromValue};${toValue}`,
        };

        anim.setAttribute('values', newValues[state]);
        anim.beginElement();
      });
      return [];
    }

    #groupInit(group) {
      // Setup zen-folder icon to the correct position
      this.#updateFolderIcon(group, 'auto', false);

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
      labelContainer.addEventListener('mouseleave', (event) => {
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
      return folders.map((folder) => {
        const parentFolder = folder.parentElement.closest('zen-folder');
        return {
          pinned: folder.pinned,
          essential: folder.essential,
          id: folder.id,
          name: folder.label,
          collapsed: folder.collapsed,
          saveOnWindowClose: folder.saveOnWindowClose,
          parentId: parentFolder ? parentFolder.id : null,
        };
      });
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
        if (oldGroup) {
          const folder = this._createFolderNode({
            id: folderData.id,
            label: folderData.name,
            collapsed: folderData.collapsed,
            pinned: folderData.pinned,
            saveOnWindowClose: folderData.saveOnWindowClose,
          });
          workingData.node = folder;
          oldGroup.before(folder);

          while (oldGroup.tabs.length > 0) {
            workingData.containingTabsFragment.appendChild(oldGroup.tabs[0]);
          }
          oldGroup.remove();
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
            parentWorkingData.node.appendChild(node);
          }
        }
      }

      // Initialize UI state for all folders.
      for (const { node } of tabFolderWorkingData.values()) {
        if (node) {
          this.#groupInit(node);
        }
      }

      gBrowser.tabContainer._invalidateCachedTabs();
      this._sessionRestoring = false;
    }
  }

  window.gZenFolders = new ZenFolders();
}
