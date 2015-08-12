'use strict';

var Location = function(initialPath, client, navigation) {

	this.m_currentPath = initialPath;
	this.m_navigation = navigation;
	this.m_listeners = [];

	var me = this;
	client.onEvent('navigation.statechange', function(path) {
		if(me.m_currentPath === path) {
			return;
		}
		me.m_currentPath = path;
		me.notifyChange('push');
	});

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
	this.m_navigation.push(path);
};
Location.prototype.replace = function(path) {
	this.m_navigation.replace(path);
};
Location.prototype.pop = function() {
	this.m_navigation.pop();
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

module.exports = Location;
