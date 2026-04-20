'use strict';

/* globals $, app, define */

define('admin/plugins/username-denylist', ['settings'], function (Settings) {
	const ACP = {};

	ACP.init = function () {
		console.log('[username-denylist] ACP module loaded');

		Settings.load('username-denylist', $('.username-denylist-settings'));

		$('#save').off('click').on('click', function () {
			Settings.save('username-denylist', $('.username-denylist-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'username-denylist-saved',
					title: 'Username Denylist',
					message: 'Settings saved.',
					timeout: 2500,
				});
			});
		});
	};

	return ACP;
});
