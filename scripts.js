// https://codepen.io/semibran/pen/NPOGdd
//onload = main;
function drawstats(){
  // Define player object and statistics
  var player = {};
  
  player.coding = 65;
  player.googlefu = 100;
  player.ai = 42;
  player.optimization = 68;
  player.graphics = 45;
  // Array that takes information from the player object to get the order
  // in which stats are displayed onscreen. Change the order in which
  // the player stats are defined to change order.
  var statOrder = [];
  for(var i in player)statOrder.push(i);
  // Define colors. I used simple three-digit hex colors, in this case.
  var statColors = {};
  statColors.life = "#339933";
  statColors.defense = "#333399";
  statColors.agility = "#999933";
  statColors.intellect = "#993399";
  statColors.power = "#993333";

  var circleIndexes = [];
  for(var i in statColors)circleIndexes.push({defaultColor: statColors[i], color: statColors[i], over: false});
  
  var innerPolygonColor = "#339933";
  var innerPolygonKnobs = [];
  for(var i in statColors)innerPolygonKnobs.push({over: false, dragging: false});
  
  // Function for adding elements to screen. Code is reusable.
  function appendElement(type, properties, parent){
    if(parent === undefined)parent = document.body;
    var element = document.createElement(type);
    for(var i in properties){
      element.setAttribute(i, properties[i]);
    }
    parent.appendChild(element);
    return element;
  }
  // Place canvas object centered in the screen.
  var canvas = document.getElementById("canvas");
  // Get canvas context.
  var ctx = canvas.getContext("2d");
  ctx.canvas.width  = window.outerWidth * 0.35 * 0.7;
  ctx.canvas.height = ctx.canvas.width;


  // Define pentagon (or other polygon) size and coordinates.
  var polygonX = ctx.canvas.width / 2;
  var polygonY = ctx.canvas.width / 2;
  var polygonSize = ctx.canvas.width / 4;
  // Define size of circles.
  var circleSize = ctx.canvas.width / 16;
  var circles = [];

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
  ctx.canvas.width  = window.outerWidth * 0.35 * 0.7;
  ctx.canvas.height = ctx.canvas.width;
  polygonX = ctx.canvas.width / 2;
  polygonY = ctx.canvas.width / 2;
  polygonSize = ctx.canvas.width / 4;
  circleSize = ctx.canvas.width / 16;
        redraw();
  }

  String.prototype.toRGB = function(){
    var obj;
    var triplet = this.slice(1, this.length);
    var colors = [];
    var index = 0;
    for(var i = 0; i < triplet.length; i += 2){
      colors[index] = parseInt("0x"+triplet[i]+triplet[i+1]);
      index ++;
    }
    obj = {
      string: "rgb("+colors[0]+", "+colors[1]+", "+colors[2]+")",
      red: colors[0],
      green: colors[1],
      blue: colors[2],
    };
    return obj;
  }

  var vertices = [];
  function drawRegularPolygon(x, y, fill, stroke, strokeWidth, sides, radius){
    // Draws a regular polygon onto the canvas.
    // Note that a circle can be made by setting sides to radius/2.
    
    // Variable declarations
    var arc;
    var x;
    var y;
    var point;
    var points = [];
    
    // Begin drawing with parameters
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    // Add round line joints
    ctx.lineJoin = 'round';
    // Using sides+1 because the sides should be linked properly.
    for(var i = 0; i <= sides+1; i ++){
      // Create arc variable
      arc = i * 2*Math.PI / sides;
      // Add coordinates to array for reuse
      point = {};
      point.x = x+radius*Math.sin(arc);
      point.y = y-radius*Math.cos(arc);
      if(i === 0)ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
      // Prevent point duplication
      if(i < sides+1)points.push(point);
    }
    // Draw polygon
    ctx.fill();
    ctx.stroke();
    // Close path, just in case
    ctx.closePath();
    // Return points array for future use
    return points;
  }
  var circles = [];
  var counter = 0;
  function redraw(){
    circles = [];
    // Fill canvas with black.
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(15, 92, 187, 1)";
    ctx.fill();

    var polygon = drawRegularPolygon(polygonX, polygonY, "rgba(255, 255, 255, 1)", "#333", 2, statOrder.length, polygonSize);
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.lineDashOffset = 10;
    ctx.strokeStyle = "#333";
    for(var i = 0; i < polygon.length; i ++){
      ctx.moveTo(polygonX, polygonY);
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }
    ctx.stroke();
    // Remove line dash for future use
    ctx.setLineDash([0]);

    // Inner polygon
    ctx.beginPath();
    var index;
    var stat;
    var text;
    var innerPolygonVertices = [];
    var distX;
    var distY;
    var distTotal;
    var x;
    var y;
    for(var i = 0; i < statOrder.length+1; i ++){
      index = i % statOrder.length;
      if(vertices[index] === undefined)vertices[index] = {};
      if(innerPolygonVertices[index] === undefined)innerPolygonVertices[index] = {};
      vertices[index].x = polygon[index].x;
      vertices[index].y = polygon[index].y;
      stat = (counter < player[statOrder[index]]) ? counter : player[statOrder[index]];
//      stat = (counter < player[statOrder[index]]) ? counter * player[statOrder[index]] / 100 : player[statOrder[index]];
      

      vertices[index].distX = distX = vertices[index].x-polygonX;
      vertices[index].distY = distY = vertices[index].y-polygonY;
      vertices[index].distTotal = Math.sqrt(distX*distX + distY*distY);
      vertices[index].radians = Math.atan2(distY, distX);
      x = polygonX+Math.cos(vertices[index].radians)*(vertices[index].distTotal*stat/100);
      y = polygonY+Math.sin(vertices[index].radians)*(vertices[index].distTotal*stat/100);
      innerPolygonVertices[index].x = x;
      innerPolygonVertices[index].y = y;
      ctx.lineTo(x, y);
    }
    // Set alpha of polygon
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = innerPolygonColor;
    ctx.fill();
    
    ctx.globalAlpha = 1;
    ctx.strokeStyle = innerPolygonColor;
    ctx.stroke();

    for(var i = 0; i < innerPolygonVertices.length; i ++){
      x = innerPolygonVertices[i].x;
      y = innerPolygonVertices[i].y;
      innerPolygonKnobs[i].x = x;
      innerPolygonKnobs[i].y = y;
      if(innerPolygonKnobs[i].over || innerPolygonKnobs[i].dragging){
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
        ctx.strokeStyle = statColors[statOrder[index]];
        ctx.stroke();
        ctx.closePath();
      }
    }
    
    // Draw circles;
    for(var i = 0; i < statOrder.length; i ++){
      index = i;
      x = vertices[index].x+Math.cos(vertices[index].radians)*(circleSize+8);
      y = vertices[index].y+Math.sin(vertices[index].radians)*(circleSize+8);
      ctx.beginPath();
      ctx.arc(x, y, circleSize, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#333';
    //  ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(x, y, circleSize-4, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#fff";
      if(circleIndexes[index].over)ctx.fillStyle = statColors[statOrder[index]];
    //  ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(x, y, circleSize-6, 0, 2 * Math.PI, false);
      ctx.fillStyle = statColors[statOrder[index]];
      if(circleIndexes[index].over)ctx.fillStyle = "#fff";
    //  ctx.fill();
      ctx.closePath();
      circles.push({x: x, y: y, size: circleSize-6, radius: (circleSize-6)/2, stat: statOrder[index], color: statColors[statOrder[index]]});
      ctx.fillStyle = "#fff";
      if(circleIndexes[index].over)ctx.fillStyle = statColors[statOrder[index]];
      ctx.font = "1.8vmin Arial";
      text = statOrder[index].toUpperCase();
      stat = (counter < player[statOrder[index]]) ? counter : player[statOrder[index]];
      var stat1 = stat+"%";
      if(stat > player[statOrder[index]])
        stat1 = player[statOrder[index]]+"%";
      ctx.fillText(text, x-ctx.measureText(text).width/2, y);
      ctx.fillText(stat1, x-ctx.measureText(stat1).width/2, y+16);
    }

    if(counter++ < 101)
        setTimeout(redraw, 1000/fps);
  }
  redraw();
  function getClosestPointOnLine(line,x,y) {
    lerp=function(a,b,x){ return(a+x*(b-a)); };
    var dx=line.x1-line.x0;
    var dy=line.y1-line.y0;
    var t=((x-line.x0)*dx+(y-line.y0)*dy)/(dx*dx+dy*dy);
    t=Math.min(1,Math.max(0,t));
    var lineX=lerp(line.x0, line.x1, t);
    var lineY=lerp(line.y0, line.y1, t);
    return({x:lineX,y:lineY});
  };
  function pythagorean(dx, dy){
    return Math.sqrt(dx*dx + dy*dy);
  }
  var fps = 60;
  var circle;

  var oldColor;
  var newColor;
  var transitioning = false;
  var transitionIndex = 0;
  var transitionSteps = 10;
  var red, green, blue, redDiff, greenDiff, blueDiff, redSpeed, greenSpeed, blueSpeed;
  var change;
  
}

