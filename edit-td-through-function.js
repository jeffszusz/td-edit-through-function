// Widgit: edit <td> contents processed through a formula
// this widget is nowhere near complete, don't use it yet.

define(['jquery', 'jquery-ui'], function($) {

  $.widget("ui.editWithFormula", {
    options: {
      auto_save: false,
      save_button: false,
      omit: [],
      update_direction: 'left-to-right',
      formula: function (x) {
        return x;
      },
      first: {
        class: undefined,
        formula: undefined
      },
      last: {
        class: undefined,
        formula: undefined
      },
      save: function () {
        console.log('There is no save function set.');
      }
    },

    _update_cell: function(td, in_value){
      var prev = td.prev().data('td');
      var next = td.next().data('td');
      in_value = typeof in_value === NaN ? 0 : in_value;

      if (td.is(this.options.first.class)) {
        new_data = typeof in_value === 'undefined' ? 0 : this.options.first.formula(in_value, prev, next);
      } else if (td.is(this.options.last.class)) {
        new_data = typeof in_value === 'undefined' ? 0 : this.options.last.formula(in_value, prev, next);
      } else {
        new_data = typeof in_value === 'undefined' ? 0 : this.options.formula(in_value, prev, next);
      }

      td.data('td', this.i);
      td.data('td', new_data);
    },

    _update: function() {
      var tr = this.element;
      var tds = tr.children('td');
      if (this.options.update_direction === 'right-to-left') {
        tds = $(tds.get().reverse());
      }
      $.each(tds.not(this.options.omit.join(",")), $.proxy(function (i, el) {
        var td = $(el);
        this._update_cell(td, td.children('input').val());
      }, this));
    },

    _render: function() {
      var tr = this.element;
      var tds = tr.children('td');
      $.each(tds.not(this.options.omit.join(", ")), $.proxy(function (i, el) {
        var td = $(el);
        var span = td.children('span');
        span.text(td.data('td'));
      }, this));
    },

    _create: function () {
      var tr = this.element;
      var tds = tr.children('td');

      if (typeof this.options.first.formula === 'undefined') {
        this.options.first.formula = this.options.formula;
      }
      if (typeof this.options.last.formula === 'undefined') {
        this.options.first.formula = this.options.formula;
      }
      if (typeof this.options.first.class === 'undefined') {
        this.options.first.class = ':first-child';
      }
      if (typeof this.options.last.class === 'undefined') {
        this.options.last.class = ':last-child';
      }

      $.each(tds.not(this.options.omit.join(", ")), $.proxy(function (i, el) {
        var td = $(el);
        td.text('');
        td.addClass('td-' + i)
        .prepend('<span></span>')
        .prepend('<input type="text" value="' + td.data('td') + '" class="editbox" />');
      }, this));

      $('.editbox').css({
        'width': '65%',
        'margin-bottom': '5px',
        'padding': '3px'
      }).hide();

      $('.editbox').siblings('span').css({
        'width': '90%',
        'display': 'inline-block'
      });

      if (this.options.save_button) {
        tr.append('<td><button>Save</button></td>');
      }

      this._update();
      this._render();
    },

    _init: function () {
      var tr = this.element;
      var tds = tr.children('td');

      tr.on('click', 'td', function (e) {
        $('.editbox', e.delegateTarget).fadeIn();
        $('input', e.currentTarget).focus();
        e.stopPropagation();
      });

      tr.on('keyup', '.editbox', $.proxy(function (e) {
        var td = $(e.target).parent();
        var input = td.children('input');
        var in_value;

        if (e.which == 13 || e.which == 27) {
          $('.editbox').fadeOut();
        } else {
          this._update_cell(td, input.val());
          this._update();
          this._render();
        }
      }, this));

      $('html').on('click', function (e) {
        $('.editbox').fadeOut();
      });

      tr.on('click', 'button', $.proxy(function (e) {
        this.save();
        e.stopPropagation();
      }, this));
    },

    destroy: function () {
      $('.editbox').remove();
    }
  });
});
