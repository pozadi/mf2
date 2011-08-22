/*global window $ Backbone _ _t Vault Vaults Payment Payments T2ps*/

$(function(){
	"use strict";

	window.Vault = Backbone.Model.extend({
		
		defaults: {
			name: ''
		},
		
		initialize: function() {
		},
		
		validate: function(attrs) {
		    if (typeof attrs.name !== 'undefined' && !_.isString(attrs.name)) {
				return "'name' must be an String";
			}
			// todo
		}
	});
	
	Vault.Collection = Backbone.Collection.extend({
		model: Vault,
		url: '/vault',
		
		initialize: function() {
		}
	});
	
	Vault.views = {};
	
	Vault.views.InList = Backbone.View.extend({
		
		tagName: "li",
		className: "vault",
		tmpl: _t('vault.in-list'),
		
		events: {
			'click .text': 'onClickText',
			'click .edit': 'onClickEdit',
			'click .delete': 'onClickDelete'
		},
		
		initialize: function (args) {
			_.bindAll(this, 'changeName');
			
			this.model.bind('destroy', _.bind(function(){ $(this.el).remove(); }, this));
			this.model.bind('change:name', this.changeName);
		},
		
		onClickEdit: function() {
			this.trigger('edit_clicked', this.model);
		},
		
		onClickDelete: function() {
			this.model.destroy();
		},
		
		onClickText: function() {
			// todo
		},
		
		changeName: function() {
			this.$('.name').text(this.model.get('name'));
		},
		
		render: function() {
			var data = this.model.toJSON();
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
	
	
	Vault.views.Form = Backbone.View.extend({
		
		tagName: "form",
		className: "vault",
		tmpl: _t('vault.form'),
		
		events: {
			'submit'       : 'onSubmit',
			'click .cancel': 'onClickCancel'
		},
		
		initialize: function () {
			var remove = _.bind(function(){ $(this.el).remove(); }, this);
			this.model.bind('destroy', remove);
			this.bind('close', remove);
		},
		
		onSubmit: function() {
			
			this.model.set({
				'name': this.$('.name').val()
			});
			
			this.model.save();
			this.trigger('close');
			return false; // prevent submit
		},
		
		onClickCancel: function() {
			if(this.model.isNew()) {
				this.model.destroy();
			}
			this.trigger('close');
		},
		
		render: function() {
			var data = this.model.toJSON();
			data.cid = this.model.cid; // need cid for labels in form
			$(this.el).html(this.tmpl(data));
			return this;
		}
	});
});