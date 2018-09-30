#!/usr/bin/env node

var cl = require('../lib/cl.js');
var program = require('commander');
const features = require ('./features.js');
var fs = require('fs');
var colors = require('colors');
const rp = require('request-promise');
const cheerio = require('cheerio');



/**
 * Functions that i couldn't export
 */


//Returns the head of the selected repo


function getPresentHead(keyname){
    //default path
    var path = features.repo[""+keyname][1]+"/.git"

    var branch = (fs.readFileSync(path+"/HEAD")).toString().split('/')[2].trim();
    var ref = (fs.readFileSync(path+"/refs/heads/"+ branch)).toString();

    branch = (branch.green);
    return branch + ':' + ref;
}


// //fethes the head of the selected repo
// function fetchHead(keyname){
//     var url = features.repo[""+keyname][0]+"/.git";
//     return request(url)
//         .then( heads =>{
//             let references = _headfetcher(url)
//         }
//     )

// }

function _headfetcher(keyname){
    var path = features.repo[""+keyname][1]+"/.git"
    var branch = (fs.readFileSync(path+"/HEAD")).toString().split('/')[2].trim();

    const options = {
    uri: features.repo[keyname][0]+"/commits/"+branch,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  rp(options)
  .then(($) => {
     var heads = [];
    $('clipboard-copy').each(function(i, elem) {
        heads[i] = $(this).attr('value')+'\n';
        heads[i].replace(",",'');
      });

      /**
       * if reference of top == head
       * var message = ("NO PULL REQUIRED".yellow)+"\n\n"+heads.toString();
       * else
       * var message = ("PULL REQUIRED".yellow)+"\n\n"+heads.toString();
    */
    cl.warn(message)
  })
  .catch((err) => {
    cl.err(err);
  });

}



/**
 * -l --list -> Lists down all the repositories from the repo.json
 * -h --head -> Gets the local head of the repo selected path to be defined in repo.json
 * -f --fetch -> Fetches the head of the repo selected
 * -a --autor -> Displays the author
 */
program
    .version('0.0.1', '-v' , '--version')
    .option('-l, --list', 'The available repo in repo.json are')
    .option('-h, --head <keyname>', 'Get the head of the selected repo')
    .option('-f, --fetch <keyname>', 'Fetches the repo head currently works for public repo only')
    .option('-a, --author', 'Show the author')
    .parse(process.argv);

/**
 * Logic of all the program here
 */

if(program.list)
    cl.act(features.getListOfRepoAvailable)

else if(program.head){
    cl.act(getPresentHead(program.head))
}

else if(program.fetch){
    _headfetcher(program.fetch);
}
else if(program.author){
    cl.act("aesher9o1".yellow);
}