//////////////////////////////

$(document).ready(function(){
  var playSound = false;
  var first = true;
  $('#fullpage').fullpage({
    sectionsColor: ['#f2f2f2',  '#4BBFC3', 'white', '#a82630'],
    loopBottom: false,
    loopHorizontal: false,
    navigation: true,
    navigationPosition: 'right',
    slidesNavigation: false,

    afterLoad: function(anchorLink, index){
      var loadedSection = $(this);

      //using index
      if(index == 2){
        if(first) {drawstats(); first = false;}
      }
    },

  });
  $.fn.fullpage.setMouseWheelScrolling(false);
  $.fn.fullpage.setAllowScrolling(false);
  $.fn.fullpage.setKeyboardScrolling(false);
  $("#fp-nav").css("opacity", 0);
  $("#controller").fadeOut(1);
  $("#mask").fadeOut(20);
  $("#controller").fadeIn(80);
    $("#squares>div").mouseenter(function(){
    $(this).stop();
    $(this).animate({'opacity': 0}, 10);
  });

  $("#squares>div").mouseleave(function(){
    $(this).stop();
    $(this).delay(600).animate({'opacity': 1}, 500);
  });

  var isMobile = false; //initiate as false


  var vid = $("#video")[0];
  var vid1 = $("#video1")[0];
  
  $("#startButton").click(function(){
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
    if(isMobile)
    {  vid.play();
       vid1.play();
    }
    playSound = true;
    beepOne.play();

 //   $("#controller").stop();
    $("#controller").css("opacity", 1);
    $("#startButton").remove();
    $("#controller").animate({marginBottom : "-=5px"}, 100);
    $("#controller").animate({marginBottom : "+=5px"}, 100);
    $("#mymenu>a").css({"opacity": 1, "z-index":2200});
    
    $.fn.fullpage.setMouseWheelScrolling(true);
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.setKeyboardScrolling(true);
    shownav();
  });

  $(".ahome").click(function(){
    $.fn.fullpage.moveTo(1, 0);
    if(playSound) 
      navclick();
  });
  $(".aabout").click(function(){
    $.fn.fullpage.moveTo(2, 0);
    if(playSound)
      navclick();
  });
  $(".aprojects").click(function(){
    $.fn.fullpage.moveTo(3, 0);
    if(playSound)
      navclick();
  });
  $(".acontact").click(function(){
    $.fn.fullpage.moveTo(4, 0);
    if(playSound)
      navclick();
  });

  function navclick(){
    $("#squares").fadeOut(2000);
    //$("#squares").hide(1000);
  //  $("#mymenu>a").fadeOut(3000);
    $("#mymenu>a").animate({width : "25px"}, 500, "swing");
    $("#mymenu>a").animate({left : "-100px"}, 1000, "swing", function() {
      $(".sidenav>a").css({"opacity": 1, "z-index":2200});
       $("#fp-nav").css({"opacity": 1});
      playSound = true;
      });
    $("#controller").fadeOut(2000);
 //   $("#controller").delay(1000).animate({left : "-1000px"}, 2000, "linear");
   
    playSound = false;
    
  };

  $(".scrollarrow1").click(function(){
    $.fn.fullpage.moveTo(2);
  });
  $(".scrollarrow2").click(function(){
    $.fn.fullpage.moveTo(3);
  });
  $(".scrollarrow3").click(function(){
    $.fn.fullpage.moveTo(4);
  });

  var beepOne = $("#beepone")[0];
  $(".sidenav a").mouseenter(function() {
    if(playSound)
      beepOne.play();
  });

  function shownav(){
    $(".ahome").css({"top": "30%"});
    $(".aabout").css({"top": "calc(30% + 60px)"});
    $(".aprojects").css({"top": "calc(30% + 120px)"});
    $(".acontact").css({"top": "calc(30% + 180px)"});
  }
/*
  var myIndex = 0;
  carousel();

  function carousel() {
      var i;
      var x = document.getElementsByClassName("mySlides");
      for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";  
      }
      myIndex++;
      if (myIndex > x.length) {myIndex = 1}    
      x[myIndex-1].style.display = "block";  
      setTimeout(carousel, 4000); // Change image every 2 seconds
  }*/
});