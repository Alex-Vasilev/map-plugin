;
(function ($) {
    var MapPolyDr = {
        init: function (options, elem) {
            this.options = $.extend({}, this.options, options);
            this.elem = elem;
            this.$elem = $(elem);
            this.build();
            return this;
        },

        options: {
            "zoom": 15,
            "figureCoords": [],
            "markers": [],
            "figureSelected": {},
            "disableDefaultUI": true,
            "backgroundColor": "#fff",
            "borderButton": "2px solid #fff",
            "color": "rgb(25,25,25)"
        },

        build: function () {
            var o = this.options;
            $(this.elem).width(o.width).height(o.height);

            var self = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    self.latitude = +position.coords.latitude;
                    self.longitude = +position.coords.longitude;
                    self.setupMap(self.latitude, self.longitude);
                });
            } else {
                alert("Geolocation API не поддерживается в вашем браузере");
            }
        },

        setupMap: function (lat, lng) {

            var o = this.options;
            var newMap = this.elem;
            this.latitude = lat;
            this.longitude = lng;

            var myLatlng = {
                lat: this.latitude,
                lng: this.longitude
            };

            var mapOptions = {
                zoom: o.zoom,
                center: myLatlng,
                disableDefaultUI: o.disableDefaultUI
            };

            var map = new google.maps.Map(newMap, mapOptions);
            this.placeMainMarker(myLatlng, map);
            this.createPanel(map);
        },

        placeMainMarker: function (myLatlng, map) {
            this.myLatlng = myLatlng;
            var myMarker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: this.myLatlng,
                map: map
            });
        },

        createPanel: function (map) {
            var o = this.options;

            var panelControlDiv = document.createElement('div');
            var panelControl = new PanelControl(panelControlDiv, map);

            panelControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(panelControlDiv);

            function PanelControl(panelControlDiv, map) {
                panelControlDiv.style.clear = 'both';

                var addUI = document.createElement('button');
                addUI.style.backgroundColor = o.backgroundColor;
                addUI.style.border = o.borderButton;
                addUI.id = 'add';

                addUI.style.width = '100px';
                addUI.style.height = '30px';
                addUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                addUI.style.cursor = 'pointer';
                addUI.style.textAlign = 'center';
                addUI.style.outline = 'none';
                addUI.title = 'Click to add marker or construct polygon';
                panelControlDiv.appendChild(addUI);

                var addText = document.createElement('div');
                addText.style.color = o.color;
                addText.style.fontFamily = 'Roboto,Arial,sans-serif';
                addText.style.fontSize = '14px';
                addText.style.lineHeight = '26px';
                addText.innerHTML = 'Добавить';
                addUI.appendChild(addText);

                var deleteUI = document.createElement('button');
                deleteUI.style.backgroundColor = o.backgroundColor;
                deleteUI.style.border = o.borderButton;
                deleteUI.style.width = '100px';
                deleteUI.style.height = '30px';
                deleteUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                deleteUI.style.cursor = 'pointer';
                deleteUI.style.textAlign = 'center';
                deleteUI.title = 'Click to delete polygon';
                deleteUI.style.outline = 'none';

                panelControlDiv.appendChild(deleteUI);

                var deleteText = document.createElement('div');
                deleteText.style.color = o.color;
                deleteText.style.fontFamily = 'Roboto,Arial,sans-serif';
                deleteText.style.fontSize = '14px';
                deleteText.style.lineHeight = '26px';
                deleteText.innerHTML = 'Удалить';
                deleteUI.appendChild(deleteText);

                var deleteAllUI = document.createElement('button');
                deleteAllUI.style.backgroundColor = o.backgroundColor;
                deleteAllUI.style.border = o.borderButton;
                deleteAllUI.id = 'deleteall';
                deleteAllUI.style.width = '100px';
                deleteAllUI.style.height = '30px';
                deleteAllUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                deleteAllUI.style.cursor = 'pointer';
                deleteAllUI.style.textAlign = 'center';
                deleteAllUI.title = 'Click to delete all';
                deleteAllUI.style.outline = 'none';

                panelControlDiv.appendChild(deleteAllUI);

                var deleteAllText = document.createElement('div');
                deleteAllText.style.color = o.color;
                deleteAllText.style.fontFamily = 'Roboto,Arial,sans-serif';
                deleteAllText.style.fontSize = '14px';
                deleteAllText.style.lineHeight = '26px';
                deleteAllText.innerHTML = 'Удалить все';
                deleteAllUI.appendChild(deleteAllText);

                var importUI = document.createElement('button');
                importUI.classList.add('adad');
                importUI.style.backgroundColor = o.backgroundColor;
                importUI.style.border = o.borderButton;
                importUI.style.width = '100px';
                importUI.style.height = '30px';
                importUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                importUI.style.cursor = 'pointer';
                importUI.style.textAlign = 'center';
                importUI.title = 'Import';
                importUI.style.outline = 'none';

                panelControlDiv.appendChild(importUI);

                var importText = document.createElement('div');
                importText.style.color = o.color;
                importText.style.fontFamily = 'Roboto,Arial,sans-serif';
                importText.style.fontSize = '14px';
                importText.style.lineHeight = '26px';
                importText.innerHTML = 'Импорт';
                importUI.appendChild(importText);

                var exportUI = document.createElement('button');
                exportUI.style.backgroundColor = o.backgroundColor;
                exportUI.style.border = o.borderButton;
                exportUI.style.width = '100px';
                exportUI.style.height = '30px';
                exportUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                exportUI.style.cursor = 'pointer';
                exportUI.style.outline = 'none';

                exportUI.style.textAlign = 'center';
                exportUI.title = 'Export';
                panelControlDiv.appendChild(exportUI);

                var exportText = document.createElement('div');
                exportText.style.color = o.color;
                exportText.style.fontFamily = 'Roboto,Arial,sans-serif';
                exportText.style.fontSize = '14px';
                exportText.style.lineHeight = '26px';
                exportText.innerHTML = 'Экспорт';
                exportUI.appendChild(exportText);
            }

            var self = this;
            this.add = panelControlDiv.firstChild;
            this.add.addEventListener("click", function () {
                self.add.setAttribute('disabled', true);
                self.addPol(map);
            });

            this.delete = panelControlDiv.children[1];
            this.delete.addEventListener("click", function () {
                self.deleteFigureSelected(map);
            });

            this.deleteall = panelControlDiv.children[2];
            this.deleteall.addEventListener("click", function () {
                self.deleteFigures(map);
            });

            this.importUI = panelControlDiv.children[3];
            this.importUI.addEventListener("click", function () {
                self.importPolygonCoords(map);
            });

            this.exportUI = panelControlDiv.children[4];
            this.exportUI.addEventListener("click", function (e) {
                self.exportPolygonCoords();
            });
        },

        addPol: function (map) {
            var o = this.options;
            var self = this;
            var isClosed = false;

            this.poly = new google.maps.Polyline({
                map: map,
                path: [],
                strokeColor: "#FF0000",
                strokeOpacity: 0.2,
                strokeWeight: 2
            });

            google.maps.event.addListener(map, 'click', function (clickEvent) {
                if (isClosed)
                    return;

                var markerIndex = self.poly.getPath().length;
                var isFirstMarker = markerIndex === 0;
                var marker = new google.maps.Marker({
                    map: map,
                    position: clickEvent.latLng
                });
                o.markers.push(marker);

                if (isFirstMarker) {
                    google.maps.event.addListener(marker, 'click', function () {
                        if (isClosed)
                            return;
                        var vertices = self.poly.getPath(),
                                result,
                                xy;

                        if (vertices.getLength() > 1) {
                            result = [];
                            for (var i = 0; i < vertices.getLength(); i++) {
                                xy = vertices.getAt(i);
                                result.push({lat: xy.lat(), lng: xy.lng()});
                            }
                        } else {
                            xy = vertices.getAt(0);
                            result = {lat: xy.lat(), lng: xy.lng()};
                        }

                        if (result.length < 3) return;

                        o.figureCoords = self.graham(result);
                        self.poly.setMap(null);
                        self.constructPolygon(map);
                        isClosed = true;
                        self.poly.setMap(map);
                        o.figures.push(self.poly);
                        self.deleteMarkers(map);
                        self.add.removeAttribute("disabled");
                    });
                }
                self.poly.getPath().push(clickEvent.latLng);
            });
        },

        graham: function (points) {
            function classify(vector, x1, y1) {
                return (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
            }

            var ch = [],
                    minI = 0,
                    min = points[0].lat,
                    temp,
                    h = [],
                    result = [];

            for (var i = 0; i < points.length; i++) {
                ch.push(i);
                if (points[i].lat < min) {
                    min = points[i].lat;
                    minI = i;
                }
            }

            ch[0] = minI;
            ch[minI] = 0;

            for (var i = 1; i < ch.length - 1; i++) {
                for (var j = i + 1; j < ch.length; j++) {
                    var cl = classify({
                        'x1': points[ch[0]].lat,
                        'y1': points[ch[0]].lng,
                        'x2': points[ch[i]].lat,
                        'y2': points[ch[i]].lng
                    }, points[ch[j]].lat, points[ch[j]].lng);

                    if (cl < 0) {
                        temp = ch[i];
                        ch[i] = ch[j];
                        ch[j] = temp;
                    }
                }
            }

            h = [];
            h[0] = ch[0];
            h[1] = ch[1];

            for (var i = 2; i < ch.length; i++) {
                while (classify({
                    'x1': points[h[h.length - 2]].lat,
                    'y1': points[h[h.length - 2]].lng,
                    'x2': points[h[h.length - 1]].lat,
                    'y2': points[h[h.length - 1]].lng
                }, points[ch[i]].lat, points[ch[i]].lng) < 0) {
                    h.pop();
                }
                h.push(ch[i]);
            }

            for (var i = 0; i < h.length; i++) {
                result.push(points[h[i]]);
            }

            return result;
        },

        constructPolygon: function (map) {
            var o = this.options;
            this.poly = new google.maps.Polygon({
                paths: o.figureCoords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.3,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.1,
                draggable: true
            });

            this.poly.addListener('click', selectFigure);

            function selectFigure(event) {
                if (o.figureSelected === this) {
                    o.figureSelected = {};
                    this.setOptions({fillOpacity: 0.1,
                        strokeOpacity: 0.3});
                } else {
                    !(Object.keys(o.figureSelected).length === 0) && o.figureSelected.setOptions({fillOpacity: 0.1,
                        strokeOpacity: 0.3});
                    o.figureSelected = this;
                    this.setOptions({fillOpacity: 0.3,
                        strokeOpacity: 0.5});
                }
            }
        },

        deleteFigures: function (map) {
            var o = this.options;
            clearFigures();
            o.figures = [];

            function setMapOnAllFigure(map) {
                for (var i = 0; i < o.figures.length; i++) {
                    o.figures[i].setMap(map);
                }
            }

            function clearFigures() {
                setMapOnAllFigure(null);
            }
        },

        deleteFigureSelected: function (map) {
            var o = this.options;
            var val;

            for (var i = 0; i < o.figures.length; i++) {
                for (var keys in o.figures[i]) {
                    if (o.figures[i].capturing === false)
                        val = i;
                }
            }

            o.figures.splice(val, 1);
            clearFigureSelected();
            o.figureSelected = {};

            function setMapOnAllFigureSelected(map) {
                !(Object.keys(o.figureSelected).length === 0) && o.figureSelected.setMap(map);
            }

            function clearFigureSelected() {
                setMapOnAllFigureSelected(null);
            }
        },

        deleteMarkers: function (map) {
            var o = this.options;
            clearMarkers();
            o.markers = [];

            function setMapOnAll(map) {
                for (var i = 0; i < o.markers.length; i++) {
                    o.markers[i].setMap(map);
                }
            }

            function clearMarkers() {
                setMapOnAll(null);
            }
        },

        exportPolygonCoords: function () {
            var o = this.options;
            var arrPolygons = [];


            for (var i = 0; i < o.figures.length; i++) {
                var len = o.figures[i].getPath().getLength();
                var arr = [];
                for (var j = 0; j < len; j++) {
                    var htmlCoordsLng = o.figures[i].getPath().getAt(j).lng();
                    var htmlCoordsLat = o.figures[i].getPath().getAt(j).lat();
                    var htmlCoords = {lat: htmlCoordsLat, lng: htmlCoordsLng};
                    arr.push(htmlCoords);
                }
                arrPolygons.push(arr);
            }
            var txt = JSON.stringify(arrPolygons);
            o.coords.val(txt);
        },

        importPolygonCoords: function (map) {
            var o = this.options;
            var str = o.coords.val();

            if (str) {
                str = JSON.parse(str);
                var self = this;
                str.forEach(function (item) {
                    o.figureCoords = item;
                    self.constructPolygon();
                    self.poly.setMap(map);
                    o.figures.push(self.poly);
                });
            }
        }
    };

    $.fn.mappolydr = function (options) {
        if (this.length) {
            return this.each(function () {
                var md = Object.create(MapPolyDr);
                md.init(options, this);
                $.data(this, 'mappolydr', md);
            });
        }
    };
})(jQuery);