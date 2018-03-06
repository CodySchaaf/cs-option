"use strict";
exports.__esModule = true;
var Option_1 = require("../src/Option");
var PetType = (function () {
    function PetType() {
    }
    return PetType;
}());
PetType.DOG = 'DOG';
PetType.CAT = 'CAT';
var Pet = (function () {
    function Pet(name) {
        this.name = name;
        this.energy = [];
    }
    Pet.prototype.eat = function (food) {
        this.energy.push(food);
    };
    return Pet;
}());
var blueTheCat = new Pet('Blue');
var Family = (function () {
    function Family(pet) {
        this.pet = pet;
        this.food = [1, 1, 1, 1];
        this.secretStash = 1;
    }
    Family.prototype.feedCats = function () {
        this.pet
            .filter(function (pet) { return pet.type === PetType.CAT; })
            .forEach(this.feedPet.bind(this));
    };
    Family.prototype.callPet = function () {
        console.log(this.pet.map(function (p) { return p.name; }));
    };
    Family.prototype.feedBlue = function () {
        this.pet
            .filterValue(blueTheCat)
            .forEach(this.feedPet.bind(this));
    };
    Family.prototype.feedNotBlue = function () {
        this.pet
            .filterNotValue(blueTheCat)
            .forEach(this.feedPet.bind(this));
    };
    Family.prototype.getFood = function () {
        return Option_1.Option.fromNullable(this.food.pop()); // or Option.pop(this.food)
    };
    Family.prototype.getFoodOrSecretStashFood = function () {
        return this.getFood().orElse(Option_1.Option.of(this.secretStash));
    };
    Family.prototype.buyFood = function () {
        // decrement money
        return 1;
    };
    Family.prototype.feedPet = function (pet) {
        // example feed 1
        pet.eat(this.getFood().orThrow('No more food'));
        // example feed 2
        pet.eat(this.getFood().orCall(this.buyFood));
        // example feed 3
        pet.eat(this.getFood().or(this.secretStash));
        // example feed 4 not preferred since it is not as functional, but in certain instances can be helpful
        var food = this.getFood();
        if (food.isPresent()) {
            pet.eat(food.get()); // will throw if empty
        }
        else {
            pet.eat(this.secretStash);
        }
    };
    Family.prototype.hasCat = function () {
        return this.pet.exists(function (p) { return p.type === PetType.CAT; });
    };
    Family.prototype.hasBlue = function () {
        return this.pet.contains(blueTheCat);
    };
    return Family;
}());
var Groomer = (function () {
    function Groomer() {
        this.waitingRoom = [new Family(Option_1.Option.of(blueTheCat))];
        this.kennel = [blueTheCat, new Pet('Merlin')];
    }
    Groomer.prototype.groomPetFromWaitingRoom = function () {
        Option_1.Option.pop(this.waitingRoom) // or  Option.fromNullable(this.waitingRoom.pop());
            .flatMap(function (f) { return f.pet; })
            .forEach(this.groom);
    };
    Groomer.prototype.findBlue = function () {
        return Option_1.Option.find(this.kennel, (function (p) { return p.name === 'Blue'; }));
    };
    Groomer.prototype.groom = function () { };
    return Groomer;
}());
