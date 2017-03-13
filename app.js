(function () {
'use strict';

var app = angular.module('FishShopApp', [])
.controller('FishShopController', FishShopController)
.service('FishService', FishService)
.constant('ApiBasePath', "https://fishshop.attest.tech");
//CORS
app.config(['$httpProvider', function ($httpProvider) {
   $httpProvider.defaults.useXDomain = true;
   delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

FishShopController.$inject = ['FishService','$scope'];
function FishShopController(FishService, $scope) {
  var shop = this;
  shop.shopFish = ['american_crayfish','barreleye','batfish','battered_cod','betta_splendens','bonnethead','cichlids','cleaner_shrimp','cocoa_damselfish','coelocanth','cookiecutter',
                    'cuttlefish','damselfish','dragon_wrasse','electrophorus','elephant_seal','elvers','fanfin_seadevil','fish_fingers','french_angel_fish','hammerhead','harlequin_shrimp',
                    'hawksbill_turtle','megalodon','minnow','neon_tetra','oarfish','painted_lobster','prawn_cocktail','psychedelic_frogfish','robocod','salmon_shark','sand_eel','sea_lion','shortfin_mako_shark',
                    'slipper_lobster','sockeye_salmon','spanish_hogfish','spinner_dolphin','stauroteuthis','stingray','sunstar','symphysodon','torquigener'];
  shop.tank = [];
  shop.canLiveTogether = false;
  shop.message = '';

  shop.checkCompatibilityAndAction = function (fish, action, actionParam) {

    var promise = FishService.compatibility(fish);
    promise.then(function (response) {
        shop.message = response;
        //if the response is a straightforward true or false then we can update the user
        if(shop.message===true || shop.message===false){
          shop.canLiveTogether = shop.message;
          //there will be an action to perform now (either add or remove)
          //we only perform action after checking compatibility so that we don't perform in error condition
          action(actionParam);

          //if we just removed last fish then we don't need a message
          if(shop.message && shop.tank.length==0){
            shop.message = '';
          } else{  //otherwise set message based on response
            shop.message = (shop.message? 'Chosen fish are compatible.' : 'Fish are not compatible, change selections before purchase.');
          }
        }
    })
    .catch(function (error) {
      console.log("Problem with compatibility server call "+error);
      //if we've got access to a detailed error from the API then use it but we may not have access
      if(error!==null && error.data!==null && error.data.errorMessage!==null){
        shop.message = error.data.errorMessage;
      } else{
        shop.message = 'Technical issue, please try again. If problem persists consider another fish or contact store.';
      }
    });

  };

  shop.removeItem = function (itemIndex) {
    //remove from tank but check compatibility first
    //this way the item won't go into tank if there's an error
    var fish = shop.tank.slice();
    fish.splice(itemIndex, 1);

    //compatible now? check and perform action if so
    shop.checkCompatibilityAndAction(fish,shop.performRemove,itemIndex);

  };

  //the action to actually remove a fish from the tank
  shop.performRemove = function(itemIndex){
    shop.tank.splice(itemIndex, 1);
  };


  shop.addItem = function(itemIndex) {
    if(shop.duplicateCheck(shop.tank,shop.shopFish[itemIndex])){
      shop.message = shop.message+' Note - '+shop.shopFish[itemIndex]+' already in tank!';
      return;
    }

    //add to tank from shop but check compatibility first
    //this way the item won't go into tank if there's an error
    var fish = shop.tank.slice();
    fish.push(shop.shopFish[itemIndex]);

    //compatible now? check and perform action if so
    shop.checkCompatibilityAndAction(fish,shop.performAdd,itemIndex);

  };

  //the action to actually add a fish to the tank
  shop.performAdd = function(itemIndex){
    shop.tank.push(shop.shopFish[itemIndex]);
  };


  //duplicate check function used to ensure we don't get dup fish in tank
  shop.duplicateCheck = function(array, item){
    for(var i=0;i<array.length;i++){
      if(array[i] === item){
        return true;
      }
    }
    return false;
  };

  //give ng-click access to the alert function
  $scope.alert = alert.bind(window);
}


FishService.$inject = ['$http', 'ApiBasePath'];
function FishService($http, ApiBasePath) {
  var service = this;

  //do compability checks

  service.compatibility = function (fish) {
     return $http({
        method: "POST",
        url: (ApiBasePath + "/compatibility"),
        data: { 'fish' : fish },
        headers: {
                    'Content-Type': 'application/json; charset=utf-8'
        }
     }).then(function (result) {

       return result.data.canLiveTogether;
     })
     .catch(function(e) {
        throw e;
    }).finally(function() {
      //empty block
    });
   };

}

})();
