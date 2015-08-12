var chai = require('chai'),
	expect = chai.expect,
	Location = require('../'),
	sinon = require('sinon');

chai.should();
chai.use(require('sinon-chai'));

function MockClient() {}
MockClient.prototype.onEvent = function() {};

function MockNavigation() {}
MockNavigation.prototype.push = function() {};
MockNavigation.prototype.replace = function() {};
MockNavigation.prototype.pop = function() {};

var initialPath = '/d2l/initial/path/';

describe('location', function() {

	var location, client, onEvent, navigation, push, replace, pop;

	beforeEach(function() {
		client = new MockClient();
		onEvent = sinon.stub(client, 'onEvent');
		navigation = new MockNavigation();
		push = sinon.stub(navigation, 'push');
		replace = sinon.stub(navigation, 'replace');
		pop = sinon.stub(navigation, 'pop');
		location = new Location(
			initialPath,
			client,
			navigation
		);
	});

	afterEach(function() {
		onEvent.restore();
		push.restore();
		replace.restore();
		pop.restore();
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
			onEvent.args[0][1](initialPath);
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

		it('should return initial path initially', function() {
			var path = location.getCurrentPath();
			expect(path).to.equal(initialPath);
		});

	});

	describe('push, pop, replace', function() {

		it('should proxy push to navigation', function() {
			var path = 'push-path';
			location.push(path);
			push.should.have.been.calledWith(path);
		});

		it('should proxy pop to navigation', function() {
			location.pop();
			pop.should.have.been.calledOnce;
		});

		it('should proxy replace to navigation', function() {
			var path = 'replace-path';
			location.replace(path);
			replace.should.have.been.calledWith(path);
		});

	});

});
