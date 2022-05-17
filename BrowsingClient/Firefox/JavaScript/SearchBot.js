// ==UserScript==
// @name        SearchBot 1.2
// @namespace   Awww Jaaa Scripts
// @match       https://www.google.com/search?q=testing
// @grant       none
// @version     1.2
// @author      awja
// @description 5/10/2022, 10:38:02 AM
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////////
// This script is a total mess.  I know it.  I just need to move it around
// between fake accounts quickly to continue working on it.  Sorry for the 
// mess, but it will get better.
//
// SearchBot is the initial part of what is going to be called the
// "Fake Footprinter".  The immediate purpose of this script is only to 
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
////////////////////////////////////////////////////////////////////////////////////

// It is required that you hit the Google search settings cog and change the 
// "Results per page" to 100.

// ES6 requried for: =>
// ES8 required for: async
/*jshint esversion: 8 */

const myVersion='1.2';

// Returns a random integer between min and max (inclusive)
function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

// Returns a promise to resolve after passed seconds.  A sleep() function, duh.
function sleep(seconds) {
  const milliSeconds=seconds*1000;
  return new Promise(resolve=>setTimeout(resolve,milliSeconds));
}


// Opens a pop-up window for logging
async function openLogWindow() {
    myLogWindow=window.open("","","width=500,height=500,left=10,top=10");
  
/*
  myLogWindow.document.body.style.backgroundColor='#DDBBBB';
    let div = myLogWindow.document.createElement('div');
    //let textNode = myLogWindow.document.createTextNode('SearchBot');
    div.className="topBanner";
    div.innerHTML='<h3><b>*** SearchBot '+myVersion+' by AwJa ***</b></h3>';
    div.setAttribute('style',"background-color:black;color:yellow;border:1em solid black;border-radius:5%;width:100%;padding:1em;text-align:center");
    myLogWindow.document.append(div);
*/
    return;
}

// Writes log message to the pop-up log window as well as console
async function writeLogWindow(logMsg) {
  myLogWindow.document.writeln(logMsg+'<br>');
  console.log(logMsg);
}


// Returns a promise to resolve after a class selector has loaded (i.e., wait for this element of HTML)
function waitForElm(selector) {
 // debugger;
  return new Promise(resolve=>{
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    const observer=new MutationObserver(mutations=>{
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body,{
      childList: true,
      subtree: true
    });
  });
}

// Types data into an element
async function typeInto(el,data) {
  const e=new InputEvent('input', {      
    inputType: 'insertText',
    data,
  });
  el.value+=data;
  el.dispatchEvent(e);
  await sleep(1);
}

// Opens a new tab for searching
async function openNewSearchWindow() {
  let url='http://www.google.com/';
  mySearchWindow=await window.open(url,'theSearchWindow',"width=800,height=1200,left=1200,top=10");
}

// Returns search tab to main google search
async function refreshSearchWindow() {
  let url='http://www.google.com/';
  mySearchWindow.focus();
  mySearchWindow=await window.open(url,'theSearchWindow');
}

// Google search for passed terms
async function searchGoogle(term1,term2,term3)
{
 // debugger;
  // query=term1+'+'+term2+'+'+term3;
  
//  await setTimeout(()=>{
 //   debugger;
  await sleep(3);
    mySearchWindow.document.body.style.backgroundColor='#660000';
    let div = mySearchWindow.document.createElement('div');
    textNode = mySearchWindow.document.createTextNode('Test in Progress');
    div.className = "alert";
    div.innerHTML = "<h3><strong>***</strong> TEST IN PROGRESS <strong>***</strong></h3>";
    div.setAttribute('style',"background-color:black;color:yellow;border:1em solid black;border-radius:5%;width:100%;padding:1em;text-align:center");
    let googleLogo=mySearchWindow.document.querySelector("div.k1zIA.rSk4se");
    googleLogo.parentNode.insertBefore(div,googleLogo);
//    mySearchWindow.document.body.append(div);
//  },3000);

  // Wait for the "Related searches" section at the bottom of the page
  //var elm = await waitForElm('.q8U8x');
  var elm=await waitForElm('.YyVfkd');
//  mySearchWindow.onload = async function() {
 //   debugger;
  await sleep(3);
 //   setTimeout(()=>{
 //     debugger;
      mySearchWindow.focus();
      
      mySearchWindow.document.querySelector(".gLFyf").focus();

      // Get element
      var el=mySearchWindow.document.querySelector('input.gLFyf.gsfi');

      // Add an event listener for the 'input' event, to prove it's working
      el.addEventListener('input', e => {
        //  console.log(`${e.inputType}: ${e.data}`)
        // writeLogWindow(`${e.inputType}: ${e.data}`);
        sleep(1);
      });

      queryTypedStr=term1+' '+term2+' '+term3+'\n';
      writeLogWindow(' --- Typing '+queryTypedStr+' into the search input bar.');
      mySearchWindow.document.querySelector('input.gLFyf.gsfi').click();
      // Example "typeInto" usage: call for each letter in the string below
      queryTypedStr.split('').forEach(async letter => {
        typeInto(el, letter);
        await sleep(2);
      });

      writeLogWindow(' --- Clicking on the Search button.');
      mySearchWindow.document.querySelector('input.gNO89b').click();
//    },3000);
//  };
  
//  debugger;
  mySearchWindow.document.body.style.backgroundColor='#662200';
  await writeLogWindow(' --- Attempting to click on a link');
  await sleep(3);
    
  // Wait for the "1" in the bottom "Google" pages section
  var elm2=await waitForElm('.YyVfkd');
//  mySearchWindow.onload = async function() {
//    setTimeout(()=>{
      mySearchWindow.focus();
      newLink = mySearchWindow.document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].href;
      writeLogWindow(' --- [Search: '+queryTypedStr+'] Following this link with a mouse click:');
      writeLogWindow(' ---- '+newLink);
      mySearchWindow.document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].click();
