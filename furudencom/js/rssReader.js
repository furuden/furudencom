<script>

let viewXML2 = (xmlDocument) => {

    function isBetweenDate( now, exDay, num ){

        // 差分を絶対値で取得
        const days = Math.abs(exDay.getTime() - now.getTime());
        //console.log(days);

        // 日単位に変換
        const betweenDates = days / (24 * 60 * 60 * 1000);
        
        //console.log(betweenDates);
        return betweenDates < num;
      
      }

    //取得したRSSをXML形式に変換
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlDocument, "text/xml");
    let rss = doc.documentElement.getElementsByTagName("item");

    //初期設定：出力するsubjectカテゴリ
    const outputCategorys = ['キャンペーン告知', 'お知らせ', ''];

    //----初期設定：出力条件：X日以内制御の場合
    //初期設定：出力条件：X日以内
    const maxOutputItemDay = 90;//例：90日以内のみ出力

    // //----初期設定：出力条件：件数制御の場合
    // //初期設定：出力する件数
    // const maxOutputItem = 5;
    // let outputItemCount = 1;

    //HTMLタグの作成
    let addHtml = `<dl>`;
    for(let i = 0;i < rss.length;i++){
        //RSSから取得したタイトルとリンク情報を格納
        let rssTitle = rss[i].getElementsByTagName("title")[0].textContent;
        let rssLink   = rss[i].getElementsByTagName("link")[0].textContent;
        let rsssubject   = rss[i].getElementsByTagName("dc:subject")[0].textContent;
        let rssDateTime   = rss[i].getElementsByTagName("dc:date")[0].textContent;
        //<dc:date>2023-03-01T11:17:42+09:00</dc:date>

        //指定のsubjectカテゴリでなければ出力しない
        if(outputCategorys.find(element => element === rsssubject)!=undefined){
           continue; 
        }

        // ISO 8601 フォーマット（日本標準時）
        let tmpdate = new Date(rssDateTime);
        console.log(tmpdate.toLocaleString()); // 2022/5/5 6:35:20
        let rssDate = `${tmpdate.getFullYear()}/${tmpdate.getMonth() + 1}/${tmpdate.getDate()}`;

        if(rsssubject!=""){
            rsssubject="【"+rsssubject+"】"; 
        }

        
       if(!isBetweenDate( new Date(), tmpdate, maxOutputItemDay )){
            continue; 
        }

        // //----件数制御の場合
        // //最大出力件数ならループを終了
        // if(outputItemCount==maxOutputItem){
        //     break; 
        // }else{
        //     outputItemCount++;
        // }
        // //--------------------------------

         //テンプレート文字列を使ってアンカータグを作成
         addHtml += `<dt>${rssDate} ${rsssubject}</dd>`;
         addHtml += `<dd><a href="${rssLink}">${rssTitle}</a></dd>`;

    }
    addHtml += `</dl>`;

    // 指定の要素内にHTMLタグの挿入
    let rssDiv = document.getElementById('furuden_rss2');
    rssDiv.insertAdjacentHTML('afterbegin', addHtml);
};
let rssURL = 'https://furuden.blog.jp/index.rdf';
fetch(rssURL)
.then( response => response.text())
.then( xmlData => viewXML2(xmlData));
</script>