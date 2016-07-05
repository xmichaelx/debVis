interface AdminLTEControlSidebarOptions {
    //Which button should trigger the open/close event
    toggleBtnSelector: string;
    //The sidebar selector
    selector: string;
    //Enable slide over content
    slide: boolean;
}

interface AdminLTEBoxWidgetIcons {
    //Collapse icon
    collapse: string;
    //Open icon
    open: string;
    //Remove icon
    remove: string;
}

interface AdminLTEBoxWidgetSelectors {
    //Remove button selector
    remove: string;
    //Collapse button selector
    collapse: string;
}

interface AdminLTEBoxWidgetOptions {
    boxWidgetIcons: AdminLTEBoxWidgetIcons;
    boxWidgetSelectors: AdminLTEBoxWidgetSelectors;
}

interface AdminLTEDirectChat {
    //Enable direct chat by default
    enable: boolean;
    //The button to open and close the chat contacts pane
    contactToggleSelector: string;
}

interface AdminLTEColors {
    lightBlue: string;
    red: string;
    green: string;
    aqua: string;
    yellow: string;
    blue: string;
    navy: string;
    teal: string;
    olive: string;
    lime: string;
    orange: string;
    fuchsia: string;
    purple: string;
    maroon: string;
    black: string;
    gray: string;
}

interface AdminLTEScreenSizes {
    xs: number;
    sm: number;
    md: number;
    lg: number;
}

interface AdminLTEOptions {
    navbarMenuSlimscroll: boolean;
    navMenuSlimscrollWidth: string;
    navbarMenuHeight: string;
    animationSpeed: number;
    sidebarToggleSelector: string;
    sidebarPushMenu: boolean;
    sidebarSlimScroll: boolean;
    sidebarExpandOnHover: boolean;
    enableBoxRefresh: boolean;
    enableBSToppltip: boolean;
    BSTooltipSelector: string;
    //Enable Fast Click. Fastclick.js creates a more
    //native touch experience with touch devices. If you
    //choose to enable the plugin, make sure you load the script
    //before AdminLTE's app.js
    enableFastclick: boolean;
    //Control Sidebar Options
    enableControlSidebar: boolean;
    controlSidebarOptions: AdminLTEControlSidebarOptions;
    //Box Widget Plugin. Enable this plugin
    //to allow boxes to be collapsed and/or removed
    enableBoxWidget: boolean;
    //Box Widget plugin options
    boxWidgetOptions: AdminLTEBoxWidgetOptions;
    //Direct Chat plugin options
    directChat: AdminLTEDirectChat;
    //Define the set of colors to use globally around the website
    colors: AdminLTEColors;
    //The standard screen sizes that bootstrap uses.
    //If you change these in the variables.less file, change
    //them here too.
    screenSizes: AdminLTEScreenSizes;
}

/* Layout
 * ======
 * Fixes the layout height in case min-height fails.
 *
 * @type Object
 * @usage $.AdminLTE.layout.activate()
 *        $.AdminLTE.layout.fix()
 *        $.AdminLTE.layout.fixSidebar()
 */
interface AdminLTELayout {
    activate(): void;
    fix(): void;
    fixSidebar(): void;
}

/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @type Function
 * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
 */
interface AdminLTEPushMenu {
    activate(toggleButtonData: string): void;
    expandOnHover(): void;
    expand(): void;
    collapse(): void;
}

/* Tree()
 * ======
 * Converts the sidebar into a multilevel
 * tree view menu.
 *
 * @type Function
 * @Usage: $.AdminLTE.tree('.sidebar')
 */
interface AdminLTETree {
    new (sidebarClass: string);
}

/* ControlSidebar
 * ==============
 * Adds functionality to the right sidebar
 *
 * @type Object
 * @usage $.AdminLTE.controlSidebar.activate(options)
 */
interface AdminLTEControlSidebar {
    activate(): void;
    open(sidebar: HTMLElement, slide: boolean): void;
    close(sidebar: HTMLElement, slide: boolean): void;
}

/* BoxWidget
 * =========
 * BoxWidget is a plugin to handle collapsing and
 * removing boxes from the screen.
 *
 * @type Object
 * @usage $.AdminLTE.boxWidget.activate()
 *        Set all your options in the main $.AdminLTE.options object
 */
interface AdminLTEBoxWidget {
    selectors: AdminLTEBoxWidgetSelectors;
    icons: AdminLTEBoxWidgetIcons;
    animationSpeed: number;
    activate(box?: string): void;
    collapse(element: HTMLElement): void;
    remove(element: HTMLElement): void;
}

interface AdminLTE {
    initialize(): void;
    isInitialized: boolean;
    options: AdminLTEOptions;
    layout: AdminLTELayout;
    pushMenu: AdminLTEPushMenu;
    controlSidebar: AdminLTEControlSidebar
    boxWidget: AdminLTEBoxWidget;
    tree(selector: string): void;
}

interface JQueryStatic {
    AdminLTE: AdminLTE;
}

interface JQuery {
    boxRefresh(options: any): any;
    activateBox(): void;
    todolist(options: any): any;
}

declare module 'adminLTE' {
    export = $;
}


declare var $: JQueryStatic;