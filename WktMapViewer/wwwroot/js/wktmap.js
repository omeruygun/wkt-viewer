/**
 * Online WKT Viewer - OpenLayers Map Application
 */

// ========================================
// Global State
// ========================================
let map;
let geometries = [];
let currentDrawType = null;
let drawInteraction = null;
let selectedGeometryId = null;
let geometryIdCounter = 0;
let styles = {};
let baseLayers = {};
let currentBasemap = 'osm';

// ========================================
// Projection Definitions
// ========================================
const projections = {
    'EPSG:4326': '+proj=longlat +datum=WGS84 +no_defs',
    'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs',
    'EPSG:2154': '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    'EPSG:32632': '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
    'EPSG:28350': '+proj=utm +zone=50 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    'SR-ORG:7839': '+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
    'SR-ORG:7838': '+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
    'SR-ORG:7837': '+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
    'SR-ORG:7836': '+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
    'SR-ORG:7833': '+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
    'SR-ORG:7835': '+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
};

const projectionNames = {
    'EPSG:4326': 'WGS 84',
    'EPSG:3857': 'Web Mercator',
    'SR-ORG:7839': 'TM 42',
    'SR-ORG:7838': 'TM 39',
    'SR-ORG:7837': 'TM 36',
    'SR-ORG:7836': 'TM 33',
    'SR-ORG:7833': 'TM 30',
    'SR-ORG:7835': 'TM 27',
    'EPSG:2154': 'Lambert 93',
    'EPSG:32632': 'UTM Zone 32N'
};

// Register projections with proj4
for (let epsg in projections) {
    proj4.defs(epsg, projections[epsg]);
}

// Register proj4 with OpenLayers if available
if (typeof ol.proj.proj4 !== 'undefined' && ol.proj.proj4.register) {
    ol.proj.proj4.register(proj4);
}

// ========================================
// Initialization
// ========================================
function initMap() {
    // Define base layers
    baseLayers = {
        osm: new ol.layer.Tile({
            source: new ol.source.OSM(),
            visible: true
        }),
        satellite: new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://mts0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                maxZoom: 20
            }),
            visible: false
        }),
        hybrid: new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://mts0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                maxZoom: 20
            }),
            visible: false
        })
    };

    map = new ol.Map({
        target: 'map',
        layers: [
            baseLayers.osm,
            baseLayers.satellite,
            baseLayers.hybrid
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([35, 39]),
            zoom: 6
        }),
        controls: ol.control.defaults({
            attribution: false
        })
    });

    // Update zoom level display
    function updateZoomLevel() {
        const zoomLevel = map.getView().getZoom();
        document.getElementById('zoomValue').textContent = Math.round(zoomLevel * 10) / 10;
    }

    updateZoomLevel();
    map.getView().on('change:resolution', updateZoomLevel);
    map.getView().on('change:center', updateZoomLevel);

    // Feature click handler
    map.on('click', function(event) {
        if (currentDrawType !== null) return;
        
        map.forEachFeatureAtPixel(event.pixel, function(feature) {
            const id = feature.get('id');
            if (id) selectGeometry(id);
        });
    });
}

// Initialize on load
window.addEventListener('load', initMap);

// ========================================
// Drawing Functions
// ========================================
let dblClickZoomInteraction = null;

function startDrawing(type) {
    if (drawInteraction) {
        map.removeInteraction(drawInteraction);
    }

    // Remove double-click zoom interaction completely during drawing
    map.getInteractions().forEach(function(interaction) {
        if (interaction instanceof ol.interaction.DoubleClickZoom) {
            dblClickZoomInteraction = interaction;
            map.removeInteraction(interaction);
        }
    });

    currentDrawType = type;
    drawInteraction = new ol.interaction.Draw({
        source: new ol.source.Vector(),
        type: type
    });

    drawInteraction.on('drawend', function(event) {
        const feature = event.feature;
        const id = generateId();
        const typeName = getGeometryTypeName(type);
        const name = `${typeName} #${id}`;
        
        const geometry = {
            id: id,
            name: name,
            type: type,
            feature: feature,
            sourceProjection: 'EPSG:3857'
        };

        feature.set('id', id);
        feature.set('name', name);
        geometries.push(geometry);
        addGeometryToMap(feature, id);
        refreshGeometryList();
        stopDrawing();
        
        showStatus(`${typeName} ${t('status.geometryAdded')}`);
        
        // Auto open style modal
        setTimeout(() => openStyleModal(id), 300);
    });

    map.addInteraction(drawInteraction);
    showStatus(`${getGeometryTypeName(type)} ${t('status.drawingActive')}`);
}

