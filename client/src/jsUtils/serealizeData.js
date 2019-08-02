var serealiseFun = function(squadArray, teamName) {
    var promise = new Promise(function(resolve, reject){
        squadArray.forEach(function(element) {
            element.team = teamName;
          });
          resolve(squadArray);
    });
    return promise;
 };

 export default serealiseFun;