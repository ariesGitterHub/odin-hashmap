class HashMap {
  constructor(capacity = 17, staticLoadFactor = 0.75) {
    this.capacity = capacity;
    this.staticLoadFactor = staticLoadFactor;
    this.table = new Array(capacity);
    this.numItems = 0;
    this.currentLoadFactor = 0;
  }

  mapHash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }
  set(key, value) {
    if (typeof key !== "string" || typeof value !== "string") {
      throw new Error("The variable is not a string");
    }
    const index = this.mapHash(key);
    if (index < 0 || index >= this.table.length) {
      throw new Error("Trying to access index out of bounds");
    }
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          this.table[index][i][1] = value;
          return;
        }
      }
      this.table[index].push([key, value]);
    } else {
      this.table[index] = [[key, value]];
    }
    this.numItems++;
    this.currentLoadFactor = this.numItems / this.capacity;
    this.resizeCapacityUp();
  }

  get(key) {
    const index = this.mapHash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          console.log(
            `get() -> [key: ${key}, value: ${this.table[index][i][1]}].`
          );
          return this.table[index][i][1];
        }
      }
    }
    console.log(`get() -> [key: ${key}] was not found.`);
    return null;
  }

  has(key) {
    const index = this.mapHash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          console.log(`has() -> [key: ${key}] found.`);
          return true;
        }
      }
    }
    console.log(`has() -> [key: ${key}] was not found.`);
    return false;
  }

  remove(key) {
    const index = this.mapHash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          this.table[index].splice(i, 1);
          if (this.table[index].length === 0) {
            delete this.table[index];
          }

          this.numItems--;
          this.currentLoadFactor = this.numItems / this.capacity;
          this.resizeCapacityDown();
          console.log(
            `remove() -> key-value pair linked to [key: ${key}] was removed`
          );
          return true;
        }
      }
    }

    console.log(`remove() -> [key: ${key}] was not found.`);
    return false;
  }

  countAllKeys() {
    let count = 0;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        count += this.table[i].length;
      }
    }
    console.log(`countAllKeys() -> number of stored keys = ${count}`);
    return count;
  }

  countAllBuckets1() {
    console.log(
      `countAllBuckets1() -> number of buckets = ${
        Object.keys(this.table).length
      }`
    );
    return Object.keys(this.table).length;
  }

  countAllBuckets2() {
    let count = 0;
    for (let i in this.table) {
      if (this.table[i]) {
        count++;
      }
    }
    console.log(`countAllBuckets2() -> number of buckets = ${count}`);
    return count;
  }

  clear() {
    let count = 0;
    let holderNumItems = this.numItems;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        count++;
        this.numItems--;
        delete this.table[i];
      }
    }
    this.currentLoadFactor = this.numItems / this.capacity;
    this.resizeCapacityDown();
    return console.log(
      `clear() -> buckets deleted = ${count}; items deleted = ${holderNumItems}`
    );
  }

  keys() {
    let keysArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        keysArr.push(...this.table[i].map((entry) => entry[0]));
      }
    }
    console.log(`keys() -> key list: ${keysArr}`);
    return keysArr;
  }

  values() {
    let valuesArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        valuesArr.push(...this.table[i].map((entry) => entry[1]));
      }
    }
    console.log(`values() -> value list: ${valuesArr}`);
    return valuesArr;
  }

  keyValues() {
    let keyValuesArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        keyValuesArr.push(...this.table[i]);
      }
    }
    console.log(`keyValues() -> key-values list: ${keyValuesArr}`);
    return keyValuesArr;
  }

  resizeCapacityUp() {
    if (this.numItems / this.capacity >= this.staticLoadFactor) {
      console.log(
        `Resizing up. Current load factor: ${
          this.numItems / this.capacity
        } (Expansion threshold: 0.75)`
      );
      this.capacity *= 2;
      const newTable = new Array(this.capacity);
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i]) {
          for (let j = 0; j < this.table[i].length; j++) {
            const [key, value] = this.table[i][j];
            const newIndex = this.mapHash(key);
            if (!newTable[newIndex]) {
              newTable[newIndex] = [];
            }
            newTable[newIndex].push([key, value]);
          }
        }
      }
      this.table = newTable;
      this.currentLoadFactor = this.numItems / this.capacity;
      console.log(`Capacity increased to ${this.capacity}.`);
    }
  }

  resizeCapacityDown() {
    if (this.numItems / this.capacity < 0.25 && this.capacity > 17) {
      console.log(
        `Resizing down. Current load factor: ${
          this.numItems / this.capacity
        } (Reduction threshold: 0.25)`
      );
      this.capacity = Math.floor(this.capacity / 2);
      const newTable = new Array(this.capacity);
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i]) {
          for (let j = 0; j < this.table[i].length; j++) {
            const [key, value] = this.table[i][j];
            const index = this.mapHash(key);
            if (!newTable[index]) {
              newTable[index] = [];
            }
            newTable[index].push([key, value]);
          }
        }
      }
      this.table = newTable;
      this.currentLoadFactor = this.numItems / this.capacity;
      console.log(`Capacity decreased to ${this.capacity}.`);
    }
  }
}

