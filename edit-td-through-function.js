// Widgit: edit <td> contents processed through a formula
// this widget is nowhere near complete, don't use it yet.

define(['jquery', 'jquery-ui'], function($) {

  $.widget("ui.tdEditThroughFunction", {
    options: {
      allow_strings: false,
      enforce_data: false,
      auto_save: false,
      save_button: false,
      omit: [],
      formula: function (x) {
        return x;
      },
      save: function () {
        console.log('There is no save function set.');
      }
    },

    _create: function () {
      var tr = this.element;
      var tds = tr.children('td');

      $.each(tds.not(this.options.omit.join(", ")), $.proxy(function (i, el) {
        var td = $(el);
        if (this.options.enforce_data) {
          td.text(this.options.formula(parseInt(td.data('td'), 10)));
        }
        var td_text = td.text();
        var data_td = td.data('td') ? td.data('td') : '';
        td.text('')
        .addClass('td-' + i)
        .prepend('<span>' + td_text + '</span>')
        .prepend('<input type="text" value="' + data_td + '" class="editbox" />');
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

      tr.on('click', 'td', function (e) {
        $('.editbox', e.delegateTarget).fadeIn();
        $('input', e.currentTarget).focus();
        e.stopPropagation();
      });

      $('html').on('click', function (e) {
        // store data and close
        tds.each(function (i) {
          var td = $(this);
          var input = td.children('input');
          td.data('td', input.val());
        });
        $('.editbox').fadeOut();
      });

      tr.on('keyup', '.editbox', $.proxy(function (e) {
        var td = $(e.target).parent();
        var span = td.children('span');
        var input = td.children('input');
        var prev = $('span', td.prev()).text();
        var next = $('span', td.next()).text();
        if (e.which == 27) { // escape to cancel
          input.val(td.data('td'));
          span.text(this.options.formula(td.data('td'), p, n));
          $('.editbox').fadeOut();
          return;
        } else if (e.which == 13) {
          // enter to store data and close
          td.data('td', input.val());
          $('.editbox').fadeOut();
          return;
        } else {
          var in_value = parseInt(input.val(), 10);
          var out_value = isNaN(in_value) ? 0 : this.options.formula(in_value);
          span.text(out_value);
          return;
        }

      }, this));

      tr.on('click', 'button', function (e) {
        save();
        e.stopPropagation();
      });
    },

    destroy: function () {
      $('.editbox').remove();
    },
  });
});
