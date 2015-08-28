window.Handlers = {
    click: {
        switchTabs: function (e) {
            e.preventDefault();
            $(this).tab('show');
        },
        requestTableData: function (e) {
            var $tab =$(this),
                templateId = $tab.attr('data-request-template-id'),
                url = $tab.attr('data-request-url'),
                aim = $tab.attr('data-append-from');
            $.ajax({
                url: url,
                success: function (data) {
                    data.forEach(function (d) {
                        d.data = encodeURI(JSON.stringify(d));
                    });
                    $('[data-append-to='+aim+']').html('');
                    $('#'+templateId).tmpl(data).appendTo('[data-append-to='+aim+']');
                    $('[data-toggle="confirmation"]').each(function () {
                        $c = $(this);
                        $c.confirmation({});
                    });
                }
            });

        },
        editField: function (e) {
            var $button = $(this),
                $field = $(this).parent().find('input, textarea');
            if ($button.hasClass('m-button-editable')) {
                $button.removeClass('m-button-editable').addClass('m-button-saveable');
                $field.attr('readonly', false).focus();
            } else {
                var fullData = JSON.parse(decodeURI($field.closest('tr').attr('data-parsed'))),
                    newValue;
                switch ($field.prop("tagName")) {
                    case 'INPUT':
                        newValue = $field.val();
                        break;
                    case 'TEXTAREA':
                        newValue = $field.val();
                        break;
                }
                fullData[$field.attr('data-field')] = newValue;
                $.ajax({
                    type: "POST",
                    url: $field.closest('table').attr('data-update-url').replace(':key', fullData[$field.closest('table').attr('data-update-key')]),
                    data:fullData,
                    success: function () {
                        $button.addClass('m-button-editable').removeClass('m-button-saveable');
                        $field.attr("readonly", true);
                    }
                });
            }
        },
        deleteNews: function(e) {
            e.preventDefault();
            $dbutton = $(this);
            $dbutton.confirmation('show');
            var newsId = -1;
            var parent = e.target;
            while(parent && parent.dataset['newsId'] === undefined) {
                parent = parent.parentNode;
            }
            newsId = parent.dataset['newsId'] | 0;
            $.ajax({
                url: '/news/111' + newsId,
                method: 'DELETE',
                success: function () {
                    parent.parentNode.removeChild(parent);
                }
            });
        },
        addNewEntry: function (e) {

        }
    },
    change: {
        refreshImage: function (e) {
            e.preventDefault();
            var $input = $(this),
                $target = $($input.attr('data-target-selector'));
            switch ($target.prop('tagName')) {
                case 'IMG':
                    $target.attr('src', $input.val());
            }
        }
    }
};
Object.keys(window.Handlers).forEach(function (bindFunctionEvent) {
    Object.keys(window.Handlers[bindFunctionEvent]).forEach(function (bindFunctionName) {
       $(document.body).on(bindFunctionEvent, '[data-bind-'+bindFunctionEvent+'*='+bindFunctionName+']', window.Handlers[bindFunctionEvent][bindFunctionName]);
    });
});
$('.nav.nav-tabs').children().eq(0).find('a').trigger('click');