var app = angular.module('app', []);
arrCorrect = [];

app.controller('mainCtrl', function($http, $scope) {
    $http.get('http://localhost:8080/quiz/all')
        .success(function (result) {
            console.log('success', result);
            //$scope.myresponse = result;
            var output = '';
            var stringData = JSON.stringify(result);
            var arrData = JSON.parse(stringData)[1];
            var questions=arrData.questions;
            var questionCount = questions.length;
            for (n=0;n<questionCount;n++) {
                var que = questions[n];
                var arrItems = que.items;
                output +=
                    '<br><br>' +
                    '<div class="panel panel-default">' +
                    '	<div class="panel panel-heading">' +
                    '	<h4><p>' + que.content + '</p></h4>'+
                    '	</div>'
                output +='<form>';
                for (i in arrItems) {
                    output +=
                        '<p>' + '<input type='+ que.type +' id='+arrItems[i].id+' name="customRadio" class="custom-control-input">' +
                        '<label class="form-check-label">' +
                        '  '+arrItems[i].content +
                        '</label>' +
                        '</p>';
                    /*если правильный ответ, добавляем в массив ID правильного ответа*/
                    if(arrItems[i].correct == 1){
                        arrCorrect.push(arrItems[i].id);
                    }
                }
                output +='</form>';
                output += '<p>' + 'Explanation: ' + que.explanation + '</p>'
                output +='</div>'
            }
            /*output += '<a href="http://localhost:8080/user" class="btn btn-default">Завершить тест</a>'*/
            output+='<div class="panel-body ">\n' +
                '        <button type="button" onclick="ChekAnswer()">Проверить результат</button>\n' +
                '    </div>';
            // $scope.myresponse = output;
            $('#response').html(
                output
            );

        })
        .error(function (result) {
            console.log('error');
        })
});

var ChekAnswer = function () {
    var jsonRightAns = ''; //формируем JSON правильных ответов
    var cntAllRightAns = arrCorrect.length;
    var cntRightAns = 0;
    var procentRight = 0;
    jsonRightAns+='{"arrid":[';
    // проходим по массиву правильных ответов
    for (i in arrCorrect){
        // если правильный ответ выбран, увеличиваем количество правильных ответов и формируем JSON правильных ответов
        if($('#'+arrCorrect[i]).is(':checked')){
            cntRightAns+=1;
            jsonRightAns+='{"id":' +arrCorrect[i]+'}';
            if (i < (arrCorrect.length - 1)) {
                jsonRightAns+=',';
            }
        }
    }
    procentRight = (cntRightAns/cntAllRightAns)*100;
    alert('Процент правильных ответов: '+procentRight);
    //формируем JSON правильных ответов
    jsonRightAns+=']}'
    alert(jsonRightAns);
    //вызываем функцию отправки JSON POST запросом на сервер
    RestPutRightAns(jsonRightAns);
}
var RestPutRightAns = function (arrJsonRightAns) {
    $.ajax({
        type: 'POST',
        url: service + "rightans/add",
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({rightAnsList:arrJsonRightAns}),
        dataType: 'json',
        async: false,
        success: function (result) {
            alert('Тест сохранен');
        },
        error: function (jqXHR, testStatus, errorThrown) {
            alert('Ошибка сохранения теста');
        }
    });
};