angular.module('App').controller('EditorController', function($scope, $http) { //把$http服务注入控制器
    $scope.editing = true;

    $http.get('/notes').success(function(data) { //使用$http.get加载笔记，如果成功，使用法内的数据
        $scope.notes = data; //把从http返回的数据赋值给$scope
    }).error(function(err) { //处理错误，存储错误
        $scope.error = 'Could not load notes';
    });

    $scope.view = function(index) { //声明一个名为view的新$scope方法，接受被点击元素的下标
        $scope.editing = false; //把editing状态设置为false，因为此时用户要查看元素
        $scope.content = $scope.notes[index]; //给content模型设置一个新模型，包含被单击的笔记
    };

    $scope.create = function() { //创建create方法并把它赋值给作用域，这样就可以在模版的ngClick中调用
        $scope.editing = true; //确保editing状态为true
        $scope.content = { //使用空值重置content模型
            title: '',
            content: ''
        };
    };

    $scope.save = function() { //把save()方法赋值给作用域
        $scope.content.date = new Date(); //把日期设置成这个笔记最后一次被编辑的日期
        if ($scope.content.id) { //检查这个笔记是否有ID，从而判断是该更新已有笔记还是创建新笔记
            $http.put('/notes/' + $scope.content.id, $scope.content).success(function(data) { //向笔记API发送PUT请求来更新笔记并在完成之后关闭编辑模式
                $scope.editing = false;
            });
        } else {
            $scope.content.id = Date.now(); //因为这是一个新笔记，基于当前时间给它一个独一无二的ID
            $http.post('/notes', $scope.content).success(function(data) { //向笔记API发送POST请求来创建一个新笔记，然后把新笔记加入笔记列表，最后关闭编辑模式
                $scope.notes.push($scope.content);
                $scope.editing = false;
            })
        }
    };

    $scope.remove = function() { //声明remove()方法
        $http.delete('/notes/' + $scope.content.id).success(function(data) { //向笔记API发送删除请求
            var found = -1;
            angular.forEach($scope.notes, function(note, index) { //遍历笔记数组找到要删除的笔记下标
                if (note.id === $scope.content.id) {
                    found = index;
                }
            });
            if (found >= 0) { //如果找到笔记，从angular应用的笔记列表中删除
                $scope.notes.splice(found, 1);
            }
            $scope.content = { //重置content模型，为下一个新笔记做准备
                title: '',
                content: ''
            };
        });
    };
});
