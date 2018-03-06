import {Option} from '../src/Option';

class PetType {
  static readonly DOG = 'DOG';
  static readonly CAT = 'CAT';
}

class Pet {
  type: PetType;

  private energy = [] as number[];

  constructor(public name: string) {}

  eat(food: number) {
    this.energy.push(food);
  }
}

const blueTheCat = new Pet('Blue');
class Family {
  private food = [1, 1, 1, 1];
  private secretStash = 1;

  constructor(public pet: Option<Pet>) {

  }

  feedCats() {
    this.pet
      .filter(pet => pet.type === PetType.CAT)
      .forEach(this.feedPet.bind(this));
  }

  callPet() {
    console.log(this.pet.map(p => p.name));
  }

  feedBlue() {
    this.pet
      .filterValue(blueTheCat)
      .forEach(this.feedPet.bind(this));
  }

  feedNotBlue() {
    this.pet
      .filterNotValue(blueTheCat)
      .forEach(this.feedPet.bind(this));
  }

  getFood(): Option<number> {
    return Option.fromNullable(this.food.pop()); // or Option.pop(this.food)
  }

  getFoodOrSecretStashFood(): Option<number> {
    return this.getFood().orElse(Option.of(this.secretStash));
  }

  buyFood() {
    // decrement money
    return 1;
  }

  feedPet(pet: Pet) {
    // example feed 1
    pet.eat(this.getFood().orThrow('No more food'));
    // example feed 2
    pet.eat(this.getFood().orCall(this.buyFood));
    // example feed 3
    pet.eat(this.getFood().or(this.secretStash));
    // example feed 4 not preferred since it is not as functional, but in certain instances can be helpful
    const food = this.getFood();
    if (food.isPresent()) { // or !food.isAbsent()
      pet.eat(food.get()); // will throw if empty
    } else {
      pet.eat(this.secretStash);
    }
  }

  hasCat(): boolean {
    return this.pet.exists(p => p.type === PetType.CAT);
  }

  hasBlue(): boolean {
    return this.pet.contains(blueTheCat);
  }
}

class Groomer {
  private waitingRoom = [new Family(Option.of(blueTheCat))];
  private kennel = [blueTheCat, new Pet('Merlin')];

  groomPetFromWaitingRoom() {
    Option.pop(this.waitingRoom) // or  Option.fromNullable(this.waitingRoom.pop());
      .flatMap(f => f.pet)
      .forEach(this.groom);
  }

  findBlue(): Option<Pet> {
    return Option.find(this.kennel, (p => p.name === 'Blue'));
  }

  private groom() {}
}
