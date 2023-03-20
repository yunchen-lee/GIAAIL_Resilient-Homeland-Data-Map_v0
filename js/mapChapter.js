var initLoad = true;
var layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity'],
    'heatmap': ['heatmap-opacity']
}

var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty',
    'full': 'fully'
}

function getLayerPaintType(layer) {
    var layerType = map.getLayer(layer).type;
    return layerTypes[layerType];
}

function setLayerOpacity(layer) {
    var paintProps = getLayerPaintType(layer.layer);
    paintProps.forEach(function(prop) {
        var options = {};
        if (layer.duration) {
            var transitionProp = prop + "-transition";
            options = { "duration": layer.duration };
            map.setPaintProperty(layer.layer, transitionProp, options);
        }
        map.setPaintProperty(layer.layer, prop, layer.opacity, options);
    });
}

var story = document.getElementById('story');
var features = document.createElement('div');
features.setAttribute('id', 'features');

var header = document.createElement('div');

if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}


// -------------------------------------------------
// create chapters
config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    // if (record.title) {
    //     var title = document.createElement('h3');
    //     title.innerText = record.title;
    //     chapter.appendChild(title);
    // }

    // if (record.image) {
    //     var image = new Image();
    //     image.src = record.image;
    //     chapter.appendChild(image);
    // }

    // if (record.description) {
    //     var story = document.createElement('p');
    //     story.innerHTML = record.description;
    //     chapter.appendChild(story);
    // }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    container.classList.add(alignments[record.alignment] || 'centered');
    if (record.hidden) {
        container.classList.add('hidden');
    }
    features.appendChild(container);
});

story.appendChild(features);


// -------------------------------------------
// create footer
var footer = document.createElement('div');

if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}

// -------------------------------------------
// set mapbox API key
mapboxgl.accessToken = config.accessToken;


// -------------------------------------------
// create map
const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
    return {
        url: url + suffix
    }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    interactive: false,
    transformRequest: transformRequest,
    projection: config.projection
});

// -------------------------------------------
// Create a inset map if enabled in config.js
if (config.inset) {
    var insetMap = new mapboxgl.Map({
        container: 'mapInset', // container id
        style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
        center: config.chapters[0].location.center,
        // Hardcode above center value if you want insetMap to be static.
        zoom: 4, // starting zoom
        hash: false,
        interactive: false,
        attributionControl: false,
        //Future: Once official mapbox-gl-js has globe view enabled,
        //insetmap can be a globe with the following parameter.
        //projection: 'globe'
    });
}

// -------------------------------------------
// Create a marker at chapters' center location if enabled in config.js
if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

// instantiate the scrollama
var scroller = scrollama();