function stopDrawing() {
    if (drawInteraction) {
        map.removeInteraction(drawInteraction);
        drawInteraction = null;
        currentDrawType = null;
    }
    
    // Re-add double-click zoom interaction after a delay
    // This prevents the zoom from triggering on draw finish
    setTimeout(() => {
        if (dblClickZoomInteraction) {
            map.addInteraction(dblClickZoomInteraction);
        }
    }, 350);
}

function getGeometryTypeName(type) {
    return t('geomType.' + type) || type;
}

// ========================================
// WKT Functions
// ========================================
function addWKTGeometry() {
    const wkt = document.getElementById('wktInput').value.trim();
    const sourceProj = document.getElementById('sourceProjection').value;
    const name = document.getElementById('geometryName').value || `Geometri #${geometryIdCounter + 1}`;

    if (!wkt) {
        showStatus(t('status.enterWkt'), 'error');
        return;
    }

    try {
        const format = new ol.format.WKT();
        const feature = format.readFeature(wkt, {
            dataProjection: sourceProj,
            featureProjection: 'EPSG:3857'
        });

        const id = generateId();
        feature.set('id', id);
        feature.set('name', name);
        
        const geometry = {
            id: id,
            name: name,
            type: feature.getGeometry().getType(),
            wkt: wkt,
            feature: feature,
            sourceProjection: sourceProj
        };

        geometries.push(geometry);
        addGeometryToMap(feature, id);
        refreshGeometryList();
        closeWKTModal();
        
        // Zoom to geometry
        zoomToGeometry(id);
        
        showStatus(`"${name}" ${t('status.geometryAdded')}`);
        
        // Auto open style modal
        setTimeout(() => openStyleModal(id), 300);
    } catch (error) {
        showStatus(`${t('status.wktError')}: ${error.message}`, 'error');
    }
}

// ========================================
// Map Layer Functions
// ========================================
function addGeometryToMap(feature, id) {
    const vectorSource = new ol.source.Vector({
        features: [feature]
    });

    const name = feature.get('name') || '';
    const style = getDefaultStyle(feature.getGeometry().getType(), name);
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: style,
        zIndex: 100
    });

    map.addLayer(vectorLayer);
    styles[id] = {
        vectorLayer: vectorLayer,
        feature: feature,
        style: style,
        showLabel: true
    };
}

function getDefaultStyle(geomType, labelText = '') {
    const textStyle = labelText ? new ol.style.Text({
        text: labelText,
        font: 'bold 12px "Segoe UI", sans-serif',
        fill: new ol.style.Fill({ color: '#212121' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 }),
        offsetY: geomType === 'Point' ? -20 : 0,
        overflow: true,
        padding: [2, 4, 2, 4]
    }) : undefined;

    const defaultStyles = {
        'Point': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: '#D0021B' }),
                stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
            }),
            text: textStyle
        }),
        'MultiPoint': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: '#D0021B' }),
                stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
            }),
            text: textStyle
        }),
        'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: '#FF9800', width: 3 }),
            text: textStyle
        }),
        'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: '#FF9800', width: 3 }),
            text: textStyle
        }),
        'Polygon': new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(208, 2, 27, 0.2)' }),
            stroke: new ol.style.Stroke({ color: '#D0021B', width: 2 }),
            text: textStyle
        }),
        'MultiPolygon': new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(208, 2, 27, 0.2)' }),
            stroke: new ol.style.Stroke({ color: '#D0021B', width: 2 }),
            text: textStyle
        })
    };
    return defaultStyles[geomType] || defaultStyles['Point'];
}

function createLabelStyle(labelText, offsetY = 0) {
    if (!labelText) return null;
    return new ol.style.Text({
        text: String(labelText),
        font: 'bold 12px "Segoe UI", sans-serif',
        fill: new ol.style.Fill({ color: '#212121' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 }),
        offsetY: offsetY,
        overflow: true,
        padding: [2, 4, 2, 4]
    });
}

// ========================================
// Geometry List Functions
// ========================================
function refreshGeometryList() {
    const list = document.getElementById('geometryList');
    list.innerHTML = '';

    if (geometries.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 13px;"><span class="material-icons" style="font-size: 48px; display: block; margin-bottom: 10px;">layers_clear</span>Henüz geometri eklenmedi</div>';
        return;
    }

    geometries.forEach((geom) => {
        const item = document.createElement('div');
        item.className = 'geometry-item' + (selectedGeometryId === geom.id ? ' selected' : '');
        item.innerHTML = `
            <div class="geometry-item-info" onclick="selectGeometry(${geom.id})">
                <div class="geometry-item-name">${escapeHtml(geom.name)}</div>
                <div class="geometry-item-type">${getGeometryTypeName(geom.type)}</div>
            </div>
            <div class="geometry-item-actions">
                <button title="Yakınlaş" onclick="zoomToGeometry(${geom.id})"><span class="material-icons">search</span></button>
                <button title="Stil Düzenle" onclick="openStyleModal(${geom.id})"><span class="material-icons">palette</span></button>
                <button title="Projeksiyon" onclick="openProjectionModal(${geom.id})"><span class="material-icons">public</span></button>
                <button title="Sil" onclick="deleteGeometry(${geom.id})"><span class="material-icons">delete</span></button>
            </div>
        `;
        list.appendChild(item);
    });
}

