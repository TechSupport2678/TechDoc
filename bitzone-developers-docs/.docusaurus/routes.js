import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/TechDoc/',
    component: ComponentCreator('/TechDoc/', 'ab5'),
    routes: [
      {
        path: '/TechDoc/',
        component: ComponentCreator('/TechDoc/', 'a80'),
        routes: [
          {
            path: '/TechDoc/tags',
            component: ComponentCreator('/TechDoc/tags', '6e8'),
            exact: true
          },
          {
            path: '/TechDoc/tags/api-integration',
            component: ComponentCreator('/TechDoc/tags/api-integration', '81d'),
            exact: true
          },
          {
            path: '/TechDoc/tags/configuration',
            component: ComponentCreator('/TechDoc/tags/configuration', '74e'),
            exact: true
          },
          {
            path: '/TechDoc/tags/introduction',
            component: ComponentCreator('/TechDoc/tags/introduction', '175'),
            exact: true
          },
          {
            path: '/TechDoc/tags/payment-page',
            component: ComponentCreator('/TechDoc/tags/payment-page', '5ea'),
            exact: true
          },
          {
            path: '/TechDoc/',
            component: ComponentCreator('/TechDoc/', 'a51'),
            routes: [
              {
                path: '/TechDoc/access-and-configuration',
                component: ComponentCreator('/TechDoc/access-and-configuration', 'a04'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/account',
                component: ComponentCreator('/TechDoc/account', '63e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/account/bitzone-api',
                component: ComponentCreator('/TechDoc/account/bitzone-api', 'a08'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/account/get-account-info',
                component: ComponentCreator('/TechDoc/account/get-account-info', '945'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/account/update-account-info',
                component: ComponentCreator('/TechDoc/account/update-account-info', '822'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/authentication',
                component: ComponentCreator('/TechDoc/authentication', '9bc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/introduction',
                component: ComponentCreator('/TechDoc/introduction', 'f53'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in',
                component: ComponentCreator('/TechDoc/pay-in', '825'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in/bitzone-api',
                component: ComponentCreator('/TechDoc/pay-in/bitzone-api', '4b8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in/cancel-trading-order-by-id',
                component: ComponentCreator('/TechDoc/pay-in/cancel-trading-order-by-id', '4a3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in/dispute-canceled',
                component: ComponentCreator('/TechDoc/pay-in/dispute-canceled', '380'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in/dispute-successfully-initiated-a-team-will-review-the-provided-information-and-work-toward-resolution',
                component: ComponentCreator('/TechDoc/pay-in/dispute-successfully-initiated-a-team-will-review-the-provided-information-and-work-toward-resolution', 'a7e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in/invoice-was-successfully-uploaded-youll-receive-invoice-reference-key',
                component: ComponentCreator('/TechDoc/pay-in/invoice-was-successfully-uploaded-youll-receive-invoice-reference-key', '5c5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-in/the-pay-in-order-was-successfully-created-youll-receive-all-relevant-details-about-the-trade-including-i-ds-amounts-and-status',
                component: ComponentCreator('/TechDoc/pay-in/the-pay-in-order-was-successfully-created-youll-receive-all-relevant-details-about-the-trade-including-i-ds-amounts-and-status', '801'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-out',
                component: ComponentCreator('/TechDoc/pay-out', 'c2d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-out/bitzone-api',
                component: ComponentCreator('/TechDoc/pay-out/bitzone-api', 'd52'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/pay-out/create-pay-out-order',
                component: ComponentCreator('/TechDoc/pay-out/create-pay-out-order', '285'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/payment-page',
                component: ComponentCreator('/TechDoc/payment-page', 'c14'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading-flow',
                component: ComponentCreator('/TechDoc/trading-flow', '2e2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading/bitzone-api',
                component: ComponentCreator('/TechDoc/trading/bitzone-api', '68e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading/get-trading-order-by-id',
                component: ComponentCreator('/TechDoc/trading/get-trading-order-by-id', '3e5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading/get-trading-order-by-merchant-order-id',
                component: ComponentCreator('/TechDoc/trading/get-trading-order-by-merchant-order-id', '8c6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading/get-trading-orders',
                component: ComponentCreator('/TechDoc/trading/get-trading-orders', '560'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading/returned-list-of-available-banks',
                component: ComponentCreator('/TechDoc/trading/returned-list-of-available-banks', 'bfb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/trading/returns-actual-currency-rates-for-pay-in-and-pay-out-deals',
                component: ComponentCreator('/TechDoc/trading/returns-actual-currency-rates-for-pay-in-and-pay-out-deals', 'cf7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/TechDoc/webhook',
                component: ComponentCreator('/TechDoc/webhook', '440'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
