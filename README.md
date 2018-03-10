# Marvel Universe d3 NetworkGraph

**using d3 library & javascript**
<br>
1. 프로젝트 폴더를 만들어주세요.

2. 터미널에서 프로젝트 폴더를 열어주세요.

3. $ **npm init**

   + 현재 폴더에 package.json 파일 생성

   $ **npm install express**

   + 서버 구축
   + server.js 구성

   <br>

4. $ **npm install d3**

   ### d3 그래프를 만드는데에는 크게 4가지의 파일이 필요합니다.

   **server.js, index.html, graphFile.json, style.css**
   <br>
   <br>
5. **server.js**를 작성해주세요.

   #### src/server.js 

   ~~~javascript
   var express = require('express');
   var app = express();
   var server = require('http').createServer(app);
   var fs = require('fs');
   var port = 8000;

   app.use('/lib', express.static(__dirname + "/lib"));

   app.get('/', function(request, response) {
     // response.send('Hi There! Does it work?');
     fs.readFile('./Web/index.html', function(error, data){
       response.end(data);
     });
   });

   app.listen(port, function(err) {
     console.log('Connected port' + port);
     if (err) {
       return console.log('Found error', err);
     }
   })
   ~~~
   <br>
6. **index.html**을 작성해주세요.
   #### Web/index.html
   ~~~html
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="UTF-8"/>
       <title> MARVEL </title>
       <link rel="stylesheet" href="lib/style.css"/>
   </head>
   <body>
       <p> MARVEL STUDIO </p>
       <p> Avengers Infinity War </p>
       <script src="http://d3js.org/d3.v3.min.js"></script>
       <script>
         //d3 code 추가
       </script>
   </body>
   </html>
   ~~~

   기본적인 틀을 먼저 만들어주세요.<br>
   그리고 주석처리된 "d3 code 추가" 파트에 d3 라이브러리를 본격적으로 사용해볼거에요.
   <br>
   <br>