function selectGeometry(id) {
    selectedGeometryId = id;
    refreshGeometryList();
}

async function deleteGeometry(id) {
    const confirmed = await showConfirmDialog(t('confirm.delete'), {
        title: t('confirm.title'),
        icon: 'delete',
        danger: true
    });
    
    if (confirmed) {
        const geom = geometries.find(g => g.id === id);
        geometries = geometries.filter(g => g.id !== id);
        
        if (styles[id]) {
            map.removeLayer(styles[id].vectorLayer);
            delete styles[id];
        }
        
        if (selectedGeometryId === id) {
            selectedGeometryId = null;
        }
        
        refreshGeometryList();
        showStatus(t('status.geometryDeleted'));
    }
}

async function clearAll() {
    if (geometries.length === 0) {
        showStatus(t('status.noGeometries'), 'error');
        return;
    }
    
    const confirmed = await showConfirmDialog(t('confirm.clearAll'), {
        title: t('confirm.title'),
        icon: 'warning',
        danger: true
    });
    
    if (confirmed) {
        geometries.forEach(geom => {
            if (styles[geom.id]) {
                map.removeLayer(styles[geom.id].vectorLayer);
                delete styles[geom.id];
            }
        });
        geometries = [];
        selectedGeometryId = null;
        refreshGeometryList();
        showStatus(t('status.allCleared'));
    }
}

// ========================================
// WKT Modal Functions
// ========================================
function openWKTModal() {
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    document.getElementById('wktModal').classList.add('active');
    document.getElementById('wktInput').focus();
}

function closeWKTModal() {
    document.getElementById('wktModal').classList.remove('active');
    document.getElementById('wktInput').value = '';
    document.getElementById('geometryName').value = '';
}

// ========================================
// Style Modal Functions
// ========================================
function openStyleModal(id) {
    const geom = geometries.find(g => g.id === id);
    if (!geom) return;

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    
    document.getElementById('styleGeometryName').value = geom.name;
    document.getElementById('styleModal').dataset.geometryId = id;
    
    // Set label checkbox state
    const showLabel = styles[id]?.showLabel !== false;
    document.getElementById('showLabelCheckbox').checked = showLabel;

    // Hide all style groups
    document.querySelectorAll('.style-group').forEach(group => {
        group.style.display = 'none';
    });

    // Show only relevant style group
    const groupId = geom.type === 'Point' ? 'pointStyleGroup' : 
                    geom.type === 'LineString' ? 'lineStyleGroup' : 'polygonStyleGroup';
    document.getElementById(groupId).style.display = 'block';

    // Update modal title
    const icons = {
        'Point': 'location_on',
        'LineString': 'edit',
        'Polygon': 'crop_square'
    };
    const titleKeys = {
        'Point': 'styleModal.titlePoint',
        'LineString': 'styleModal.titleLine',
        'Polygon': 'styleModal.titlePolygon'
    };
    const icon = icons[geom.type] || 'palette';
    const titleText = t(titleKeys[geom.type]) || t('styleModal.title');
    document.getElementById('styleModalTitle').innerHTML = `<span class="material-icons" style="display: inline; font-size: 24px; vertical-align: middle; margin-right: 8px;">${icon}</span>${titleText}`;

    document.getElementById('styleModal').classList.add('active');
}

function closeStyleModal() {
    document.getElementById('styleModal').classList.remove('active');
    // Show all style groups for next opening
    document.querySelectorAll('.style-group').forEach(group => {
        group.style.display = 'block';
    });
}

