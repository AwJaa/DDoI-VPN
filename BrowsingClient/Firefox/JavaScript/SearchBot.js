// ==UserScript==
// @name        SearchBot
// @namespace   Awww Jaaa Scripts abc0001
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

function sleep(seconds) {
  milliSeconds=seconds*1000;
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
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

async function openLogWindow() {
  myLogWindow = window.open("", "", "width=500,height=500");
//  myLogWindow.document.getElementById("demo").innerHTML = "HELLO!";
}

async function writeLogWindow(logMsg) {
  myLogWindow.document.writeln(logMsg+'<br>');
  console.log(logMsg);
}

function navigate(href, newTab) {
   var a = document.createElement('a');
   a.href = href;
   if (newTab) {
      a.setAttribute('target', '_blank');
   }
   a.click();
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function search(term1,term2,term3)
{
  query=term1+'+'+term2+'+'+term3;
  url='http://www.google.com/search?q='+query;
//    window.open(url,'_blank');
//  myNewWindow=window.open(url,'_blank');
  mySearchWindow=await window.open(url,'_blank');
  
  setTimeout(()=>{
    mySearchWindow.document.body.style.backgroundColor='#660000';
    div = mySearchWindow.document.createElement('div');
    textNode = mySearchWindow.document.createTextNode('Here I am');
    div.className = "alert";
    div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";
    document.body.append(div);
  },3000);
  
  //alert(mySearchWindow.location.href);
//  pauseBrowser(5000);

  const elm = await waitForElm('.q8U8x');
  
  mySearchWindow.onload = async function() {
   newLink = mySearchWindow.document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].href;
   //  console.log('Following link: '+newLink);
   await writeLogWindow('[Search: '+query+'] Following link with a mouse click => '+newLink);
   mySearchWindow.document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].click();
  }
//  mySearchWindow.blur();
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
  logStr='Searching for: '+keyword1+' '+keyword2+' '+keyword3;
//  console.log(logStr);
  await writeLogWindow(logStr);

  await search(keyword1,keyword2,keyword3);
//  console.log('Search complete!');
  await writeLogWindow('Search complete!');
 
//  console.log('Delaying 10 seconds...');
  let randomSeconds=randomIntFromInterval(3,15)
  await writeLogWindow('Delaying a random '+randomSeconds+' seconds...');
  await sleep(randomSeconds);
//  let delayres = await delay(3000);
//  pauseBrowser(10000);
}

async function stopIdle() {
//  console.log('Script has completed and is on hold.');
//  console.log('Sleeping 5 seconds...');
//  let delayres = await delay(30000);
  await writeLogWindow('SearchBot is idle.  Waiting 30 seconds...');
  await sleep(30);
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
  console.log('*******************************');
  console.log('*** SearchBot v1.0 Started! ***');
  console.log('*******************************');
  
  await openLogWindow();
  await writeLogWindow('SearchBot v1.0 Started!');
  
  for(let i=0;i<2;i++) {
    let randomInteger1=randomIntFromInterval(0,16)
    let randomInteger2=randomIntFromInterval(0,16)
    let randomInteger3=randomIntFromInterval(0,16)

    queryWord1=searchTerms[randomInteger1];
    queryWord2=searchTerms[randomInteger2];
    queryWord3=searchTerms[randomInteger3];

    await startIt(queryWord1,queryWord2,queryWord3);
  }

  while(1 == 1) { await stopIdle(); }

}


main();



