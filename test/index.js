var chai = require('chai'),
	expect = chai.expect,
	Location = require('../'),
	sinon = require('sinon');

chai.should();
chai.use(require('sinon-chai'));

function MockClient() {}
MockClient.prototype.getService = function() {};
MockClient.prototype.onEvent = function() {};

function MockNavigation() {}
MockNavigation.prototype.push = function() {};
MockNavigation.prototype.replace = function() {};
MockNavigation.prototype.pop = function() {};
MockNavigation.prototype.get = function() {};

describe('location', function() {

	var location, client, onEvent, push, replace, pop, callNavigation, navigation;

	beforeEach(function() {

		clock = sinon.useFakeTimers();

		navigation = new MockNavigation();
		push = sinon.stub(navigation, 'push');
		replace = sinon.stub(navigation, 'replace');
		pop = sinon.stub(navigation, 'pop');

		client = new MockClient();
		onEvent = sinon.stub(client, 'onEvent');
		sinon.stub(client, 'getService').returns(
			new Promise(function(resolve) { resolve(navigation); })
		);

		location = new Location(client);
		callNavigation = sinon.stub(location, 'callNavigation');

	});

	afterEach(function() {
		onEvent.restore();
		push.restore();
		replace.restore();
		pop.restore();
		callNavigation.restore();
		clock.restore();
	});

	describe('change listeners', function() {

		it('should add listener', function() {
			var listener = sinon.spy();
			location.addChangeListener(listener);
			expect(location.m_listeners.length).to.equal(1);
		});

		it('should remove listener', function() {
			var listener = sinon.spy();
			location.addChangeListener(listener);
			location.removeChangeListener(listener);
			expect(location.m_listeners.length).to.equal(0);
		});

		it('should notify listeners of changes', function() {
			var listener = sinon.spy();
			var changeType = 'foo';
			var newPath = 'bar';
			location.m_currentPath = newPath;
			location.addChangeListener(listener);
			location.notifyChange(changeType);
			listener.should.have.been.calledWith({
				path: newPath,
				type: changeType
			});
		});

	});

	describe('state change', function() {

		var notifyChange;

		beforeEach(function() {
			notifyChange = sinon.stub(location, 'notifyChange');
		});

		afterEach(function() {
			notifyChange.restore();
		});

		it('should not trigger change with same path', function() {
			var newPath = '/current/path/';
			location.m_currentPath = newPath;
			onEvent.args[0][1](newPath);
			notifyChange.should.not.have.been.called;
		});

		it('should update path', function() {
			var newPath = '/new/path/';
			onEvent.args[0][1](newPath);
			expect(location.getCurrentPath()).to.equal(newPath);
		});

		it('should notify listeners via push', function() {
			onEvent.args[0][1]('/new/path/');
			notifyChange.should.have.been.calledWith('push');
		});

	});

	describe('getCurrentPath', function() {

		it('should return empty string initially', function() {
			var path = location.getCurrentPath();
			expect(path).to.equal('');
		});

	});

	describe('push, pop, replace', function() {

		it('should proxy push to navigation', function() {
			var path = 'push-path';
			location.push(path);
			callNavigation.args[0][0](navigation);
			push.should.have.been.calledWith(path);
		});

		it('should proxy pop to navigation', function() {
			location.pop();
			callNavigation.args[0][0](navigation);
			pop.should.have.been.calledOnce;
		});

		it('should proxy replace to navigation', function() {
			var path = 'replace-path';
			location.replace(path);
			callNavigation.args[0][0](navigation);
			replace.should.have.been.calledWith(path);
		});

	});

});
