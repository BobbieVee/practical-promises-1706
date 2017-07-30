'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  Promise.all([promisifiedReadFile('poem-two/stanza-01.txt'), promisifiedReadFile('poem-two/stanza-02.txt') ])
  .then( results => {
    results.forEach( stanza => {
      blue(stanza);
    })
  })
  .catch(e => magenta(e))
  .then(() => console.log('-- A. promise version done --'));

}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
  //   return 'poem-two/' + 'stanza-0' + n + '.txt';
  // });

  // // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version

  var promises = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return promisifiedReadFile('poem-two/' + 'stanza-0' + n + '.txt');
  });

  Promise.all(promises)
  .then( results => {
    results.forEach( stanza => {
      blue(stanza);
    })
  })
  .catch(e => magenta(e))
  .then(() => console.log('-- A. promise version done --'));


}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  // var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
  //   return 'poem-two/' + 'stanza-0' + n + '.txt';
  // });

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  var promises = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return promisifiedReadFile('poem-two/' + 'stanza-0' + n + '.txt');
  });

  Promise.each(promises, (stanza) => blue(stanza))
  .catch(e => magenta(e))
  .then(() => console.log('-- A. promise version done --'));
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  // var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
  //   return 'poem-two/' + 'stanza-0' + n + '.txt';
  // });
  // var randIdx = Math.floor(Math.random() * filenames.length);
  // filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  var promises = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return promisifiedReadFile('poem-two/' + 'stanza-0' + n + '.txt');
  });

  var randIdx = Math.floor(Math.random() * promises.length);
  promises[randIdx] = promisifiedReadFile('wrong-file-name-' + (randIdx + 1) + '.txt');

  Promise.filter(promises, (stanza) => blue(stanza))
  .catch(e => magenta(e))
  .then(() => console.log('-- A. promise version done --'));

  // Promise.all(promises)
  // .then((stanza) => blue(stanza))
  // .catch(e => magenta(e))
  // .then(() => console.log('-- A. promise version done --'));



}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    return new Promise(function(resolve, reject){
      fs.writeFile(filename, str, function(err, data){
        if (err) return reject(err)
        resolve(data);
      })
    })
  }

  promisifiedWriteFile('test1.txt', 'hey')
  .then( results => blue('the file has been saved'))
  .catch( err => magenta(err));
}