// Test Your Hash Map

// 1. Create a new JavaScript file. IGNORING THIS.

// 2. Create a new instance of your hash map and set the load factor to be 0.75 (already set to this in the class).

// 3. Populate your hash map using the set(key, value) method by copying the following:
const test = new HashMap();
test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");

// 4. After populating your hash map with the data above, your hash map’s current load levels should now be at 0.75 (full capacity). THIS IS TRUE.

// 5. Now with a full hash map, try overwriting a few nodes using set(key, value). This should only overwrite the existing values of your nodes and not add new ones, so length() should still return the same value and capacity should remain the same.

test.set("kite", "RAINBOW"); // THIS OVERWRITES PROPERLY
test.set("lion", "TAWNY"); // SAME

// 6. After that, populate your hash map with the last node below. This will make your load levels exceed your load factor, triggering your hash map’s growth functionality and doubling its capacity:

test.set("moon", "silver");

// 7. If you have implemented your hash map correctly, the load levels of your expanded hash map should drop well below your load factor, and the entries should be spread evenly among the expanded buckets. THIS WORKS.

// 8. With your new hash map, try overwriting a few nodes using set(key, value). Again, this should only overwrite existing values of your nodes.

test.set("ice cream", "SANDWICH"); // THIS OVERWRITES PROPERLY
test.set("hat", "BEANIE"); // SAME

// 9. Test the other methods of your hash map, such as get(key), has(key), remove(key), length(), clear(), keys(), values(), and entries(), to check if they are still working as expected after expanding your hash map. NOTE -> I changed some of these helper function names.

// console.log(test.set(1, "1")); // Correctly throws an error if input is not a string

console.log(test.get("tiger"));

test.set("zebra", "STRIPED");
console.log(test.get("zebra"));
console.log(test.has("zebra"));

console.log(test.remove("zebra"));
console.log(test.get("zebra"));
console.log(test.has("zebra"));

console.log(test.countAllKeys());
console.log(test.countAllBuckets1());
console.log(test.countAllBuckets2());

console.log(test.keys());

console.log(test.values());

console.log(test.keyValues());

test.set("messy monkey", "stinky");
test.set("nosey narwal", "spiky");
test.set("obscured octopus", "inky");

console.log(test.keys());
console.log(test.keyValues());
test.countAllKeys();
test.countAllBuckets2();

test.clear();


// Extra Credit
// Create a HashSet class or factory function that behaves the same as a HashMap but only contains keys with no values.

class HashSet {
  constructor(capacity = 17, staticLoadFactor = 0.75) {
    this.capacity = capacity;
    this.staticLoadFactor = staticLoadFactor;
    this.table = new Array(capacity);
    this.numItems = 0;
    this.currentLoadFactor = 0;
  }

