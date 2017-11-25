import * as maptalks from 'maptalks';
import * as L from 'leaflet';
import * as E from 'esri-leaflet';


const options = {
    'container': 'front',
    'renderer': 'dom',
    'hideOnZooming': false,
    'hideOnMoving': false,
    'hideOnRotating': false
};

export class LeafletLayer extends maptalks.Layer{

}

LeafletLayer.mergeOptions(options);

LeafletLayer.registerJSONType('LeafletLayer');

ArcGISLayer.registerRenderer('dom',class{

    constructor(layer) {
        this.layer = layer;
    }

    _show() {
        this._container.style.display = '';
    }

    _hide() {
        this._container.style.display = 'none';
    }

    _resize() {
        const container = this._container;
        if (!container) {
            return;
        }
        const size = this.getMap().getSize();
        container.style.width = size['width'] + 'px';
        container.style.height = size['height'] + 'px';
        // if (this.glmap) {
        //     this.glmap.resize();
        // }
    }

    getMap() {
        return !this.layer ? null : this.layer.getMap();
    }

    show() {
        if (this._container) {
            this.render();
            this._show()
        }
    }

    hide() {
        if (this._container) {
            this._hide();
            this.clear();
        }
    }

    setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    }

    getEvents() {
        return {
            'resize' : this.onResize
        };
    }

    onResize() {
        this._resize();
    }

    remove() {
        delete this.layer;
        if (this.glmap) {
            this.glmap.remove();
        }
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._container;
        delete this.glmap;
    }

    _createLayerContainer() {
        const container = this._container = maptalks.DomUtil.createEl('div', 'maptalks-leaflet');
        container.style.cssText = 'position:absolute;';
        this._resize();
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        const parent = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parent.appendChild(container);
    }

    render() {
        !this._container ? this._createLayerContainer() : null;
        if (!this.glmap) {
            var _map = this.getMap();
            var center = _map.getCenter();
            //创建leaflet map
            this.glmap = L.map(this._container).setView([center.x, center.y], _map.getZoom() - 1)
            //添加图层
            L.esri.basemapLayer('Streets').addTo(this.map);
        }
    }

})