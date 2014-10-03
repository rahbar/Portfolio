// create the module and name it mohammadApp

var mohammadApp = angular.module('mohammadApp', ['ngRoute']);

// configure our routes
mohammadApp.config(function($routeProvider) {
    $routeProvider
    
    // route for the home page
            .when('/', {
                templateUrl : 'sampleprojects.html',
        controller  : 'mainController'
    })
    // route for the carousel page
            .when('/Pie Chart', {
                templateUrl : 'piechart.html',
        controller  : 'carouselController'
    });
    
});

// create the controller and inject Angular's $scope
mohammadApp.controller('mainController', function($scope) {
    // create a message to display in our view
    
});

mohammadApp.controller('carouselController', function($scope) {
    $scope.slideValue = [];
    $scope.slideName = [];
    $scope.chartListWatch = true;
    var sigmaData = 0;
    var valuePercent = [];
    var newItem = [];
    var indexToDelete = 0;
    var checkSelect = false;
    $scope.addSlide=function(x,y){
        if (isNaN(y)) {
            return
        }else{
            $scope.slideName.push(x);
            $scope.slideValue.push(y);
            updateChartList()
        }
    };
    $scope.$watch("chartListWatch",function(){
        console.log("slideValue Changed")  
        if ($scope.slideValue.length > 0)
            updateChartList()
    })
    function updateChartList(){
        var lastNameIndex = $scope.slideName.length - 1;
        sigmaData = 0;
        for (var i=0; i<$scope.slideValue.length; i++){
            sigmaData += $scope.slideValue[i];
        }
        //console.log(sigmaData)
        newItem.push(document.createElement("p"));
        document.getElementById("chartList").appendChild(newItem[lastNameIndex]);
        for (var i=0; i<$scope.slideName.length; i++){
            valuePercent[i] = ($scope.slideValue[i]/sigmaData)*100;
            newItem[i].setAttribute("id",i)
            newItem[i].className = "chartLists"
            newItem[i].addEventListener("click", selectedItem)
            //console.log(newItem[i].getAttribute("id"));
            newItem[i].innerHTML=$scope.slideName[i] + " : " + Math.round(valuePercent[i]*100)/100 + "%";
        }
    }
    function selectedItem(){
        //console.log(this.innerHTML);
        jQuery("#chartList p").removeClass("selected")
        this.className= this.className + " " +  "selected";
        indexToDelete= this.id;
        checkSelect = true;
        console.log(this.innerHTML.length)
        
    }
    $scope.deleteItem = function(){
        if (checkSelect){
            jQuery(".selected").remove();
            console.log($scope.chartListWatch)
            $scope.slideName.splice(indexToDelete,1);
            $scope.slideValue.splice(indexToDelete,1);
            newItem.splice(indexToDelete,1)
            valuePercent.splice(indexToDelete,1)
            $scope.chartListWatch = !$scope.chartListWatch
            checkSelect = false;
        }
        
    }
});

mohammadApp.directive('drawCanvas',function(){
    return{
        restrict: "A",
        link: function(scope,element, attrs){
            // var data=[];
            var labels=[];
            var sigmaData = 0;
            var sum=0;
            attrs.$observe('drawCanvas', function(value){
                data=value;
                updateCanvas(data);
            });
            attrs.$observe('canvasLabel', function(value){
                //console.log(value);
                labels=JSON.parse(value);
            })
            
            function updateCanvas(d){
                var myObject = JSON.parse(d);
                var data = myObject;
                console.log(data);
                var colors = ["#FFDAB9", "#E6E6FA", "#E0FFFF" ,
                    "#A6E3FB", "#F0F8FF","#A52A2A",
                    "#7FFF00","#DC143C","#00008B",
                    "#8B008B","#FF1493","#FFD700"];
                var n=labels.length;
                var context = element[0].getContext("2d");
                pie ={
                    width: 300,
                    height: 350
                };
                /****************** Clearing Canvas**************/
                
                // Store the current transformation matrix
                context.save();
                
                // Use the identity matrix while clearing the canvas
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, pie.width, pie.height);
                
                // Restore the transform
                context.restore();
                /****************** End of clearing ****************/    
                
                
                
                sigmaData=0;
                for (var i = 0; i < data.length; i++) {
                    sigmaData += data[i];
                    //console.log("data: " + data)
                    //console.log("data length: " + data.length)
                    //console.log("sigma data: " + sigmaData)
                }
                for (var i = 0; i < data.length; i++) {
                    drawSegment(pie, context, i);
                }
                
                function drawSegment(pie, context, i) {
                    context.save();
                    var centerX = Math.floor(pie.width / 2);
                    var centerY = Math.floor(pie.height / 2);
                    radius = Math.floor(pie.width / 2);
                    var  startingAngle = degreesToRadians(sumTo(data, i));
                    var arcSize = degreesToRadians((data[i]/sigmaData)*360);
                    var endingAngle = startingAngle + arcSize;
                    context.beginPath();
                    context.moveTo(centerX, centerY);
                    context.arc(centerX, centerY, radius, 
                    startingAngle, endingAngle, false);
                    context.closePath();
                    context.fillStyle = colors[i];
                    context.fill();
                    context.restore();
                    drawSegmentLabel(pie, context, i);
                }
                function degreesToRadians(degrees) {
                    return (degrees * Math.PI)/180;
                }
                function sumTo(a, i) {
                    //sum = 360 - ((a[i]/sigmaData)*360);
                    if (i===0){
                        sum=0;
                    }
                    else {
                        sum += ((a[i-1]/sigmaData)*360);
                    }
                    
                    if (sum > 360) sum = sum - 360;
                    //console.log("sum " + i + ": " + sum);
                    return sum;
                }
                function drawSegmentLabel(pie, context, i) {
                    context.save();
                    var x = Math.floor(pie.width / 2);
                    var y = Math.floor(pie.height / 2);
                    var angle = degreesToRadians(sum);
                    context.translate(x, y);
                    context.rotate(angle);
                    var dx = Math.floor(pie.width * 0.5)-(10+10*(labels[i].length));
                    var dy = Math.floor(pie.height * 0.05);
                    var fontSize = Math.floor(pie.height / 25);
                    context.font = fontSize + "pt Helvetica";
                    context.fillText(labels[i], dx,dy);
                    context.restore();
                }
                /*function drawSegmentLabel(canvas, context, i) {
                    context.save();
                    var x = Math.floor(canvas.width / 2);
                    var y = Math.floor(canvas.height / 2);
                    var angle = degreesToRadians(sumTo(data, i));
                
                    context.translate(x, y);
                    context.rotate(angle);
                    var dx = Math.floor(canvas.width * 0.5) - 10;
                    var dy = Math.floor(canvas.height * 0.05);
                
                    context.textAlign = "right";
                    var fontSize = Math.floor(canvas.height / 25);
                    context.font = fontSize + "pt Helvetica";
                
                    context.fillText(labels[i], dx, dy);
                
                    context.restore();
                }*/
            }
        }
    }; 
});