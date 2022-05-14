// ==UserScript==
// @name        SearchBot
// @namespace   Awww Jaaa Scripts
// @match       https://www.google.com/search?q=testing
// @grant       none
// @version     1.0
// @author      awja
// @description 5/10/2022, 10:38:02 AM
// ==/UserScript==

// This script is a total mess.  I know it.  I just need to move it around
// between fake accounts quickly to continue working on it.  Sorry for the
// mess, but it will get better.
//
// SearchBot is the initial part of what is going to be called the
// "Fake Footprinter".  The imediate purpose of this script is only to
// use the tracking and metadata collected by the big guys against them in
// order to help to establish more realistic fake identities.  I want to be able
// to load this up for a few hours, let it search keywords which stear the
// reality of the fake account, click on results, etc.
//
// Eventually, this could be paired with a back-end of automated email creation and
// response to really bring it all home and generate false metadata in the broker's
// collections.  Over time, as more and more false data is injected, the data they
// sale could become less accurate, therefore less valuable, thereby removing greed
// from the scenario, essentially wiping them out.
//
// But, that is a long way off.

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}


function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}

function openLogWindow() {
  const myLogWindow = window.open("", "", "width=500,height=500");
  myLogWindow.document.getElementById("demo").innerHTML = "HELLO!";
}

function navigate(href, newTab) {
   var a = document.createElement('a');
   a.href = href;
   if (newTab) {
      a.setAttribute('target', '_blank');
   }
   a.click();
}

async function search(term1,term2,term3)
{
  let query=term1+'+'+term2+'+'+term3;
  let url='http://www.google.com/search?q='+query;
//    window.open(url,'_blank');
//  myNewWindow=window.open(url,'_blank');
  await window.open(url,'_self');
//  pauseBrowser(5000);
  
  var newLink = document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].href;
  console.log('Following link: '+newLink);
  document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].click();
  
//  pauseBrowser(5000);
  
//  console.log(mySearchWindow.document.links[0].href)
//  mySearchWindow.document.links[0].style.border = "5px solid red";
  
//  const links = mySearchWindow.document.links;
//  let text = "";
//  for (let i = 0; i < links.length; i++) {
//    text += links[i].href + "<br>";
//  }

//  console.log(text);
}

async function startIt(keyword1,keyword2,keyword3) {
  console.log('Searching for: '+keyword1+' '+keyword2+' '+keyword3);
  await search(keyword1,keyword2,keyword3);
  console.log('Search complete!');
 
  console.log('Delaying 10 seconds...');
//  let delayres = await delay(3000);
//  pauseBrowser(10000);
}

async function stopIdle() {
  console.log('Script on hold.');
  console.log('Delaying 5 seconds...');
//  let delayres = await delay(30000);
  pauseBrowser(5000);
}

const searchTerms = [
  "purse",
  "red",
  "lipstick",
  "makeup",
  "cosmetics",
  "fashion",
  "plus size",
  "asian",
  "belt",
  "scarf",
  "women",
  "girl",
  "shoes",
  "pretty",
  "pink",
  "flowers",
  "floral"
];


async function main() {
  for(let i=0;i<2;i++) {
    let randomInteger1=randomIntFromInterval(0,16)
    let randomInteger2=randomIntFromInterval(0,16)
    let randomInteger3=randomIntFromInterval(0,16)

    queryWord1=searchTerms[randomInteger1];
    queryWord2=searchTerms[randomInteger2];
    queryWord3=searchTerms[randomInteger3];

    await startIt(queryWord1,queryWord2,queryWord3);
  }

  stopIdle();

}


main();


