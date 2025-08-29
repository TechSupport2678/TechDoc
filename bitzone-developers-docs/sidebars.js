// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
	docs: [
		'introduction',
		'access-and-configuration',
		'ssh-key-setup',
		'authorization',
		{
			type: 'category',
			label: 'API Integration',
			link: { type: 'doc', id: 'authentication' },
			items: [
				{ type: 'doc', id: 'account' },
				'account/db',
				'account/api',
				'account/get-account-info',
				'account/update-account-info',
				{ type: 'doc', id: 'pay-in' },
				'pay-in/api',
				'pay-in/cancel-trading-order-by-id',
				'pay-in/dispute-canceled',
				'pay-in/dispute-successfully-initiated-a-team-will-review-the-provided-information-and-work-toward-resolution',
				'pay-in/invoice-was-successfully-uploaded-youll-receive-invoice-reference-key',
				'pay-in/the-pay-in-order-was-successfully-created-youll-receive-all-relevant-details-about-the-trade-including-i-ds-amounts-and-status',
				{ type: 'doc', id: 'pay-out' },
				'pay-out/api',
				'pay-out/create-pay-out-order',
				{ type: 'doc', id: 'trading-flow' },
				'trading/api',
				'trading/get-trading-order-by-id',
				'trading/get-trading-order-by-merchant-order-id',
				'trading/get-trading-orders',
				'trading/returned-list-of-available-banks',
				'trading/returns-actual-currency-rates-for-pay-in-and-pay-out-deals',
				{ type: 'doc', id: 'webhook' }
			],
		},
		'payment-page',
	],
};

module.exports = sidebars;