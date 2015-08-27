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
                    $('[data-append-to='+aim+']').html('');
                    $('#'+templateId).tmpl(data).appendTo('[data-append-to='+aim+']');
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
                $button.addClass('m-button-editable').removeClass('m-button-saveable');
                $field.attr('readonly', true)
            }
        },
        deleteNews: function(e)
        {
            e.preventDefault();

            var newsId = -1;
            var parent = e.target;
            while(parent && parent.dataset['newsId'] === undefined)
            {
                parent = parent.parentNode;
            }
            newsId = parent.dataset['newsId'] | 0;
            $.ajax({
                url: '/news/' + newsId,
                method: 'DELETE',
                success: function () {
                    parent.parentNode.removeChild(parent);
                }
            });
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