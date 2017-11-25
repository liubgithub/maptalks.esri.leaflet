/*!
 * maptalks.esri.leaflet v0.0.1
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
/*!
 * requires maptalks@^0.35.1 
 */
import { DomUtil, Layer } from 'maptalks';
import { esri, map } from 'leaflet';
import 'esri-leaflet';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    'container': 'front',
    'renderer': 'dom',
    'hideOnZooming': false,
    'hideOnMoving': false,
    'hideOnRotating': false
};

var LeafletLayer = function (_maptalks$Layer) {
    _inherits(LeafletLayer, _maptalks$Layer);

    function LeafletLayer() {
        _classCallCheck(this, LeafletLayer);

        return _possibleConstructorReturn(this, _maptalks$Layer.apply(this, arguments));
    }

    return LeafletLayer;
}(Layer);

LeafletLayer.mergeOptions(options);

LeafletLayer.registerJSONType('LeafletLayer');

ArcGISLayer.registerRenderer('dom', function () {
    function _class(layer) {
        _classCallCheck(this, _class);

        this.layer = layer;
    }

    _class.prototype._show = function _show() {
        this._container.style.display = '';
    };

    _class.prototype._hide = function _hide() {
        this._container.style.display = 'none';
    };

    _class.prototype._resize = function _resize() {
        var container = this._container;
        if (!container) {
            return;
        }
        var size = this.getMap().getSize();
        container.style.width = size['width'] + 'px';
        container.style.height = size['height'] + 'px';
    };

    _class.prototype.getMap = function getMap() {
        return !this.layer ? null : this.layer.getMap();
    };

    _class.prototype.show = function show() {
        if (this._container) {
            this.render();
            this._show();
        }
    };

    _class.prototype.hide = function hide() {
        if (this._container) {
            this._hide();
            this.clear();
        }
    };

    _class.prototype.setZIndex = function setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    };

    _class.prototype.getEvents = function getEvents() {
        return {
            'resize': this.onResize
        };
    };

    _class.prototype.onResize = function onResize() {
        this._resize();
    };

    _class.prototype.remove = function remove() {
        delete this.layer;
        if (this.glmap) {
            this.glmap.remove();
        }
        if (this._container) {
            DomUtil.removeDomNode(this._container);
        }
        delete this._container;
        delete this.glmap;
    };

    _class.prototype._createLayerContainer = function _createLayerContainer() {
        var container = this._container = DomUtil.createEl('div', 'maptalks-leaflet');
        container.style.cssText = 'position:absolute;';
        this._resize();
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        var parent = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parent.appendChild(container);
    };

    _class.prototype.render = function render() {
        !this._container ? this._createLayerContainer() : null;
        if (!this.glmap) {
            var _map = this.getMap();
            var center = _map.getCenter();

            this.glmap = map(this._container).setView([center.x, center.y], _map.getZoom() - 1);

            esri.basemapLayer('Streets').addTo(this.map);
        }
    };

    return _class;
}());

export { LeafletLayer };

typeof console !== 'undefined' && console.log('maptalks.esri.leaflet v0.0.1, requires maptalks@^0.35.1.');
