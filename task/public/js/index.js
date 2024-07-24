// 主畫面切換語言
$(document).ready(function() {
    $('#lang .dropdown-item').click(function(e) {
        e.preventDefault();
        var selectedLanguage = $(this).text();
        $('#lang-show').text(selectedLanguage);
    });
});