// =========================================================================
// load map
map.on("load", function() {

    // set language
    let labels = ['country-label', 'state-label',
        'settlement-label', 'settlement-subdivision-label',
        'airport-label', 'poi-label', 'water-point-label',
        'water-line-label', 'natural-point-label',
        'natural-line-label', 'waterway-label', 'road-label'
    ];

    labels.forEach(label => {
        map.setLayoutProperty(label, 'text-field', ['get', 'name_en']); // name_zh-Hant
    });


    // set 3d terrain
    if (config.use3dTerrain) {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    };



    // As the map moves, grab and update bounds in inset map.
    if (config.inset) {
        map.on('move', getInsetBounds);
    }
    // setup the instance, pass callback functions
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(async response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.add('active');


            // toggle hero card
            const elem_hero = document.getElementById('hero');
            if (chapter.id === "first-identifier") {
                elem_hero.classList.remove('hide');
            } else elem_hero.classList.add('hide');

            // toggle info card
            const elem_info = document.getElementById('info');
            if (chapter.id === "first-identifier") {
                elem_info.classList.add('hide');
            } else elem_info.classList.remove('hide');

            // toggle mapInset
            const elem_inset = document.getElementById('mapInset');
            if (chapter.id === "first-identifier") {
                elem_inset.classList.add('hidden');
            } else elem_inset.classList.remove('hidden');


            // update the project title h2
            document.getElementById("projectTitle").innerHTML = chapter.title;


            map[chapter.mapAnimation || 'flyTo'](chapter.location);
            // Incase you do not want to have a dynamic inset map,
            // rather want to keep it a static view but still change the
            // bbox as main map move: comment out the below if section.
            if (config.inset) {
                if (chapter.location.zoom < 5) {
                    insetMap.flyTo({ center: chapter.location.center, zoom: 0 });
                } else {
                    insetMap.flyTo({ center: chapter.location.center, zoom: 4 });
                }
            }
            if (config.showMarkers) {
                marker.setLngLat(chapter.location.center);
            }
            if (chapter.onChapterEnter.length > 0) {
                chapter.onChapterEnter.forEach(setLayerOpacity);
            }
            if (chapter.callback) {
                window[chapter.callback]();
            }
            if (chapter.rotateAnimation) {
                map.once('moveend', () => {
                    const rotateNumber = map.getBearing();
                    map.rotateTo(rotateNumber + 180, {
                        duration: 30000,
                        easing: function(t) {
                            return t;
                        }
                    });
                });
            }
        })
        .onStepExit(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            if (chapter.onChapterExit.length > 0) {
                chapter.onChapterExit.forEach(setLayerOpacity);
            }
        });


    //  Center the map on a clicked feature

    map.addSource('points', {
        type: 'geojson',
        // data: '../geojson/photo_loaction.txt'
        data: 'https://scidm.nchc.org.tw/dataset/c4b05e4e-d520-490c-9ef5-ca88b83dee6d/resource/2a0702ce-3874-4d7e-94bf-13d9376ed9f7/nchcproxy/2023_0315_153948_photo_location.txt'
    });

    map.addLayer({
        'id': 'circle',
        'type': 'circle',
        'source': 'points',
        'paint': {
            'circle-color': '#1e9696',
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.8
        }
    });

    //  Center the map on a clicked feature
    map.on('click', 'circle', (e) => {
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            essential: true,
            padding: {
                top: 0,
                bottom: 0,
                left: 300,
                right: 0
            },
            duration: 1200
        });


        changeImageSource(e.features[0].properties.imgurl);
        // toggleSidebar_circle('left');

        // const elem = document.getElementById('left');
        // Add or remove the 'collapsed' CSS class from the sidebar element.
        // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
        // elem.classList.remove('collapsed');
        // map.easeTo({
        //     padding: 300
        //         // duration: 1200 // In ms. This matches the CSS transition duration property.
        // });

        // changeImageSource(e.features[0].properties.imgurl)
    });

    // map.on('click', 'places', (e) => {
    //     // Copy coordinates array.
    //     const coordinates = e.features[0].geometry.coordinates.slice();
    //     const description = e.features[0].properties.description;

    //     // Ensure that if the map is zoomed out such that multiple
    //     // copies of the feature are visible, the popup appears
    //     // over the copy being pointed to.
    //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //     }

    //     new mapboxgl.Popup()
    //     .setLngLat(coordinates)
    //     .setHTML(description)
    //     .addTo(map);
    //     });


    // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
    map.on('mouseenter', 'circle', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'circle', () => {
        map.getCanvas().style.cursor = '';
    });
});




// =========================================================
// other function methods

// ---------------------------------------
// Helper functions for insetmap
function getInsetBounds() {
    let bounds = map.getBounds();

    let boundsJson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ]
                    ]
                ]
            }
        }]
    }

    if (initLoad) {
        addInsetLayer(boundsJson);
        initLoad = false;
    } else {
        updateInsetLayer(boundsJson);
    }

}


// -----------------------------------------
// add indet map layer
function addInsetLayer(bounds) {
    insetMap.addSource('boundsSource', {
        'type': 'geojson',
        'data': bounds
    });

    insetMap.addLayer({
        'id': 'boundsLayer',
        'type': 'fill',
        'source': 'boundsSource', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#fff', // blue color fill
            'fill-opacity': 0.2
        }
    });
    // // Add a black outline around the polygon.
    insetMap.addLayer({
        'id': 'outlineLayer',
        'type': 'line',
        'source': 'boundsSource',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1
        }
    });
}

// update indet map layer
function updateInsetLayer(bounds) {
    insetMap.getSource('boundsSource').setData(bounds);
}


// -----------------------------------------
// setup resize event
window.addEventListener('resize', scroller.resize);


// -----------------------------------------
// change info img
function changeImageSource(imgsrc) {
    document.getElementById("Imgcontent").src = imgsrc;
}


// -----------------------------------------
// toggle left/right sidebar
// function toggleSidebar(id) {
//     const elem = document.getElementById(id);
//     // Add or remove the 'collapsed' CSS class from the sidebar element.
//     // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
//     const collapsed = elem.classList.toggle('collapsed');
//     const padding = {};
//     // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
//     padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
//     // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
//     map.easeTo({
//         padding: padding,
//         duration: 1000 // In ms. This matches the CSS transition duration property.
//     });
// }


// -----------------------------------------
// change the url of image
// function changeImageSource(imgsrc) {
//     document.getElementById("Imgcontent").src = imgsrc;
// }


// -----------------------------------------
// map padding animation
// function mapPaddingTrue() {
//     map.easeTo({
//         padding: 300,
//         duration: 1000
//     });

//     console.log("true")
// }