function applyStyle() {
    const id = parseInt(document.getElementById('styleModal').dataset.geometryId);
    const geom = geometries.find(g => g.id === id);
    if (!geom) return;

    // Update geometry name
    const newName = document.getElementById('styleGeometryName').value.trim();
    if (newName) {
        geom.name = newName;
        geom.feature.set('name', newName);
    }
    
    // Check if label should be shown
    const showLabel = document.getElementById('showLabelCheckbox')?.checked ?? true;
    const labelStyle = showLabel ? createLabelStyle(newName, 
        (geom.type === 'Point' || geom.type === 'MultiPoint') ? -20 : 0) : undefined;

    let style;

    if (geom.type === 'Point' || geom.type === 'MultiPoint') {
        const radius = parseInt(document.getElementById('pointRadius').value);
        const color = document.getElementById('pointColor').value;
        const strokeColor = document.getElementById('pointStroke').value;
        const strokeWidth = parseInt(document.getElementById('pointStrokeWidth').value);

        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth })
            }),
            text: labelStyle
        });
    } else if (geom.type === 'LineString' || geom.type === 'MultiLineString') {
        const color = document.getElementById('lineColor').value;
        const width = parseInt(document.getElementById('lineWidth').value);

        style = new ol.style.Style({
            stroke: new ol.style.Stroke({ color: color, width: width }),
            text: labelStyle
        });
    } else if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
        const fillColor = document.getElementById('polygonFill').value;
        const fillOpacity = parseInt(document.getElementById('polygonFillOpacity').value) / 100;
        const strokeColor = document.getElementById('polygonStroke').value;
        const strokeWidth = parseInt(document.getElementById('polygonStrokeWidth').value);

        style = new ol.style.Style({
            fill: new ol.style.Fill({ color: hexToRgba(fillColor, fillOpacity) }),
            stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth }),
            text: labelStyle
        });
    }

    if (style && styles[id]) {
        styles[id].vectorLayer.setStyle(style);
        styles[id].style = style;
        styles[id].showLabel = showLabel;
    }

    refreshGeometryList();
    closeStyleModal();
    showStatus(t('status.styleApplied'));
}

