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
        <path id="folder-dots" shape-rendering="geometricPrecision" d="M -59.363 2.243 C -59.363 2.074 -59.33 1.915 -59.262 1.76 C -59.192 1.612 -59.107 1.478 -58.996 1.373 C -58.885 1.256 -58.751 1.165 -58.598 1.101 C -58.448 1.033 -58.289 1 -58.114 1 C -57.945 1 -57.785 1.033 -57.636 1.101 C -57.482 1.165 -57.354 1.256 -57.244 1.373 C -57.131 1.478 -57.042 1.612 -56.972 1.76 C -56.904 1.915 -56.871 2.074 -56.871 2.243 C -56.871 2.414 -56.904 2.573 -56.972 2.727 C -57.042 2.876 -57.131 3.008 -57.244 3.125 C -57.354 3.232 -57.482 3.321 -57.636 3.385 C -57.785 3.455 -57.945 3.486 -58.114 3.486 C -58.289 3.486 -58.448 3.455 -58.598 3.385 C -58.751 3.321 -58.885 3.232 -58.996 3.125 C -59.107 3.008 -59.192 2.876 -59.262 2.727 C -59.33 2.573 -59.363 2.414 -59.363 2.243 Z M -54.38 2.243 C -54.38 2.074 -54.347 1.915 -54.279 1.76 C -54.215 1.612 -54.124 1.478 -54.019 1.373 C -53.902 1.256 -53.769 1.165 -53.621 1.101 C -53.466 1.033 -53.306 1 -53.137 1 C -52.966 1 -52.807 1.033 -52.653 1.101 C -52.504 1.165 -52.372 1.256 -52.265 1.373 C -52.148 1.478 -52.059 1.612 -51.995 1.76 C -51.925 1.915 -51.894 2.074 -51.894 2.243 C -51.894 2.414 -51.925 2.573 -51.995 2.727 C -52.059 2.876 -52.148 3.008 -52.265 3.125 C -52.372 3.232 -52.504 3.321 -52.653 3.385 C -52.807 3.455 -52.966 3.486 -53.137 3.486 C -53.306 3.486 -53.466 3.455 -53.621 3.385 C -53.769 3.321 -53.902 3.232 -54.019 3.125 C -54.124 3.008 -54.215 2.876 -54.279 2.727 C -54.347 2.573 -54.38 2.414 -54.38 2.243 Z M -49.402 2.243 C -49.402 2.074 -49.37 1.915 -49.302 1.76 C -49.232 1.612 -49.147 1.478 -49.036 1.373 C -48.924 1.256 -48.791 1.165 -48.638 1.101 C -48.488 1.033 -48.329 1 -48.154 1 C -47.984 1 -47.824 1.033 -47.676 1.101 C -47.521 1.165 -47.395 1.256 -47.282 1.373 C -47.171 1.478 -47.082 1.612 -47.012 1.76 C -46.942 1.915 -46.911 2.074 -46.911 2.243 C -46.911 2.414 -46.942 2.573 -47.012 2.727 C -47.082 2.876 -47.171 3.008 -47.282 3.125 C -47.395 3.232 -47.521 3.321 -47.676 3.385 C -47.824 3.455 -47.984 3.486 -48.154 3.486 C -48.329 3.486 -48.488 3.455 -48.638 3.385 C -48.791 3.321 -48.924 3.232 -49.036 3.125 C -49.147 3.008 -49.232 2.876 -49.302 2.727 C -49.37 2.573 -49.402 2.414 -49.402 2.243 Z" style="fill-opacity: 1; fill: var(--toolbox-textcolor);">
          <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;-17" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -0.5" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.9 0.9" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
          <animate attributeName="opacity" values="0;0" dur="0.15s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        </path>
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
      if (selectedItem) {
        group.setAttribute('has-active', 'true');
      }

      animations.push(...this.#updateFolderIcon(group));
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
      if (group.hasAttribute('has-active')) {
        group.removeAttribute('has-active');
      }
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

        let newValues;

        // Animate folder dots
        if (
          anim.parentElement.id === 'folder-dots' &&
          anim.getAttribute('attributeName') === 'opacity' &&
          isCollapsed &&
          group.hasAttribute('has-active')
        ) {
          newValues = '0;1';
          // Animate folder icon
        } else {
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
