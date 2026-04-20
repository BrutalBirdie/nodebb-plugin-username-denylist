'use strict';

define('admin/plugins/username-denylist', ['settings', 'alerts'], function (Settings, alerts) {
	const ACP = {};

	ACP.init = function () {
		Settings.load('username-denylist', $('.username-denylist-settings'));

		$('#save').on('click', function () {
			Settings.save('username-denylist', $('.username-denylist-settings'), function () {
				alerts.alert({
					type: 'success',
					alert_id: 'username-denylist-saved',
					title: '[[username-denylist:title]]',
					message: '[[username-denylist:saved]]',
					timeout: 2500,
				});
			});
		});
	};

	return ACP;
});
