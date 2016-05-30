var upfile = document.getElementById("upfile");
var province = remote_ip_info['province'];
var city = remote_ip_info['city']
var district = remote_ip_info['district'];
var picUrl = '',pageIndexHot=pageIndexNew=1;
var baseUrl = '/artgoer/api/v3/user/0/photographActivity';
var activityInfoIdValue=getUrlParam('activityInfoId');
var expire = false;
$(function(){
  //tab 切换
  $('.nav-tabs').on('click', 'a[role=tab]', function(event) {
    event.preventDefault();
    var id = $(this).attr('href');
    $('.nav-tabs li').removeClass('active')
    $(this).parent('li').addClass('active')
    $('.tab-pane').removeClass('active');
    $(id).addClass('active');
  });

  // $.getJSON(baseUrl+'/showActivityInfo',{activityInfoId:activityInfoIdValue} ,function(data) {
  $.getJSON('activity.js',{activityInfoId:activityInfoIdValue} ,function(data) {
    if (data.status == '200') {
      $('.preloading').fadeOut('slow');
      var activityData = data.data;
      $('.activity-cover').css({
        'background':'url('+activityData.subjectUrl+'?imageMogr2/thumbnail/750x490) center center',
        'background-size': '100% 100%'
      });
      $('.activity-title').html(activityData.subject)
      $('.activity-slogan p').html(activityData.subject)
      $('.activity-info .fleft').html('参与：'+activityData.activityVoteSum)
      if (moment(activityData.endDate).format('x')<moment().format('x')) {
        expire = true;
        $('.btn-vote').remove()
        $('.activity-info .fright').html('已结束');
      }else{
        $('.activity-info .fright').html('剩余：'+moment(activityData.endDate).from(moment(), true))
      };
      $('.activity-desc').html('<img src='+activityData.activityDescUrl+' width=100% >')
      $('.activity-prize').html('<img src='+activityData.activityPrizeUrl+' width=100% >');
      work.load(pageIndexHot)
      newest.load(pageIndexNew)
    }
  });
  
  $('.gallery').on('click', '.btn-vote', function(event) {
    event.preventDefault();
    var $this = $(this);
    var worksId = $this.data('worksid');
    $.ajax({
      url: baseUrl+'/activityVote',
      type: 'POST',
      dataType: 'json',
      data: {'activityInfoId':activityInfoIdValue,'worksId':worksId},
      beforeSend: function(){
        $this.attr('disabled', 'disabled');
      }
    })
    .done(function(data) {
      if (data.status == '200') {
        pTip('投票成功')
        var num = parseInt($this.parents('.gallery-work').find('span').text())+1;
        $this.parents('.gallery-work').find('span').html(num)
      }
    })
    .fail(function() {
    })
    .always(function() {
      //$this.removeAttr('disabled')
    });   
  }).on('click', '.work-cover', function(event) {
    event.preventDefault();
    var imgUrl = 'http://'+$(this).css('background-image').split('http://')[1].split('?imageMogr2')[0];
    imgUrl = imgUrl + "?imageMogr2/thumbnail/1024x768";
    $.magnificPopup.open({
      items: [{'src':imgUrl}],
      gallery: {
        enabled: true,
      },
      type: 'image',
    });
  });

  $('.btn-more').click(function(event) {
    var id = $('.tab-pane.active').attr('id');
    if (id=="hot") {
      pageIndexHot++;
      work.load(pageIndexHot);
    }else if (id=='new') {
      pageIndexNew++;
      newest.load(pageIndexNew);
    }
  });

  $('.btn-publish').click(function(event) {
    var username = $('input[name=username]').val().trim();
    var phone = $('input[name=phone]').val().trim();
    var workname = $('input[name=workname]').val().trim();
    if (username=='') {
      pTip('请输入姓名')
    }else if (phone=='') {
      pTip('请输入手机号')
    }else if (workname=='') {
      pTip('请输入作品名')
    }else{
      $.ajax({
        url: baseUrl+'/insertWorksInfo',
        type: 'POST',
        dataType: 'json',
        data: {
          'activityId': activityInfoIdValue,
          'userName': username,
          'worksPicUrl': picUrl.split(',')[1],
          'worksName': workname,
          'mobile': phone,
          'address': city,
        },
        beforeSend: function(){
          $('.btn-publish').attr('disabled', 'disabled');
          $('.preloading').fadeIn();
        }
      })
      .done(function(data) {
        if (data.status == '200') {
          location.reload()
        }
      })
      .always(function() {
        $('.btn-publish').removeAttr('disabled')
      });
      
    };
  });
})
var work = {
  load: function(pageIndex){
    $.ajax({
      // url: baseUrl+'/showActivityWorks?activityInfoId='+activityInfoIdValue,
      url: 'showActivityWorks.js',
      type: 'GET',
      dataType: 'json',
      data: {'pageIndex': pageIndex},
      beforeSend: function(){
        $('.btn-more').attr('disabled', 'disabled');
      }
    })
    .done(function(data) {
      if (data.status == '200') {
        var works = tmpl('tmpl-work', data.data);
        $('#hot').append(works);
        if (expire) {
          // $('.btn-vote').remove()
          $('.btn-vote').attr('disabled', 'disabled');
        };
        if (data.data.length<10) {
          $('.btn-more').hide();
          $('.gallery').css('padding-bottom','60px');
        };
        $('.gallery-work').width(($(window).width()-25)/2);
        $('.work-cover').height(($(window).width()-25)/2)
      }
    })
    .fail(function() {
    })
    .always(function() {
      $('.btn-more').removeAttr('disabled')
    });
    
  }
}
var newest = {
  load: function(pageIndex){
    $.ajax({
      // url: baseUrl+'/showNewActivityWorks?activityInfoId='+activityInfoIdValue,
      url: 'showNewActivityWorks.js',
      type: 'GET',
      dataType: 'json',
      data: {'pageIndex': pageIndex},
      beforeSend: function(){
        $('.btn-more').attr('disabled', 'disabled');
      }
    })
    .done(function(data) {
      if (data.status == '200') {
        var newests = tmpl('tmpl-work', data.data);
        $('#new').append(newests);
        if (expire) {
          // $('.btn-vote').remove()
          $('.btn-vote').attr('disabled', 'disabled');
        };
        if (data.data.length<10) {
          $('.btn-more').hide();
          $('.gallery').css('padding-bottom','60px');
        };
        $('.gallery-work').width(($(window).width()-25)/2);
        $('.work-cover').height(($(window).width()-25)/2)
      }
    })
    .fail(function() {
    })
    .always(function() {
      $('.btn-more').removeAttr('disabled')
    });
    
  }
}
