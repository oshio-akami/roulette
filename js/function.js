$(document).ready(function () {
  let isReelAnimation = false;
  let isStop = true;
  const marginEnd = 16;
  const marginStart = 2;
  let $reel;
  const $reels = $("#reels");
  const $textarea=$('#reel-input');
  const $csvInput=$('#csv-file');
  const $saveButton=$('#save-button');

  isStopReel=()=>!isReelAnimation&&isStop;
  
  //
  $csvInput.change(async function(){
    const file = $csvInput[0].files[0];
    const data = await getCsvData(file);
    Initialize(data);
  });
  $csvInput.click(function(){
    $(this).val('');
  });

  $saveButton.click(function(){
    const reelList=$textarea.val();
    Initialize(reelList);
  })

  async function Initialize(data) {
    deleteReel();
    const splitData = data.split(/\n/).filter((c) => c.length > 1);
    $textarea.val(splitData.join('\n'));
    if(splitData.length==0){
      return;
    }
    while (splitData.length <= marginEnd) {
      splitData = splitData.concat(splitData);
    }
    createReels(splitData);
    $reel = $(".reel");
  }

  //csvの読み込み
  async function getCsvData(file) {
    return new Promise((resolve, reject) => {
        if (!file) { 
            resolve(null); 
            return;
        }
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
  }

  function switchInputDisabled(bool){
    $csvInput.prop('disabled', bool);
    $textarea.prop('disabled', bool);
    $saveButton.prop('disabled', bool);
  }

  //リールを全て削除
  function deleteReel(){
    if($reel){
     $reel.remove();
    }
  }

  function createReels(data) {
    createReel(data[data.length - 1], 100);
    createReel(data[data.length - 2], 200);

    for (let i = 0; i < data.length; i++) {
      createReel(data[i], -i * 100);
    }

    for (let i = 0; i < marginEnd; i++) {
      createReel(data[i], (-i - data.length) * 100);
    }
  }

  //リールの生成
  function createReel(text, translate) {
    $("<div>", {
      class: "reel",
      text: text,
    })
      .appendTo($reels)
      .css({
        transform: "translateY(" + getTopString(translate) + ")",
      });
  }

  function getTopString(top) {
    return top.toString() + "%";
  }

  function AnimateReel() {
    isStop = false;
    isReelAnimation = true;
    $($reel).velocity(
      {
        top: getTopString(($($reel).length - marginStart - marginEnd) * 33),
      },
      {
        begin: function (elements) {
          $(elements).each(function () {
            $(this).css({
              top: "0",
            });
          });
        },
        complete: function (elements) {
          AnimateReel();
        },
        loop: 0,
        duration: 20 * $($reel).length,
        easing: "linear",
      }
    );
  }

  //リール停止時のアニメーション
  function StopAnimation() {
    const height = parseFloat($reel.eq(0).css("height"));
    const top = parseFloat($reel.eq(0).css("top"));
    const move = top + (height - (top % height)) + height * (marginEnd - 1);
    $($reel).velocity(
      {
        top: move,
      },
      {
        complete: function (elements) {
          isStop = true;
          switchInputDisabled(false);
        },
        loop: 0,
        duration: 5000,
        easing: "easeOutExpo",
      }
    );
  }

  $("#start").click(function () {
    if (isStop&&$reel) {
      switchInputDisabled(true);
      AnimateReel();
    }
  });
  $("#stop").click(function () {
    if (isReelAnimation) {
      $($reel).velocity("stop");
      isReelAnimation = false;
      StopAnimation();
      $($reel).velocity("resume");
    }
  });
});
