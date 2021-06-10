# China_vis_2021

> 参加china_vis（中国污染物可视化比赛）做的项目

使用html进行构建

### 其中用到了如下技术：

1. html、css、JavaScript
2. d3.js
3. echarts
4. mapbox
5. deck.gl



### 相关网站

1. [deck.gl](https://deck.gl/)

2. [observable](https://observablehq.com/)
3. [mapbox](https://docs.mapbox.com/)
4. [d3.js tutorial](https://blog.csdn.net/qq_34414916/article/details/80026029)
5. [Apache ECharts](https://echarts.apache.org/)



### <kbd>2021.6.10</kbd>

##### mapbox+deck.gl

利用mapbox做了世界地图，然后在deck.gl中利用加图层的方式在mapbox的图层上添加了热力图。

```javascript
let dataSet = data1.map(function (d) {
                            return [+d["PM2.5(微克每立方米)"], +d[" lon"], +d[" lat"]];
                        });
                        deckHeatMapLayer = new deck.MapboxLayer({
                            id: "epidemic-heat",
                            type: deck.HeatmapLayer,
                            data: dataSet,
                            colorRange: [
                                [d3.rgb("#2dc54d").r, d3.rgb("#2dc54d").g, d3.rgb("#2dc54d").b],
                                [d3.rgb("#336315").r, d3.rgb("#336315").g, d3.rgb("#336315").b],
                                [d3.rgb("#1b2c0b").r, d3.rgb("#1b2c0b").g, d3.rgb("#1b2c0b").b]
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
```

为了让热力图可以改变，在其中加入了js中的定时器。

```js
var Int = self.setInterval(<function>, <the number of ms>)
```



##### d3.js+echarts

d3js中读取csv的函数为`d3.csv("path")`

读取之后的函数调用为

```js
d3.csv("path").then(function(data){
    <data elements>
    let dataSet = data1.map(function (d) {
    	return [+d["PM2.5(微克每立方米)"], +d[" lon"], +d[" lat"]];
})
```

data必须在function中才能使用，==如何抛出现在还不清楚==

对于csv -> 数组，用map，**一定要+d**。

echarts语法直接放到function里面就可以实现。



还有就是，d3.queue()不知道为啥用不了。所以d3读取csv文件必须使用嵌套阅读……有点离谱。
