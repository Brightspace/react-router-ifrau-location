'use strict';

var Location = function(client) {

	this.m_client = client;
	this.m_currentPath = '';
	this.m_listeners = [];

	var me = this;

	function handlePathChange(path) {
		if(me.m_currentPath === path) {
			return;
		}
		me.m_currentPath = path;
		me.notifyChange('push');
	}

	this.callNavigation(function(navigation) {
		navigation.get().then(handlePathChange);
	});
	this.m_client.onEvent('navigation.statechange', handlePathChange);

};
Location.prototype.addChangeListener = function(listener) {
	this.m_listeners.push(listener);
};
Location.prototype.removeChangeListener = function(listener) {
	this.m_listeners = this.m_listeners.filter(function(l) {
		return l !== listener;
	});
};
Location.prototype.push = function(path) {
	this.callNavigation(function(navigation) {
		navigation.push(path);
	});
};
Location.prototype.replace = function(path) {
	this.callNavigation(function(navigation) {
		navigation.replace(path);
	});
};
Location.prototype.pop = function() {
	this.callNavigation(function(navigation) {
		navigation.pop();
	});
};
Location.prototype.getCurrentPath = function() {
	return this.m_currentPath;
};
Location.prototype.notifyChange = function(type) {
	var me = this;
	var change = {
		path: this.m_currentPath,
		type: type
	};
	this.m_listeners.forEach(function(listener) {
		listener.call(me, change);
	});
};
Location.prototype.callNavigation = function(func) {
	var me = this;
	this.m_client.getService('navigation', '0.1').then(function(navigation) {
		func.call(me, navigation);
	});
};

module.exports = Location;