  setHash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  add(key) {
    if (typeof key !== "string") {
      throw new Error("The variable is not a string");
    }
    const index = this.setHash(key);
    if (index < 0 || index >= this.table.length) {
      throw new Error("Trying to access index out of bounds");
    }
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i] === key) {
          console.log(`[key: ${key}] already exists in the table`);
          return;
        }
      }
      this.table[index].push(key);
    } else {
      this.table[index] = [key];
    }
    this.numItems++;
    this.currentLoadFactor = this.numItems / this.capacity;

    this.resizeCapacityUp();
  }

  has(key) {
    const index = this.setHash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i]) {
          console.log(`has() -> [key: ${key}] found.`);
          return true;
        }
      }
    }
    console.log(`has() -> [key: ${key}] was not found.`);
    return false;
  }

  remove(key) {
    const index = this.setHash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i] === key) {
          this.table[index].splice(i, 1);
          if (this.table[index].length === 0) {
            delete this.table[index];
          }
          this.numItems--;
          this.currentLoadFactor = this.numItems / this.capacity;
          this.resizeCapacityDown();
          console.log(`remove() -> [key: ${key}] was removed`);
          return true;
        }
      }
    }

    console.log(`remove() -> [key: ${key}] was not found.`);
    return false;
  }

  countAllKeys() {
    let count = 0;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        count += this.table[i].length;
      }
    }
    console.log(`countAllKeys() -> number of stored keys = ${count}`);
    return count;
  }

  countAllBuckets1() {
    console.log(
      `countAllBuckets1() -> number of buckets = ${
        Object.keys(this.table).length
      }`
    );
    return Object.keys(this.table).length;
  }

  countAllBuckets2() {
    let count = 0;
    for (let i in this.table) {
      if (this.table[i]) {
        count++;
      }
    }
    console.log(`countAllBuckets2() -> number of buckets = ${count}`);
    return count;
  }

  clear() {
    let count = 0;
    let holderNumItems = this.numItems;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        count++;
        this.numItems--;
        delete this.table[i];
      }
    }
    this.currentLoadFactor = this.numItems / this.capacity;
    this.resizeCapacityDown();
    return console.log(
      `clear() -> buckets deleted = ${count}; items deleted = ${holderNumItems}`
    );
  }

  keys() {
    let keysArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        keysArr.push(...this.table[i]);
      }
    }
    console.log(`keys() -> key list: ${keysArr}`);
    return keysArr;
  }

  resizeCapacityUp() {
    if (this.numItems / this.capacity >= this.staticLoadFactor) {
      console.log(
        `Resizing up. Current load factor: ${
          this.numItems / this.capacity
        } (Expansion threshold: 0.75)`
      );
      this.capacity *= 2;
      const newTable = new Array(this.capacity);
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i]) {
          for (let j = 0; j < this.table[i].length; j++) {
            const key = this.table[i][j];
            const newIndex = this.setHash(key);
            if (!newTable[newIndex]) {
              newTable[newIndex] = [];
            }
            newTable[newIndex].push(key);
          }
        }
      }
      this.table = newTable;
      this.currentLoadFactor = this.numItems / this.capacity;
      console.log(`Capacity increased to ${this.capacity}.`);
    }
  }

  resizeCapacityDown() {
    if (this.numItems / this.capacity < 0.25 && this.capacity > 17) {
      console.log(
        `Resizing down. Current load factor: ${
          this.numItems / this.capacity
        } (Reduction threshold: 0.25)`
      );
      this.capacity = Math.floor(this.capacity / 2);
      const newTable = new Array(this.capacity);
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i]) {
          for (let j = 0; j < this.table[i].length; j++) {
            const key = this.table[i][j];
            const index = this.setHash(key);
            if (!newTable[index]) {
              newTable[index] = [];
            }
            newTable[index].push(key);
          }
        }
      }
      this.table = newTable;
      this.currentLoadFactor = this.numItems / this.capacity;
      console.log(`Capacity decreased to ${this.capacity}.`);
    }
  }
}

console.log("EXTRA CREDIT STARTS HERE...");

const testSet = new HashSet();
testSet.add("ari01");
testSet.add("tau02");
testSet.add("gem03");
testSet.add("can04");
testSet.add("leo05");
testSet.add("vir06");
testSet.add("lib07");
testSet.add("oph13th");
testSet.add("sco08");
testSet.add("sag09");
testSet.add("cap10");
testSet.add("aqu11");
testSet.add("pis12");

testSet.add("astrologyIsDumb");
testSet.has("astrologyIsDumb");
testSet.add("astrologyIsDumb");

testSet.has("oph13th");
testSet.remove("oph13th");
testSet.has("oph13th");

testSet.countAllKeys();
testSet.countAllBuckets2();
console.log(testSet.keys());

console.log(testSet);

// testSet.clear();
// console.log(testSet);
