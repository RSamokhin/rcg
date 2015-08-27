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
            } else {
                $button.addClass('m-button-editable').removeClass('m-button-saveable');
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