//    },3000);
//  };
    
  await sleep(5);
//  mySearchWindow.document.body.style.backgroundColor='#555555';

}

// Idles for 60 seconds
async function stopIdle() {
  await writeLogWindow('SearchBot is idle.  Waiting 60 seconds...');
  await sleep(60);
  
  return;
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

// Main loop
async function main() {
  //debugger;
  const numIterations=2;
  
  await openLogWindow();
  
  await writeLogWindow('*******************************');
  await writeLogWindow('*** SearchBot v1.0 Started! ***');
  await writeLogWindow('*******************************');
  
  await openNewSearchWindow();
  await writeLogWindow(' - New search window opened.');
  
  for(let i=0;i<numIterations;i++) {
    await writeLogWindow(' - Iteration '+i+' of '+numIterations+' beginning.');
    let randomInteger1=randomIntFromInterval(0,16);
    let randomInteger2=randomIntFromInterval(0,16);
    let randomInteger3=randomIntFromInterval(0,16);

    let queryWord1=searchTerms[randomInteger1];
    let queryWord2=searchTerms[randomInteger2];
    let queryWord3=searchTerms[randomInteger3];

    await writeLogWindow(' -- Searching for: '+queryWord1+' '+queryWord2+' '+queryWord3);
    await searchGoogle(queryWord1,queryWord2,queryWord3);
    await writeLogWindow(' -- Search complete!');

    await writeLogWindow(' - Iteration '+i+' of '+numIterations+' ended.');
    
    let randomSeconds=randomIntFromInterval(3,15);
    await writeLogWindow(' - Delaying a random '+randomSeconds+' seconds...');
    await sleep(randomSeconds);
    
    await writeLogWindow(' - Refreshing search window back to google main search.');
    await refreshSearchWindow();
    await sleep(randomSeconds);
  }

//  await writeLogWindow(' - All iterations completed.  Going into idle loop.');
  await writeLogWindow(' - All iterations completed.  Done.');
  return;
//  while(1 == 1) { await stopIdle(); }
}

// Begin
main();


//////////////////////////////////////////////////////////////////////////////////////////////
/// This section is full of piecesparts that did not work well, but could prove useful to me
/// in the future.  You can safely ignore/delete it all.
//////////////////////////////////////////////////////////////////////////////////////////////

/*
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

  const elm = await waitForElm('.q8U8x');
  mySearchWindow.onload = async function() {
    newLink = mySearchWindow.document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].href;
    //  console.log('Following link: '+newLink);
    await writeLogWindow('[Search: '+query+'] Following link with a mouse click => '+newLink);
    mySearchWindow.document.querySelector("div.NJo7tc.Z26q7c.jGGQ5e>div").getElementsByTagName('a')[0].click();
  };

//  mySearchWindow.document.links[0].style.border = "5px solid red";
  
//  const links = mySearchWindow.document.links;
//  let text = "";
//  for (let i = 0; i < links.length; i++) {
//    text += links[i].href + "<br>";
}
*/

/*
function navigate(href, newTab) {
   var a = document.createElement('a');
   a.href = href;
   if (newTab) {
      a.setAttribute('target', '_blank');
   }
   a.click();
}
*/

/*
function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}
*/

/*
function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}
*/


//      mySearchWindow.document.querySelector("gLFyf gsfi").getElementsByTagName('a')[0].click();
      
      /*
      mySearchWindow.document.addEventListener('keydown', (e) => {writeLogWindow(e.key+' down')});
      mySearchWindow.document.addEventListener('keyup', (e) => {writeLogWindow(e.key+' up')});

      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'a'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'b'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'c'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'd'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'e'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'e'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'f'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'f'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
      mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Enter'}));
      */

//    typeInto(el,'\r\n');
//    mySearchWindow.document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
//    mySearchWindow.document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Enter'}));







