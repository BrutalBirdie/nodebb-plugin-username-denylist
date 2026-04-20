'use strict';

const meta = require.main.require('./src/meta');
const winston = require.main.require('winston');

const PLUGIN_ID = 'username-denylist';
const ERROR_KEY = '[[username-denylist:error.username-not-allowed]]';

const plugin = {};

plugin.init = async function (params) {
	const { router, middleware } = params;
	const renderAdmin = (req, res) => {
		res.render('admin/plugins/username-denylist', { title: 'Username Denylist' });
	};

	router.get('/admin/plugins/username-denylist', middleware.admin.buildHeader, renderAdmin);
	router.get('/api/admin/plugins/username-denylist', renderAdmin);
};

plugin.addAdminNavigation = function (header) {
	header.plugins.push({
		route: '/plugins/username-denylist',
		icon: 'fa-ban',
		name: 'Username Denylist',
	});
	return header;
};

plugin.checkUsername = async function (data) {
	const username = data && data.userData && data.userData.username;
	await assertUsernameAllowed(username);
	return data;
};

plugin.checkUsernameOnUpdate = async function (data) {
	try {
		await assertUsernameAllowed(data && data.username);
	} catch (err) {
		data.error = err;
	}
	return data;
};

async function assertUsernameAllowed(username) {
	if (!username || typeof username !== 'string') {
		return;
	}

	const settings = await meta.settings.get(PLUGIN_ID);
	const literals = parseLines(settings && settings.literals);
	const patterns = parseLines(settings && settings.patterns);

	const lowered = username.toLowerCase();
	for (const entry of literals) {
		if (entry.toLowerCase() === lowered) {
			throw new Error(ERROR_KEY);
		}
	}

	for (const raw of patterns) {
		const regex = compileRegex(raw);
		if (!regex) {
			continue;
		}
		if (regex.test(username)) {
			throw new Error(ERROR_KEY);
		}
	}
}

function parseLines(value) {
	if (!value || typeof value !== 'string') {
		return [];
	}
	return value
		.split(/\r?\n/)
		.map(line => line.trim())
		.filter(Boolean);
}

function compileRegex(raw) {
	const slashMatch = raw.match(/^\/(.+)\/([gimsuy]*)$/);
	try {
		if (slashMatch) {
			return new RegExp(slashMatch[1], slashMatch[2]);
		}
		return new RegExp(raw);
	} catch (err) {
		winston.warn(`[plugin/username-denylist] Skipping invalid regex pattern "${raw}": ${err.message}`);
		return null;
	}
}

module.exports = plugin;