7. **d3 라이브러리**를 사용해봅시다.
   기존에 작성하던 index.html 파일에 계속 작성해주세요.
   <br>
   #### Web/index.html
   ~~~html
   <script>
       var width = 960,
           height = 600

         var color = d3.scale.category10();

         var svg = d3.select("body").append("svg")
           .attr("width", width)
           .attr("height", height);

         var force = d3.layout.force()
           .gravity(.03) //그래프가 공중에 떠있는 정도
           .distance(100) //점과 점사이 줄 길이
           .charge(-100) //점과 점들이 떨어져있는 정도
           .size([width, height]);

         d3.json("lib/graphFile.json", function(json) {
           force
             .nodes(json.nodes)
             .links(json.links)
             .start();
         });
   </script>
   ~~~

   + **d3.layout.force()** 함수를 통해 그래프가 공중에 떠있는 정도(gravity), 점과 점사이를 이어주는 선 길이(distance), 점과 점들이 떨어져있는 정도(charge)를 설정해주세요.
   + 그리고, **graphFile.json**에서 **nodes**와 **links**를 불러옵니다.
   <br>
   
   그렇다면 **graphFile.json** 을 확인해봅시다.
   <br>
   #### lib/graphFile.json
   ~~~json
   {
     "nodes":[
   		{"name":"Iron Man","group":2},
   		{"name":"Spiderman","group":2},
   		{"name":"Black Widow","group":2},
           {"name":"Black Panther","group":2},
           {"name":"Vision","group":2},
           {"name":"War Machine","group":2},
         	{"name":"Captain America","group":1}
   	],
   	"links":[
   		{"source":0,"target":1,"weight":20},
   		{"source":0,"target":2,"weight":5},
           {"source":0,"target":3,"weight":5},
           {"source":0,"target":4,"weight":5},
           {"source":0,"target":5,"weight":5},
           {"source":6,"target":7,"weight":20},
   	]
   }
   ~~~

   -  현재 완성된 코드는 너무 길어서 일부분만 들고와서 확인해봅시다. <br>
      **json**에는 **nodes**와 **links** 두 개의 값이 존재합니다.<br>
      
      **nodes**에는 **name**과 **group**의 정보가 담겨있습니다. <br>
      
      **name**에는 캐릭터의 이름을,  **group**에는 연관관계를 숫자로 적어줍니다.
   
   -  **links**에는 **source**, **target**, **weight** 세 개의 값이 존재합니다. <br>
      점과 점 사이를 이어주는 그래프를 만들기 위해서는 각 점이 무엇인지를 알려주는 변수가 필요합니다. <br>
      이때 사용되는게 바로 **source**와 **target**입니다. <br>
      
      **nodes**배열에 있는 순서대로 원하는 두 개의 점을 이어줍시다. <br>
      **weight**는 두 점을 이어주는 선의 굵기를 뜻합니다. 
   <br>
   이렇게하면 **graphFile.json**은 모두 완성되었습니다. 다시 **index.html**파일을 확인해봅시다.

   #### Web/index.html
   <br>
   위에서 작성하던 부분에 이어서 작성해주세요.

   ~~~html
   <script>
       d3.json("lib/graphFile.json", function(json) {
           var link = svg.selectAll(".link")
               .data(json.links)
             	.enter().append("line")
               .attr("class", "link")
               .style("stroke-width", function(d) { return Math.sqrt(d.weight); })
               
           var node = svg.selectAll(".node")
               .data(json.nodes)
             	.enter().append("g")
               .attr("class", "node")
               .style("fill", function(d) { return color(d.group); })
               .call(force.drag);

           node.append("circle")
               .attr("r","5")

           node.append("text")
               .attr("dx", 12)
               .attr("dy", ".35em")
               .text(function(d) { return d.name });

           force.on("tick", function() {
             link.attr("x1", function(d) { return d.source.x; })
                 .attr("y1", function(d) { return d.source.y; })
                 .attr("x2", function(d) { return d.target.x; })
                 .attr("y2", function(d) { return d.target.y; });

             node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
           });
       }
   </script>
   ~~~

   + **link**변수

     json에서 **links**를 불러와, 선을 추가하고, 선의 굵기를 정해줍니다.

   + **node**변수

     json에서 **nodes**를 불러와, **group**에 적힌 숫자로 노드의 색깔을 정해주고, 드래그할 수 있는 기능을 넣어줍니다.

     node에 점을 추가하고, 텍스트를 추가해서 노드의 이름을 지정해줍니다. 

   + 노드를 움직일때마다 위치가 변할 수 있도록 해주세요

   <br>
   <br>

8. 노드와 선을 꾸며주세요.
   #### src/style.css

   ~~~css
   .link {
     stroke: #999;
     stroke-opacity: 0.9;
   }

   .node text {
     stroke:#333;
     fill:#333;
     cursos:pointer;
   }

   .node circle{
     stroke:#fff;
     stroke-width:1.5px;
   }
   ~~~

   자유롭게 바꿔주세요.



9. 실행해봅시다.

   $  **nodemon src/server.js**
   <br>
   ![1](https://user-images.githubusercontent.com/35247295/37243854-975e95b6-24c3-11e8-8b0f-d6e1ebf53d46.gif)




10. 번외편

    **index.html** 속 **script**태그에 너무 많은 내용이 들어가서, 따로 js파일을 만들고 싶을때는 어떻게 해야할까요?

    1. **index.html**의 **body**태그 속에 다음과 같은 코드를 추가해주세요.

       ~~~html
       <script src="lib/graph.js"></script>
       ~~~

    2. **src**폴더 안에 **graph.js**라는 파일을 만들어주세요.

    3. **graph.js**에 작성해주세요.

       #### src/graph.js

       ~~~js
       d3.select("body").append("div").text("My favorite character is THOR...");
       ~~~

    <br>

---

참고문헌

- [d3.js](https://d3js.org/)
- [simple d3 network graph](http://bl.ocks.org/jose187/4733747) 
- [d3 force-directed graph](https://bl.ocks.org/mbostock/4062045)
- [MARVEL](http://marvel.com/)

ps.
이 프로젝트는 순전히 마블을 좋아하고, 마블 영웅중 토르를 가장 좋아해서 만들어보게된 미니프로젝트입니다.

For EVERY minute, the future is becoming the PAST - THOR-
