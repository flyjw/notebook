angular.module('App', [])
//声明命令并命名为markdown
.directive('markdown', function() {
    //创建showdown转换器，下面会用到
    var converter = new Showdown.converter();
    //命令会返回一个对象，用来声明命令的设置
    return {
        //声明自定义作用于，等待值被赋给markdown属性
        scope: {
            markdown: '@'
        },
        //声明link函数，它会把markdown转换成html
        link: function(scope, element, attrs) {
            //使用作用于观察器来同步模型改动
            scope.$watch('markdown', function() {
                //把markdown转换成html并存入content变量
                var content = converter.makeHtml(attrs.markdown);
                //把转换好的html内容注入到元素内
                element.html(content);
            });
        }
    }
});
