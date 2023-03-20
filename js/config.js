var config = {
    style: 'mapbox://styles/mapbox/dark-v10', // dark style
    accessToken: 'pk.eyJ1IjoieXVuY2hlbi1sZWUiLCJhIjoiY2wxeGttYmg0MDNwaTNicWY5bWM5ZHM0OCJ9.gS5S-DMTk308nQP8MAzN0w', // my token
    // showMarkers: true,
    showMarkers: false,
    markerColor: '#1e9696', // marker color : gray
    //projection: 'equirectangular',
    //Read more about available projections here
    //https://docs.mapbox.com/mapbox-gl-js/example/projections/
    inset: true,
    theme: 'dark',
    // use3dTerrain: false, //set true for enabling 3D maps.
    use3dTerrain: true, //set true for enabling 3D maps.

    // header information
    title: 'Projects',
    subtitle: '... subtitle ...',
    byline: 'By ...',
    footer: '&copy; National Yang Ming Chiao Tung University. Created using <a href="https://github.com/mapbox/storytelling" target="_blank">Mapbox Storytelling</a> template.',
    chapters: [{
            id: 'first-identifier',
            alignment: 'left',
            hidden: false,
            title: 'Project Awwww',
            // image: './path/to/image/source.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  ',
            location: {
                // center: [121.52120, 25.04824],
                // zoom: 11,
                center: [120.210, 24.450],
                zoom: 7.5,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1,
                //     duration: 5000
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'second-identifier',
            alignment: 'left',
            hidden: false,
            title: 'Project Baa',
            // image: './path/to/image/source.png',
            description: 'Copy these sections to add to your story.',
            location: {
                center: [119.90898, 23.34897],
                zoom: 10,
                pitch: 60,
                bearing: -30,
                // flyTo additional controls-
                // These options control the flight curve, making it move
                // slowly and zoom out almost completely before starting
                // to pan.
                //speed: 2, // make the flying slow
                //curve: 1, // change the speed at which it zooms out
            },
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'third-identifier',
            alignment: 'left',
            hidden: false,
            title: 'Project Cuckoo',
            // image: './path/to/image/source.png',
            description: 'Copy these sections to add to your story.',
            location: {
                center: [120.9956, 24.7869],
                zoom: 16,
                pitch: 26,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'fourth-chapter',
            alignment: 'left',
            hidden: false,
            title: 'Project drip drop',
            // image: './path/to/image/source.png',
            description: 'Copy these sections to add to your story.',
            location: {
                center: [121.469, 23.701],
                zoom: 13,
                pitch: 85,
                bearing: 24.00
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        }, {
            id: 'fifth-chapter',
            alignment: 'left',
            hidden: false,
            title: 'Project Yeeeee',
            // image: './path/to/image/source.png',
            description: 'Copy these sections to add to your story.',
            location: {
                center: [121.52099, 25.12468],
                zoom: 15,
                pitch: 0,
                bearing: -40.00
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};