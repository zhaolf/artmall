var pTip = function(str){
  $('.pTip').remove();
  $('body').append('<div class="pTip" style="display: none;text-align: center;z-index: 99999;position: fixed;left: 50%;top: 45%;margin-left: -100px;width: 200px;padding: 10px 0;background: #000;opacity: 0.8;color: #FFF;border-radius: 4px;font-size:13px;"><span></span></div>')
  $('.pTip span').text(str);
  $('.pTip').fadeIn().delay(600).animate({'top':$('.pTip').position().top-60},'1000',function(e){
    $('.pTip').fadeOut('',function(){$(this).css('top', '45%');})
  });
};
var getUrlParam = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
};


//$('.comments,.article').on('click', '.btn-more,.article-info', function(event) {
//	event.preventDefault();
//	$('.modal').css('display', 'flex');
//	$('html,body').css('overflow', 'hidden');
//});
//$('.modal').on('click', '.close,.btn-close', function(event) {
//	event.preventDefault();
//	$('.modal').hide();
//	$('html,body').css('overflow', 'auto');
//});

$.ajaxSetup({
	  // timeout: 10000,
	  dataType: 'json',
	  cache: false,
	  beforeSend: function(){
	  },
	  error: function (xhr, status, e) { 
	  },
	  complete: function (xhr, status) { 
	    $('.preloading').fadeOut()
	  }
}); 
