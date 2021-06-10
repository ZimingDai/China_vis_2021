function map(dataSet) {

    let deckHeatMapLayer = null;
    mapboxgl.accessToken = 'pk.eyJ1IjoicGhvZW4xeCIsImEiOiJja3BwNGpkOWEwY203MnVxajQ0d29oZGtiIn0.B0VqViVakzGi8ECZTbhFEA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [104, 35],
        zoom: 3.5
    });

    map.on('mousemove', function (e) {
        document.getElementById('features').innerHTML =       /* innerHTML 属性设置或返回表格行的开始和结束标签之间的 HTML  */

            // e.lngLat is the longitude, latitude geographical position of the event
            JSON.stringify(e.lngLat);  /* JSON.stringify() 方法可以将任意的 JavaScript 值序列化成 JSON 字符串 */
    });
    var availableWorldviews = [
        {
            code: 'CN',
            name: '中国'
        }
    ];

    // Choose a worldview you want to use when the map is first loaded.
    // Styles created by Mapbox default to "US" as the initial worldview.
    var worldviewOnMapLoad = 'CN';

    // Build the menu.
    // Alternatively, you could hard code the menu in your HTML directly.
    var worldviewOptions = document.getElementById('worldview-options');
    // Iterate through all availableWorldviews.
    availableWorldviews.forEach(function (worldview) {
// Create three new elements for each worldview.
        var radioItem = document.createElement('div');
        var radioInput = document.createElement('input');
        var radioLabel = document.createElement('label');
// Assign attributes based on the worldview.
        radioInput.type = 'radio';
        radioInput.name = 'toggle-worldview';
        radioInput.id = worldview.code;
        radioInput.value = worldview.code;
        radioInput.checked = worldview.code === worldviewOnMapLoad;
        radioLabel.htmlFor = worldview.code;
        radioLabel.innerText = worldview.code + ' (' + worldview.name + ')';
// Append the input and label elements to the radioItem div.
        radioItem.appendChild(radioInput);
        radioItem.appendChild(radioLabel);
// Append the radioItem div to the worldviewOptions div that
// will contain all the radio buttons.
        worldviewOptions.appendChild(radioItem);
    });

    // Wait for the map to finish loading.
    map.on('load', function () {
// Filter the "admin-0-*" layers to display
// administrative boundaries consistent with the
// initial worldview defined above ("CN").
        filterLayers(worldviewOnMapLoad);
// Get all the worldview option inputs and loop through them.
        var inputs = worldviewOptions.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
// Specify that the switchWorldview function
// (defined below) should run every time an input
// is clicked.
            inputs[i].onclick = switchWorldview;
        }
    });

    // 创建一个能够识别哪种世界观的功能
    //当前选择并运行filterLayers函数
    //以这种世界观作为论据。
    function switchWorldview(option) {
        filterLayers(option.target.id);
    }

    //更新每个“admin-0-*”层的过滤器，其中包含
    //国家一级的行政边界。
    //这些是在Mapbox Light中使用的相同的过滤器
    //除了世界观是基于用户输入。
    function filterLayers(worldview) {
// The "admin-0-boundary-disputed" layer shows boundaries
// at this level that are known to be disputed.
        map.setFilter('admin-0-boundary-disputed', [
            'all',
            ['==', ['get', 'disputed'], 'true'],
            ['==', ['get', 'admin_level'], 0],
            ['==', ['get', 'maritime'], 'false'],
            ['match', ['get', 'worldview'], ['all', worldview], true, false]
        ]);
// The "admin-0-boundary" layer shows all boundaries at
// this level that are not disputed.
        map.setFilter('admin-0-boundary', [
            'all',
            ['==', ['get', 'admin_level'], 0],
            ['==', ['get', 'disputed'], 'false'],
            ['==', ['get', 'maritime'], 'false'],
            ['match', ['get', 'worldview'], ['all', worldview], true, false]
        ]);
// The "admin-0-boundary-bg" layer helps features in both
// "admin-0-boundary" and "admin-0-boundary-disputed" stand
// out visually.
        map.setFilter('admin-0-boundary-bg', [
            'all',
            ['==', ['get', 'admin_level'], 0],
            ['==', ['get', 'maritime'], 'false'],
            ['match', ['get', 'worldview'], ['all', worldview], true, false]
        ]);
    }

// 从csv中读取文件
    d3.csv("CN-Reanalysis-daily-2013010100.csv").then(function (data) {
        let dataSet = data.map(function (d) {
            return [+d["PM2.5(微克每立方米)"], +d[" lon"], +d[" lat"]];
        });
        console.log('aaa')
        console.log(dataSet);
        deckHeatMapLayer = new deck.MapboxLayer({
            id: "epidemic-heat",
            type: deck.HeatmapLayer,
            data: dataSet,
            colorRange: [
                [d3.rgb("#fcfdbf").r, d3.rgb("#fcfdbf").g, d3.rgb("#fcfdbf").b],
                [d3.rgb("#febd82").r, d3.rgb("#febd82").g, d3.rgb("#febd82").b],
                [d3.rgb("#f97b5d").r, d3.rgb("#f97b5d").g, d3.rgb("#f97b5d").b],
                [d3.rgb("#bd3977").r, d3.rgb("#bd3977").g, d3.rgb("#bd3977").b],
                [d3.rgb("#842681").r, d3.rgb("#842681").g, d3.rgb("#842681").b],
                [d3.rgb("#401782").r, d3.rgb("#401782").g, d3.rgb("#401782").b],
            ],
            getPosition: d => [d[1], d[2]],
            getWeight: d => d[0],
            intensity: 5,
            radiusPixels: 10,
            threshold: 0.7,
            visible: true,
            opacity: 0.4
        });
        map.addLayer(deckHeatMapLayer);
    })
    //给数据的代码
    // deckHeatMapLayer = new deck.MapboxLayer({
    //     id: "epidemic-heat",
    //     type: deck.HeatmapLayer,
    //     data: dataSet,
    //     colorRange: [
    //         [d3.rgb("#fcfdbf").r, d3.rgb("#fcfdbf").g, d3.rgb("#fcfdbf").b],
    //         [d3.rgb("#febd82").r, d3.rgb("#febd82").g, d3.rgb("#febd82").b],
    //         [d3.rgb("#f97b5d").r, d3.rgb("#f97b5d").g, d3.rgb("#f97b5d").b],
    //         [d3.rgb("#bd3977").r, d3.rgb("#bd3977").g, d3.rgb("#bd3977").b],
    //         [d3.rgb("#842681").r, d3.rgb("#842681").g, d3.rgb("#842681").b],
    //         [d3.rgb("#401782").r, d3.rgb("#401782").g, d3.rgb("#401782").b],
    //     ],
    //     getPosition: d => [d[1], d[2]],
    //     getWeight: d => d[0],
    //     intensity: 10,
    //     radiusPixels: 10,
    //     threshold: 0.7,
    //     visible: true,
    //     opacity: 0.4
    // });
    // map.addLayer(deckHeatMapLayer);
    // map.on('mousemove', function (e) {
    //     document.getElementById('info').innerHTML =       /* innerHTML 属性设置或返回表格行的开始和结束标签之间的 HTML  */
    //         // e.point is the x, y coordinates of the mousemove event relative
    //         // to the top-left corner of the map
    //         JSON.stringify(e.point) + '<br />' +
    //         // e.lngLat is the longitude, latitude geographical position of the event
    //         JSON.stringify(e.lngLat);  /* JSON.stringify() 方法可以将任意的 JavaScript 值序列化成 JSON 字符串 */
    // });

}

map();