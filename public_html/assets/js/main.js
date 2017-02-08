$('#openMap').on('click', function () {
    function OpenNewWindow(elem) {
        this.elem = elem;
        console.log(this.elem.attr("id"))
        this.elem.css({
            'width': '800px',
            'height': '500px',
            'position': 'absolute',
            'backgroundColor': 'white'
        });
        this.figures = [];
        this.map = this.elem.find('.map')
                .css({
                    'width': '100%',
                    'height': '400px'
                })
                .mappolydr({
                    'id': this.elem.attr("id"),
                    'coords': this.elem.find('.coords'),
                    'figures': this.figures
                });
    }

    var modal = document.createElement('div');
    document.body.appendChild(modal);

    var currentId = str_rand();
    modal.id = currentId;

    var close = document.createElement('div');
    close.setAttribute('onclick', 'remove(this.parentNode);');
    close.classList.add('closeWindow');
    modal.appendChild(close);

    var txt = document.createTextNode('Закрыть');
    close.appendChild(txt);


    var hide = document.createElement('div');
    hide.setAttribute('onclick', 'hide(this);');
    hide.classList.add('getHideWindow');
    modal.appendChild(hide);

    var txt = document.createTextNode('Свернуть');
    hide.appendChild(txt);


    var map = document.createElement('div');
    map.classList.add('map');
    modal.appendChild(map);

    var coords = document.createElement('textarea');
    coords.setAttribute('placeholder', 'Введите данные для импорта');
    coords.setAttribute('rows', '5');
    coords.classList.add('coords');
    modal.appendChild(coords);

    var txtCoords = document.createTextNode('');
    coords.appendChild(txtCoords);


    var curEl = $('#' + currentId);
    console.log(curEl);
    var newWindow = new OpenNewWindow(curEl);
});

function remove(el) {
    el.parentNode.removeChild(el);
}

function hide(el) {
    var hideEl = document.createElement('div');
    hideEl.classList.add('hidden')
    var txtHide = document.createTextNode('Окно ' + el.parentNode.id);
    var hiddenModal = el.parentNode;

    document.body.appendChild(hideEl);
    hideEl.appendChild(txtHide);
    el.parentNode.style.display = 'none';
    hideEl.addEventListener("click", function () {
        hiddenModal.style.display = 'block';
        document.body.removeChild(hideEl);
    });
}

function str_rand() {
    var result = '';
    var words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    var max_position = words.length - 1;
    for (var i = 0; i < 5; ++i) {
        var position = Math.floor(Math.random() * max_position);
        result = result + words.substring(position, position + 1);
    }
    return result;
}


