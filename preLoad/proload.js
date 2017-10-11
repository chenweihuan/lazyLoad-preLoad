/**
 * Created by WEIWEI on 2017/10/10.
 */
(function($){
    function Preload(imgs,options){
    //    定义
        this.imgs = (typeof imgs === 'string')?[imgs]:imgs;//保证imgs为数组
        this.opts = $.extend({},Preload.DEFAULTS,options)//用options去覆盖默认值
    //    调用加载方法
        if(this.opts.order == "ordered"){//有序加载
            this._orderedLoad();
        }else {
            this._unOrdered();//无序加载
        }
    //    Preload的默认值
        Preload.DEFAULTS = {
            order:"ordered",//默认有序加载
            each:null,//每张图片加载完成后调用此方法
            all:null//图片加载完毕调用此方法
        };
    }
    //    有序加载
        Preload.prototype._orderedLoad = function(){
            var imgs = this.imgs;
            var opts = this.opts;
            var count = 0;
            var len = imgs.length;

            function load(){
                var imgObj = new Image();
                imgObj.src = imgs[count];
                $(imgObj).on("load error",function(){
                    if(count > len-1){
                        opts.all && opts.all();//全部加载完成
                    }else {
                        opts.each && opts.each(count);
                        load();
                    }
                    count ++ ;
                })
            }
            load();
        };
    //    无需加载
        Preload.prototype._unOrdered = function(){
            var imgs = this.imgs;
            var opts = this.opts;
            var count = 0; // 计数器
            var len = imgs.length;
            console.log("无序加载")
            $.each(imgs, function (index, src) {
                if (typeof src != 'string') { // src路径不是字符串则不往下执行
                    console.error('请传入字符串形式的图片路径');
                    return;
                }
                var imgObj = new Image();
                imgObj.src = src;

                $(imgObj).on('load error', function () {
                    opts.each && opts.each(count); // 首先判断each属性是否存在，存在则执行

                    if (count >= len -1) {
                        opts.all && opts.all(); // 同理，不过是在图片加载完成之后调用
                    }

                    count++;
                });
            });
        };


    //     挂载到jQuery对象上
    $.extend({
        preload: function (imgs, opts) { // 命名为preload
            new Preload(imgs, opts);
        }
    });
})(jQuery);
