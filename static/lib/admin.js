'use strict';

import { save, load } from 'settings';
import { alert } from 'alerts';

export function init() {
	console.log('[username-denylist] ACP module loaded');

	load('username-denylist', $('.username-denylist-settings'));

	$('#save').off('click').on('click', () => {
		save('username-denylist', $('.username-denylist-settings'), () => {
			alert({
				type: 'success',
				alert_id: 'username-denylist-saved',
				title: 'Username Denylist',
				message: 'Settings saved.',
				timeout: 2500,
			});
		});
	});
}