// ========================================
// Projection Modal Functions
// ========================================
function openProjectionModal(id) {
    const geom = geometries.find(g => g.id === id);
    if (!geom) return;

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    
    document.getElementById('projGeometryName').value = geom.name;
    document.getElementById('projectionModal').dataset.geometryId = id;

    const tbody = document.getElementById('projectionTableBody');
    tbody.innerHTML = '';

    const format = new ol.format.WKT();
    const projectionCodes = ['EPSG:4326', 'EPSG:3857', 'SR-ORG:7839', 'SR-ORG:7838', 'SR-ORG:7837', 'SR-ORG:7836', 'SR-ORG:7833', 'SR-ORG:7835'];

    projectionCodes.forEach(epsg => {
        try {
            // Clone geometry and transform
            const clonedGeom = geom.feature.getGeometry().clone();
            clonedGeom.transform('EPSG:3857', epsg);
            
            // Create temp feature for WKT
            const tempFeature = new ol.Feature({ geometry: clonedGeom });
            const wkt = format.writeFeature(tempFeature, {
                dataProjection: epsg,
                featureProjection: epsg,
                decimals: 6
            });

            const projName = projectionNames[epsg] || epsg;
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${epsg}</strong><br/><small>${projName}</small></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="flex: 1; word-break: break-all;">${escapeHtml(wkt)}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${escapeHtml(wkt).replace(/'/g, "\\'")}')">Kopyala</button>
                    </div>
                </td>
            `;
        } catch (e) {
            // Skip if projection conversion fails
        }
    });

    document.getElementById('projectionModal').classList.add('active');
}

function closeProjectionModal() {
    document.getElementById('projectionModal').classList.remove('active');
}

// ========================================
// Color Picker Synchronization
// ========================================
['point', 'line', 'polygon'].forEach(type => {
    const colorInputs = [
        { color: `${type}Color`, hex: `${type}ColorHex` },
        { color: `${type}Stroke`, hex: `${type}StrokeHex` },
        { color: `${type}Fill`, hex: `${type}FillHex` }
    ];

    colorInputs.forEach(({ color, hex }) => {
        const colorEl = document.getElementById(color);
        const hexEl = document.getElementById(hex);
        if (colorEl && hexEl) {
            colorEl.addEventListener('input', (e) => {
                hexEl.value = e.target.value;
            });
        }
    });
});

// ========================================
// Utility Functions
// ========================================
function generateId() {
    return ++geometryIdCounter;
}

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showStatus(t('status.copied'));
    }).catch(() => {
        showStatus(t('status.copyFailed'), 'error');
    });
}

// ========================================
// Basemap Functions
// ========================================
function toggleBasemapPanel() {
    const panel = document.getElementById('basemapPanel');
    panel.classList.toggle('open');
}

function changeBasemap(basemapKey) {
    // Hide all base layers
    Object.keys(baseLayers).forEach(key => {
        baseLayers[key].setVisible(false);
    });
    
    // Show selected base layer
    if (baseLayers[basemapKey]) {
        baseLayers[basemapKey].setVisible(true);
        currentBasemap = basemapKey;
    }
    
    // Update UI
    document.querySelectorAll('.basemap-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.basemap === basemapKey) {
            option.classList.add('active');
        }
    });
    
    // Close panel
    document.getElementById('basemapPanel').classList.remove('open');
    
    showStatus(`${t('status.basemap')}: ${t('basemap.' + basemapKey)}`);
}

// Close basemap panel when clicking outside
document.addEventListener('click', function(e) {
    const switcher = document.getElementById('basemapSwitcher');
    if (switcher && !switcher.contains(e.target)) {
        document.getElementById('basemapPanel')?.classList.remove('open');
    }
});

// ========================================
// Custom Confirm Dialog
// ========================================
let confirmResolve = null;

function showConfirmDialog(message, options = {}) {
    return new Promise((resolve) => {
        confirmResolve = resolve;
        
        const dialog = document.getElementById('confirmDialog');
        const title = document.getElementById('confirmTitle');
        const msg = document.getElementById('confirmMessage');
        const icon = document.getElementById('confirmIcon');
        const okBtn = document.getElementById('confirmOkBtn');
        
        // Set message
        msg.textContent = message;
        
        // Set title
        title.textContent = options.title || t('confirm.title');
        
        // Set icon
        const iconType = options.icon || 'warning';
        const icons = {
            'warning': 'warning',
            'danger': 'error',
            'delete': 'delete_forever',
            'info': 'help_outline',
            'question': 'help_outline'
        };
        icon.querySelector('.material-icons').textContent = icons[iconType] || 'help_outline';
        icon.className = 'confirm-icon ' + (iconType === 'delete' ? 'danger' : iconType);
        
        // Set button style
        if (options.danger || iconType === 'delete' || iconType === 'danger') {
            okBtn.className = 'btn btn-danger';
        } else {
            okBtn.className = 'btn btn-primary';
        }
        
        // Show dialog
        dialog.classList.add('active');
        
        // Focus cancel button for safety
        document.getElementById('confirmCancelBtn').focus();
    });
}

function closeConfirmDialog(result) {
    const dialog = document.getElementById('confirmDialog');
    dialog.classList.remove('active');
    
    if (confirmResolve) {
        confirmResolve(result);
        confirmResolve = null;
    }
}

// Close confirm dialog on overlay click
document.getElementById('confirmDialog')?.addEventListener('click', function(e) {
    if (e.target.id === 'confirmDialog') {
        closeConfirmDialog(false);
    }
});

// Close confirm dialog on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('confirmDialog')?.classList.contains('active')) {
        closeConfirmDialog(false);
    }
});

function showStatus(message, type = 'success') {
    // Remove existing status messages
    document.querySelectorAll('.status-message').forEach(el => el.remove());
    
    const status = document.createElement('div');
    status.className = 'status-message' + (type === 'error' ? ' error' : '');
    status.textContent = message;
    document.body.appendChild(status);
    
    setTimeout(() => {
        status.remove();
    }, 3000);
}

// ========================================
// Export Functions
// ========================================
function openExportModal() {
    if (geometries.length === 0) {
        showStatus(t('status.noGeometries'), 'error');
        return;
    }
    
    document.getElementById('exportGeometryCount').innerHTML = `${geometries.length} <span data-i18n="exportModal.count">${t('exportModal.count')}</span>`;
    document.getElementById('exportModal').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function exportGeometries() {
    const targetProjection = document.getElementById('exportProjection').value;
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    const includeStyles = document.getElementById('exportIncludeStyles').checked;
    
    const wktFormat = new ol.format.WKT();
    const exportData = [];
    
    geometries.forEach(geom => {
        try {
            // Clone the feature and transform to target projection
            const clonedGeometry = geom.feature.getGeometry().clone();
            clonedGeometry.transform('EPSG:3857', targetProjection);
            
            // Create WKT string
            const tempFeature = new ol.Feature({ geometry: clonedGeometry });
            const wkt = wktFormat.writeFeature(tempFeature, {
                dataProjection: targetProjection,
                featureProjection: targetProjection
            });
            
            const exportItem = {
                id: geom.id,
                name: geom.name,
                type: geom.type,
                wkt: wkt,
                projection: targetProjection
            };
            
            // Include style info if requested
            if (includeStyles && styles[geom.id]) {
                const style = styles[geom.id].style;
                exportItem.style = extractStyleInfo(style, geom.type);
            }
            
            exportData.push(exportItem);
        } catch (error) {
            console.error(`Error exporting geometry ${geom.id}:`, error);
        }
    });
    
    // Generate file based on format
    let content, filename, mimeType;
    const projName = projectionNames[targetProjection] || targetProjection;
    
    if (format === 'csv') {
        content = generateCSV(exportData, includeStyles);
        filename = `geometries_${projName.replace(/\s+/g, '_')}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
    } else if (format === 'json') {
        content = JSON.stringify(exportData, null, 2);
        filename = `geometries_${projName.replace(/\s+/g, '_')}.json`;
        mimeType = 'application/json;charset=utf-8;';
    } else if (format === 'geojson') {
        content = generateGeoJSON(exportData, targetProjection);
        filename = `geometries_${projName.replace(/\s+/g, '_')}.geojson`;
        mimeType = 'application/geo+json;charset=utf-8;';
    }
    
    // Download file
    downloadFile(content, filename, mimeType);
    
    closeExportModal();
    showStatus(`${exportData.length} ${t('status.exported')} (${projName})`);
}

function extractStyleInfo(style, geomType) {
    const styleInfo = {};
    
    if (!style) return styleInfo;
    
    if (geomType === 'Point' || geomType === 'MultiPoint') {
        const image = style.getImage();
        if (image && image instanceof ol.style.Circle) {
            styleInfo.radius = image.getRadius();
            const fill = image.getFill();
            const stroke = image.getStroke();
            if (fill) styleInfo.fillColor = fill.getColor();
            if (stroke) {
                styleInfo.strokeColor = stroke.getColor();
                styleInfo.strokeWidth = stroke.getWidth();
            }
        }
    } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
        const stroke = style.getStroke();
        if (stroke) {
            styleInfo.strokeColor = stroke.getColor();
            styleInfo.strokeWidth = stroke.getWidth();
        }
    } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        const fill = style.getFill();
        const stroke = style.getStroke();
        if (fill) styleInfo.fillColor = fill.getColor();
        if (stroke) {
            styleInfo.strokeColor = stroke.getColor();
            styleInfo.strokeWidth = stroke.getWidth();
        }
    }
    
    return styleInfo;
}

function generateCSV(data, includeStyles) {
    const headers = ['id', 'name', 'type', 'wkt', 'projection'];
    if (includeStyles) {
        headers.push('fillColor', 'strokeColor', 'strokeWidth', 'radius');
    }
    
    const rows = [headers.join(';')];
    
    data.forEach(item => {
        const row = [
            item.id,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            item.type,
            `"${item.wkt.replace(/"/g, '""')}"`,
            item.projection
        ];
        
        if (includeStyles && item.style) {
            row.push(
                item.style.fillColor || '',
                item.style.strokeColor || '',
                item.style.strokeWidth || '',
                item.style.radius || ''
            );
        } else if (includeStyles) {
            row.push('', '', '', '');
        }
        
        rows.push(row.join(';'));
    });
    
    // Add BOM for Excel UTF-8 compatibility
    return '\uFEFF' + rows.join('\n');
}

function generateGeoJSON(data, projection) {
    const features = data.map(item => {
        // Parse WKT to get geometry
        const wktFormat = new ol.format.WKT();
        let geometry = null;
        
        try {
            const feature = wktFormat.readFeature(item.wkt, {
                dataProjection: projection,
                featureProjection: projection
            });
            const olGeom = feature.getGeometry();
            geometry = olGeometryToGeoJSON(olGeom);
        } catch (e) {
            console.error('Error parsing WKT for GeoJSON:', e);
        }
        
        const geoJsonFeature = {
            type: 'Feature',
            properties: {
                id: item.id,
                name: item.name,
                geometryType: item.type
            },
            geometry: geometry
        };
        
        if (item.style) {
            geoJsonFeature.properties.style = item.style;
        }
        
        return geoJsonFeature;
    });
    
    const geoJson = {
        type: 'FeatureCollection',
        crs: {
            type: 'name',
            properties: {
                name: projection
            }
        },
        features: features
    };
    
    return JSON.stringify(geoJson, null, 2);
}

function olGeometryToGeoJSON(olGeom) {
    const type = olGeom.getType();
    let coordinates;
    
    switch (type) {
        case 'Point':
            coordinates = olGeom.getCoordinates();
            break;
        case 'MultiPoint':
            coordinates = olGeom.getCoordinates();
            break;
        case 'LineString':
            coordinates = olGeom.getCoordinates();
            break;
        case 'MultiLineString':
            coordinates = olGeom.getCoordinates();
            break;
        case 'Polygon':
            coordinates = olGeom.getCoordinates();
            break;
        case 'MultiPolygon':
            coordinates = olGeom.getCoordinates();
            break;
        default:
            coordinates = [];
    }
    
    return {
        type: type,
        coordinates: coordinates
    };
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ========================================
// Modal Overlay Click Handlers
// ========================================
['wktModal', 'styleModal', 'projectionModal', 'excelModal', 'exportModal'].forEach(modalId => {
    document.getElementById(modalId)?.addEventListener('click', (e) => {
        if (e.target.id === modalId) {
            if (modalId === 'wktModal') closeWKTModal();
            else if (modalId === 'styleModal') closeStyleModal();
            else if (modalId === 'projectionModal') closeProjectionModal();
            else if (modalId === 'excelModal') closeExcelModal();
            else if (modalId === 'exportModal') closeExportModal();
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWKTModal();
        closeStyleModal();
        closeProjectionModal();
        closeExcelModal();
        closeExportModal();
        stopDrawing();
        closeSidebar();
    }
});

// ========================================
// Excel Import Functions
// ========================================
let excelWorkbook = null;
let excelData = null;

function openExcelModal() {
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    document.getElementById('excelModal').classList.add('active');
    resetExcelUpload();
}

function closeExcelModal() {
    document.getElementById('excelModal').classList.remove('active');
    resetExcelUpload();
}

function resetExcelUpload() {
    excelWorkbook = null;
    excelData = null;
    document.getElementById('excelFileInput').value = '';
    document.getElementById('excelStep1').style.display = 'block';
    document.getElementById('excelStep2').style.display = 'none';
    document.getElementById('excelImportBtn').disabled = true;
}

function handleExcelFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            excelWorkbook = XLSX.read(data, { type: 'array' });
            
            // Update file info
            document.getElementById('excelFileName').textContent = file.name;
            
            // Populate sheet selector
            const sheetSelect = document.getElementById('excelSheetSelect');
            sheetSelect.innerHTML = '';
            excelWorkbook.SheetNames.forEach((name, index) => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                sheetSelect.appendChild(option);
            });
            
            // Load first sheet
            onSheetChange();
            
            // Show step 2
            document.getElementById('excelStep1').style.display = 'none';
            document.getElementById('excelStep2').style.display = 'block';
            
            showStatus('Excel loaded');
        } catch (error) {
            showStatus('Excel error: ' + error.message, 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

function onSheetChange() {
    const sheetName = document.getElementById('excelSheetSelect').value;
    const sheet = excelWorkbook.Sheets[sheetName];
    
    // Convert to JSON
    excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    if (excelData.length === 0) {
        showStatus('Empty sheet', 'error');
        return;
    }
    
    const headers = excelData[0] || [];
    const dataRows = excelData.slice(1);
    
    // Update row count
    document.getElementById('excelRowCount').textContent = `${dataRows.length} satır bulundu`;
    
    // Populate column selectors
    const wktSelect = document.getElementById('excelWktColumn');
    const labelSelect = document.getElementById('excelLabelColumn');
    
    wktSelect.innerHTML = '<option value="">-- Sütun Seçin --</option>';
    labelSelect.innerHTML = '<option value="">-- Etiket Yok --</option>';
    
    headers.forEach((header, index) => {
        const headerText = header || `Sütun ${index + 1}`;
        
        // WKT column
        const wktOption = document.createElement('option');
        wktOption.value = index;
        wktOption.textContent = headerText;
        wktSelect.appendChild(wktOption);
        
        // Auto-select if column name contains 'wkt' or 'geometry'
        if (headerText.toLowerCase().includes('wkt') || headerText.toLowerCase().includes('geometry')) {
            wktOption.selected = true;
        }
        
        // Label column
        const labelOption = document.createElement('option');
        labelOption.value = index;
        labelOption.textContent = headerText;
        labelSelect.appendChild(labelOption);
        
        // Auto-select if column name contains 'name', 'label', 'ad', 'isim'
        if (headerText.toLowerCase().includes('name') || 
            headerText.toLowerCase().includes('label') ||
            headerText.toLowerCase().includes('ad') ||
            headerText.toLowerCase().includes('isim')) {
            labelOption.selected = true;
        }
    });
    
    // Update preview table
    updateExcelPreview(headers, dataRows);
    
    // Enable/disable import button based on WKT selection
    wktSelect.onchange = function() {
        document.getElementById('excelImportBtn').disabled = !this.value;
    };
    
    // Trigger check
    document.getElementById('excelImportBtn').disabled = !wktSelect.value;
}

function updateExcelPreview(headers, dataRows) {
    const thead = document.getElementById('excelPreviewHead');
    const tbody = document.getElementById('excelPreviewBody');
    
    // Headers
    let headerHtml = '<tr>';
    headers.forEach((h, i) => {
        headerHtml += `<th>${escapeHtml(h || `Sütun ${i + 1}`)}</th>`;
    });
    headerHtml += '</tr>';
    thead.innerHTML = headerHtml;
    
    // Data rows (first 5)
    let bodyHtml = '';
    const previewRows = dataRows.slice(0, 5);
    previewRows.forEach(row => {
        bodyHtml += '<tr>';
        headers.forEach((_, i) => {
            const cellValue = row[i] !== undefined ? row[i] : '';
            const displayValue = String(cellValue).length > 50 
                ? String(cellValue).substring(0, 50) + '...' 
                : cellValue;
            bodyHtml += `<td title="${escapeHtml(String(cellValue))}">${escapeHtml(String(displayValue))}</td>`;
        });
        bodyHtml += '</tr>';
    });
    tbody.innerHTML = bodyHtml;
}

function importExcelData() {
    const wktColumnIndex = parseInt(document.getElementById('excelWktColumn').value);
    const labelColumnIndex = document.getElementById('excelLabelColumn').value;
    const projection = document.getElementById('excelProjection').value;
    const fillColor = document.getElementById('excelFillColor').value;
    const strokeColor = document.getElementById('excelStrokeColor').value;
    const showLabels = document.getElementById('excelShowLabels').checked;
    
    if (isNaN(wktColumnIndex)) {
        showStatus(t('excelModal.selectColumn'), 'error');
        return;
    }
    
    const headers = excelData[0] || [];
    const dataRows = excelData.slice(1);
    
    let successCount = 0;
    let errorCount = 0;
    const format = new ol.format.WKT();
    
    dataRows.forEach((row, rowIndex) => {
        const wktValue = row[wktColumnIndex];
        if (!wktValue || String(wktValue).trim() === '') {
            errorCount++;
            return;
        }
        
        try {
            const feature = format.readFeature(String(wktValue).trim(), {
                dataProjection: projection,
                featureProjection: 'EPSG:3857'
            });
            
            if (!feature || !feature.getGeometry()) {
                throw new Error('Geçersiz WKT');
            }
            
            const id = generateId();
            feature.set('id', id);
            
            // Get label
            let name;
            if (labelColumnIndex !== '' && row[parseInt(labelColumnIndex)]) {
                name = String(row[parseInt(labelColumnIndex)]);
            } else {
                name = `Excel ${rowIndex + 1}`;
            }
            
            feature.set('name', name);
            
            const geomType = feature.getGeometry().getType();
            
            const geometry = {
                id: id,
                name: name,
                type: geomType,
                wkt: wktValue,
                feature: feature,
                sourceProjection: projection
            };
            
            geometries.push(geometry);
            
            // Create label style
            const labelStyle = showLabels ? createLabelStyle(name, geomType === 'Point' || geomType === 'MultiPoint' ? -20 : 0) : null;
            
            // Create style based on geometry type
            let style;
            if (geomType === 'Point' || geomType === 'MultiPoint') {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 6,
                        fill: new ol.style.Fill({ color: fillColor }),
                        stroke: new ol.style.Stroke({ color: strokeColor, width: 2 })
                    }),
                    text: labelStyle
                });
            } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
                style = new ol.style.Style({
                    stroke: new ol.style.Stroke({ color: fillColor, width: 3 }),
                    text: labelStyle
                });
            } else {
                style = new ol.style.Style({
                    fill: new ol.style.Fill({ color: hexToRgba(fillColor, 0.3) }),
                    stroke: new ol.style.Stroke({ color: fillColor, width: 2 }),
                    text: labelStyle
                });
            }
            
            // Add to map
            const vectorSource = new ol.source.Vector({ features: [feature] });
            const vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: style,
                zIndex: 100
            });
            
            map.addLayer(vectorLayer);
            styles[id] = { vectorLayer, feature, style };
            
            successCount++;
        } catch (error) {
            errorCount++;
            console.warn(`Satır ${rowIndex + 2} hatalı:`, error.message);
        }
    });
    
    refreshGeometryList();
    closeExcelModal();
    
    if (successCount > 0) {
        // Zoom to all geometries
        const extent = new ol.source.Vector({ features: geometries.map(g => g.feature) }).getExtent();
        if (extent[0] !== Infinity) {
            map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
        }
        
        showStatus(`${successCount} ${t('status.imported')}`);
    } else {
        showStatus(t('status.wktError'), 'error');
    }
}

// Drag and drop support
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('fileUploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const input = document.getElementById('excelFileInput');
                input.files = files;
                handleExcelFile(input);
            }
        });
    }
});

// Color picker sync for Excel modal
document.getElementById('excelFillColor')?.addEventListener('input', (e) => {
    document.getElementById('excelFillColorHex').value = e.target.value;
});
document.getElementById('excelStrokeColor')?.addEventListener('input', (e) => {
    document.getElementById('excelStrokeColorHex').value = e.target.value;
});

// ========================================
// Mobile Sidebar Toggle
// ========================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuIcon = document.getElementById('menuIcon');
    
    if (sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        menuIcon.textContent = 'close';
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuIcon = document.getElementById('menuIcon');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuIcon.textContent = 'menu';
    document.body.style.overflow = '';
}

// Close sidebar when clicking on geometry actions (for mobile UX)
function zoomToGeometry(id) {
    const geom = geometries.find(g => g.id === id);
    if (geom && geom.feature) {
        const extent = geom.feature.getGeometry().getExtent();
        map.getView().fit(extent, { padding: [100, 100, 100, 100], duration: 500, maxZoom: 18 });
        selectGeometry(id);
        
        // Close sidebar on mobile after zoom
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    }
}
