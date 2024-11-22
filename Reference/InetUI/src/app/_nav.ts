import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
  // {
  //   name: "User",
  //   url: "/user",
  //   icon: "icon-user",
  // },
  {
    name: "Configuration",
    url: "/configuration",
    children: [
      {
        name: "User Permission",
        url: "/configuration/user-permission",
        icon: "cil-circle",
      },
      {
        name: "Cycle",
        url: "/configuration/cycle",
        icon: "cil-circle",
      },
      {
        name: "User",
        url: "/configuration/user",
        icon: "cil-circle",
      },
      {
        name: "Non-Scada Email",
        url: "/configuration/email",
        icon: "cil-circle",
      },
    ],
  },
  {
    name: "Supply Zone",
    url: "/supply-zone",
    children: [
      {
        name: "11kV",
        url: "/supply-zone/11Kv",
        icon: "cil-circle",
      },
      {
        name: "33kV",
        url: "/supply-zone/33Kv",
        icon: "cil-circle",
      },
      {
        name: "Density Classification",
        url: "/supply-zone/density-classification",
        icon: "cil-circle",
      },
    ],
  },
  {
    name: "Master Asset",
    url: "/master-asset",
    children: [
      {
        name: "Substation",
        url: "/master-asset/substation",
        icon: "cil-circle",
      },
      {
        name: "Equipments",
        url: "/master-asset/equipments",
        icon: "cil-circle",
      },
      {
        name: "Feeders",
        url: "/master-asset/feeder",
        icon: "cil-circle",
      },
      {
        name: "Approved Projects",
        url: "/master-asset/approved-projects",
        icon: "cil-circle",
      },
      {
        name: "Renewables",
        url: "/master-asset/renewables",
        icon: "cil-circle",
      },
      {
        name: "Steploads",
        url: "/master-asset/steploads",
        icon: "cil-circle",
      },
      {
        name: "Non-Scada Inputs",
        url: "/master-asset/non-scada-inputs",
        icon: "cil-circle",
      },
      {
        name: "Reports",
        url: "/master-asset/reports",
        icon: "cil-circle",
      },
    ],
  },
  {
    name: "Load Forecast",
    url: "/load-forecast/lf-dashboard",
    // children: [
    //   {
    //     name: "Configuration",
    //     url: "/load-forecast/lf-configuration",
    //     icon: "cil-circle",
    //   },
    //   {
    //     name: "LF Project",
    //     url: "/load-forecast/lf-project",
    //     icon: "cil-circle",
    //   },
    // ],
  },
  {
    name: "Load Disaggregation",
    url: "/load-disaggregation",
    // children: [
    //   {
    //     name: "Configuration",
    //     url: "/load-disaggregation/ld-configuration",
    //     icon: "cil-circle",
    //   },
    //   {
    //     name: "Project",
    //     url: "/load-disaggregation/ld-project",
    //     icon: "cil-circle",
    //   },
    //   {
    //     name: "National View",
    //     url: "/load-disaggregation/ld-project-national",
    //     icon: "cil-circle",
    //   },
    // ],
  },
  {
    name: "Master Project",
    url: "/master-project",
    children: [
      {
        name: "Configuration",
        url: "/master-project/master-project-configuration",
        icon: "cil-circle",
      },
      {
        name: "Project List",
        url: "/master-project/master-project-list",
        icon: "cil-circle",
      },
      {
        name: "Project Re-Proposal",
        url: "/master-project/master-project-reproposal",
        icon: "cil-circle",
      },
      // {
      //   name: "Project Risk (RBDM)",
      //   url: "/master-project/master-project-risk",
      //   icon: "cil-circle",
      // },
      // {
      //   name: "Project Re-Proposal",
      //   url: "/master-project/master-project-list",
      //   icon: "cil-circle",
      // },
    ],
  },
  {
    name: "Capacity Planning",
    url: "/capacity-planning",
    children: [
      {
        name: "Approved Project",
        url: "/master-asset/approved-projects",
        icon: "cil-circle",
      }
    ],
  },
  {
    name: "DNMP",
    url: "/dnmp",
    // children: [
    //   {
    //     name: "Configuration",
    //     url: "/dnmp/dnmp-configuration",
    //     icon: "cil-circle",
    //   },
    //   {
    //     name: "DNMP 33kV Input",
    //     url: "/dnmp/dnmp33kv",
    //     icon: "cil-circle",
    //   },
    //   {
    //     name: "DNMP 11kV Input",
    //     url: "/dnmp/dnmp11kv",
    //     icon: "cil-circle",
    //   },
    // ],
  },
  {
    name: "AIPM",
    url: "/aipm",
    children: [
      {
        name: "Process Flow",
        url: "/aipm/aipm-dashboard",
        icon: "cil-circle",
      },
      // {
      //   name: "Configuration",
      //   url: "/aipm/aipm-configuration",
      //   icon: "cil-circle",
      // },
      {
        name: "Scenario Evaluation & Risk Assessment",
        url: "/aipm/aipm-cost-risk-profiling",
        icon: "cil-circle",
      },
      {
        name: "Budget Cost Optimization",
        url: "/aipm/aipm-budget-cost-optimization",
        icon: "cil-circle",
      },
      {
        name: "Portfolio Optimization",
        url: "/aipm/aipm-portfolio-optimization",
        icon: "cil-circle",
      },
      /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: SubMenu.ts.1.1.tpl
//===============================================================
{
    name: "State Submissions",
    url: "/aipm/aipm-wf-state-compilation",
    icon: "cil-circle",
},
//===============================================================
// TEMPLATE END: SubMenu.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: SubMenu.ts.1.1.tpl
//===============================================================
{
    name: "National Plan",
    url: "/aipm/aipm-wf-national-plan",
    icon: "cil-circle",
},
//===============================================================
// TEMPLATE END: SubMenu.ts.1.1.tpl
//===============================================================

      /* GENCODE:MARKER:1:END */
    ],
  },
  // {
  //   name: "Dashboard",
  //   url: "/dashboard",
  //   icon: "icon-speedometer",
  //   badge: {
  //     variant: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   title: true,
  //   name: "Theme",
  // },
  // {
  //   name: "Colors",
  //   url: "/theme/colors",
  //   icon: "icon-drop",
  // },
  // {
  //   name: "Typography",
  //   url: "/theme/typography",
  //   icon: "icon-pencil",
  // },
  // {
  //   title: true,
  //   name: "Components",
  // },
  // {
  //   name: "Base",
  //   url: "/base",
  //   icon: "icon-puzzle",
  //   children: [
  //     {
  //       name: "Cards",
  //       url: "/base/cards",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Carousels",
  //       url: "/base/carousels",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Collapses",
  //       url: "/base/collapses",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Forms",
  //       url: "/base/forms",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Navbars",
  //       url: "/base/navbars",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Pagination",
  //       url: "/base/paginations",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Popovers",
  //       url: "/base/popovers",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Progress",
  //       url: "/base/progress",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Switches",
  //       url: "/base/switches",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Tables",
  //       url: "/base/tables",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Tabs",
  //       url: "/base/tabs",
  //       icon: "icon-puzzle",
  //     },
  //     {
  //       name: "Tooltips",
  //       url: "/base/tooltips",
  //       icon: "icon-puzzle",
  //     },
  //   ],
  // },
  // {
  //   name: "Buttons",
  //   url: "/buttons",
  //   icon: "icon-cursor",
  //   children: [
  //     {
  //       name: "Buttons",
  //       url: "/buttons/buttons",
  //       icon: "icon-cursor",
  //     },
  //     {
  //       name: "Dropdowns",
  //       url: "/buttons/dropdowns",
  //       icon: "icon-cursor",
  //     },
  //     {
  //       name: "Brand Buttons",
  //       url: "/buttons/brand-buttons",
  //       icon: "icon-cursor",
  //     },
  //   ],
  // },
  // {
  //   name: "Charts",
  //   url: "/charts",
  //   icon: "icon-pie-chart",
  // },
  // {
  //   name: "Icons",
  //   url: "/icons",
  //   icon: "icon-star",
  //   children: [
  //     {
  //       name: "CoreUI Icons",
  //       url: "/icons/coreui-icons",
  //       icon: "icon-star",
  //       badge: {
  //         variant: "success",
  //         text: "NEW",
  //       },
  //     },
  //     {
  //       name: "Flags",
  //       url: "/icons/flags",
  //       icon: "icon-star",
  //     },
  //     {
  //       name: "Font Awesome",
  //       url: "/icons/font-awesome",
  //       icon: "icon-star",
  //       badge: {
  //         variant: "secondary",
  //         text: "4.7",
  //       },
  //     },
  //     {
  //       name: "Simple Line Icons",
  //       url: "/icons/simple-line-icons",
  //       icon: "icon-star",
  //     },
  //   ],
  // },
  // {
  //   name: "Notifications",
  //   url: "/notifications",
  //   icon: "icon-bell",
  //   children: [
  //     {
  //       name: "Alerts",
  //       url: "/notifications/alerts",
  //       icon: "icon-bell",
  //     },
  //     {
  //       name: "Badges",
  //       url: "/notifications/badges",
  //       icon: "icon-bell",
  //     },
  //     {
  //       name: "Modals",
  //       url: "/notifications/modals",
  //       icon: "icon-bell",
  //     },
  //   ],
  // },
  // {
  //   name: "Widgets",
  //   url: "/widgets",
  //   icon: "icon-calculator",
  //   badge: {
  //     variant: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   divider: true,
  // },
  // {
  //   title: true,
  //   name: "Extras",
  // },
  // {
  //   name: "Pages",
  //   url: "/pages",
  //   icon: "icon-star",
  //   children: [
  //     {
  //       name: "Login",
  //       url: "/login",
  //       icon: "icon-star",
  //     },
  //     {
  //       name: "Register",
  //       url: "/register",
  //       icon: "icon-star",
  //     },
  //     {
  //       name: "Error 404",
  //       url: "/404",
  //       icon: "icon-star",
  //     },
  //     {
  //       name: "Error 500",
  //       url: "/500",
  //       icon: "icon-star",
  //     },
  //   ],
  // },
  // {
  //   name: "Disabled",
  //   url: "/dashboard",
  //   icon: "icon-ban",
  //   badge: {
  //     variant: "secondary",
  //     text: "NEW",
  //   },
  //   attributes: { disabled: true },
  // },
  // {
  //   name: "Download CoreUI",
  //   url: "http://coreui.io/angular/",
  //   icon: "icon-cloud-download",
  //   class: "mt-auto",
  //   variant: "success",
  //   attributes: { target: "_blank", rel: "noopener" },
  // },
  // {
  //   name: "Try CoreUI PRO",
  //   url: "http://coreui.io/pro/angular/",
  //   icon: "icon-layers",
  //   variant: "danger",
  //   attributes: { target: "_blank", rel: "noopener" },
  // },
  {
    name: "Workflow Summary",
    url: "/workflow-summary"
  },
  {
    name: "Logout",
    url: "/logout",
  },
];
