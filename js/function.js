$(document).ready(async function(){
  const reelList= await getCsvData();
  const csvData = reelList.split(',');
  DeleteFileInput();
  let isReelAnimation=false;
  let isStop=true;
  const marginEnd=8;
  const marginStart=2;
  const $reels=$('#reels');
  

  createReel(csvData[csvData.length-1], 100);
  createReel(csvData[csvData.length-2],200);

  for(let i =0;i<csvData.length;i++){
    createReel(csvData[i],-i * 100);
  }

  for(let i =0;i<marginEnd;i++){
    createReel(csvData[i],(-i-(csvData.length)) * 100);
  }
   
  const $reel=$('.reel');


  function createReel(text,translate){
    $('<div>',{
      class:'reel',
      text:text,
    }).appendTo($reels).css({
      transform: "translateY(" + getTopString(translate) + ")",
    });

  }

  async function getCsvData() {
    return new Promise((resolve, reject) => {
      $('#csv-file').change(function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          resolve(data);
        };
        reader.onerror = function (e) {
          reject(e);
        };
        reader.readAsText(file);
      });
    });
  }

  function DeleteFileInput(){
    const $input=$('.form');
    $($input).css({
      'display':'none',
    })
  }

  function getTopString(top){
    return top.toString()+'%';
  }

  function AnimateReel(){
    isStop=false;
    isReelAnimation=true;
    $($reel).velocity(
      {
        top: getTopString(($($reel).length-marginStart-marginEnd)*33),
      },
      {
        begin:function(elements){
          $(elements).each(function() {
            $(this).css({
              'top':'0',
            });
          });
        },
        complete: function (elements) {
          AnimateReel();
          console.log("complete");
        },
        loop:0,
        duration: 15 * $($reel).length,
        easing: "linear",
      }
    );
  }
  function StopAnimation(){
    const height=parseFloat($reel.eq(0).css('height'));
    const top = parseFloat($reel.eq(0).css('top'));
    const move=top+(height-(top%height))+height*marginEnd;
    $($reel).velocity(
      {
        top: move,
      },
      {
        complete: function (elements) {
          isStop=true;
        },
        loop:0,
        duration: 5000,
        easing: "easeOutExpo",
      }
    );
  }


  $('#start').click(function() {
    if(isStop){
      AnimateReel();
    }
  });
  $('#stop').click(function() {
    if(isReelAnimation){
      $($reel).velocity('stop');
      isReelAnimation=false;
      StopAnimation();
      $($reel).velocity('resume');
    }
  });
});