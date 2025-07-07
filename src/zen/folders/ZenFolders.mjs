// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
{
  class ZenFolder extends MozTabbrowserTabGroup {
    #initialized = false;

    static markup = `
      <hbox class="tab-group-label-container" pack="center">
        <html:div class="tab-group-folder-icon"/>
        <label class="tab-group-label" role="button"/>
        <toolbarbutton class="toolbarbutton-1 zen-folder-tabs-button" tooltiptext="Group tabs button"/>
        <toolbarbutton class="toolbarbutton-1 zen-folder-action-button" tooltiptext="Group action button"/>
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
      <path shape-rendering="geometricPrecision" d="M -61.3 -5.25 C -61.3 -6.492 -60.293 -7.5 -59.05 -7.5 L -55.102 -7.5 C -54.591 -7.5 -54.096 -7.326 -53.697 -7.007 L -52.84 -6.321 C -52.175 -5.79 -51.349 -5.5 -50.498 -5.5 L -47.05 -5.5 C -45.807 -5.5 -44.8 -4.492 -44.8 -3.25 L -44.731 4.42 L -44.708 6.651 C -44.708 7.894 -45.715 8.901 -46.958 8.901 L -58.958 8.901 C -60.201 8.901 -61.208 7.894 -61.208 6.651 L -61.3 4.752 L -61.3 -5.25 Z" style="stroke-width: 1.25px; transform-box: fill-box; transform-origin: 50% 50%; fill: var(--zen-workspace-color-bg); stroke: var(--zen-workspace-color-stroke);">
        <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;17" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-1 -1.2" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.95 0.95" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
      </path>
      <path shape-rendering="geometricPrecision" d="M -61.3 -5.25 C -61.3 -6.492 -60.293 -7.5 -59.05 -7.5 L -55.102 -7.5 C -54.591 -7.5 -54.096 -7.326 -53.697 -7.007 L -52.84 -6.321 C -52.175 -5.79 -51.349 -5.5 -50.498 -5.5 L -47.05 -5.5 C -45.807 -5.5 -44.8 -4.492 -44.8 -3.25 L -44.731 4.42 L -44.708 6.651 C -44.708 7.894 -45.715 8.901 -46.958 8.901 L -58.958 8.901 C -60.201 8.901 -61.208 7.894 -61.208 6.651 L -61.3 4.752 L -61.3 -5.25 Z" style="stroke-width: 1.25; fill-opacity: 0.15; fill: url(&quot;#gradient-0&quot;); transform-origin: -53.004px 0.701px;">
        <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;17" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-1 -1.2" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.95 0.95" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
      </path>
    <!--Front Folder (rect)-->
      <rect shape-rendering="geometricPrecision" x="-61.301" y="-3.768" width="16.5" height="12.798" rx="2.25" style="stroke-width: 1.25px; transform-box: fill-box; transform-origin: 50% 50%; fill: var(--zen-workspace-color-fg); stroke: var(--zen-workspace-color-stroke);" id="object-0">
        <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;-17" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;3 -0.5" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.9 0.9" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
      </rect>
      <rect shape-rendering="geometricPrecision" x="-61.3" y="-3.8" width="16.5" height="12.798" style="stroke-width: 1.25; fill-opacity: 0.15; transform-origin: -53.05px 2.599px; fill: url(&quot;#gradient-1&quot;);" id="rect-1" rx="2.25">
        <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;-17" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;3 -0.5" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
        <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.9 0.9" dur="0.3s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.42 0 0.58 1"/>
      </rect>
    </svg>

      `,
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
  }

  customElements.define('zen-folder', ZenFolder);

  class ZenFolders extends ZenPreloadedFeature {
    init() {
      this.#initContextMenu();
      this.#initEventListeners();
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

    #initContextMenu() {
      const contextMenuItems = window.MozXULElement.parseXULToFragment(`
        <menuitem id="zen-context-menu-new-folder" data-l10n-id="zen-toolbar-context-new-folder"/>
        `);
      document.getElementById('toolbarNavigatorItemsMenuSeparator').before(contextMenuItems);
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
      this.#updateFolderIcon(group, 'auto', false);
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

    #onNewFolder(event) {
      const tabs = gBrowser.selectedTabs;
      this.createFolder(tabs);
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
      const label = options.label || 'New Folder';
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
      folder.label = label;
      folder.collapsed = !!options.collapsed;
      folder.pinned = true;
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
      return folder;
    }

    async #onTabGroupCollapse(event) {
      const group = event.target;
      if (group.nodeName !== 'zen-folder') return;

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
            marginTop: [0, -heightUntilSelected],
          },
          {
            duration: 0.15,
            ease: 'linear',
          }
        )
      );
      // TODO: Do the rest of the items after the selected item
      await Promise.all(animations);
    }

    async #onTabGroupExpand(event) {
      const group = event.target;
      if (group.nodeName !== 'zen-folder') return;

      const tabsContainer = group.querySelector('.tab-group-container');
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

    #updateFolderIcon(group, state = 'auto', play = true) {
      if (group.nodeName !== 'zen-folder') return;

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

    storeDataForSessionStore() {
      const folders = Array.from(gBrowser.tabContainer.querySelectorAll('zen-folder'));
      return folders.map((folder) => {
        return {
          pinned: folder.pinned,
          essential: folder.essential,
          id: folder.id,
          name: folder.label,
          collapsed: folder.collapsed,
          saveOnWindowClose: folder.saveOnWindowClose,
        };
      });
    }

    restoreDataFromSessionStore(data) {
      if (!data || this._sessionRestoring) {
        return;
      }

      this._sessionRestoring = true;

      let tabFolderWorkingData = new Map();
      let tabsFragment = document.createDocumentFragment();

      for (const folderData of data) {
        tabFolderWorkingData.set(folderData.id, {
          stateData: folderData,
          node: undefined,
          containingTabsFragment: document.createDocumentFragment(),
        });
      }

      for (const folderData of data) {
        const oldGroup = document.getElementById(folderData.id);
        const workingData = tabFolderWorkingData.get(folderData.id);

        if (oldGroup && workingData) {
          if (!workingData.node) {
            const folder = document.createXULElement('zen-folder', {
              is: 'zen-folder',
            });

            folder.id = workingData.stateData.id;
            folder.collapsed = workingData.stateData.collapsed;
            folder.label = workingData.stateData.name;
            folder.pinned = workingData.stateData.pinned;
            folder.saveOnWindowClose = workingData.stateData.saveOnWindowClose;

            workingData.node = folder;
            tabsFragment.appendChild(folder);
          }

          while (oldGroup.tabs.length > 0) {
            const tab = oldGroup.tabs[0];
            workingData.containingTabsFragment.appendChild(tab);
          }
        }
      }

      const tabbrowser = gBrowser;
      tabbrowser.tabContainer.appendChild(tabsFragment);

      for (const tabFolder of tabFolderWorkingData.values()) {
        if (tabFolder.node) {
          tabFolder.node.appendChild(tabFolder.containingTabsFragment);
        }
      }

      tabbrowser.tabContainer._invalidateCachedTabs();
      this._sessionRestoring = false;
    }
  }

  window.gZenFolders = new ZenFolders();
}
