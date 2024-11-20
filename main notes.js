// JavaScript's built-in Map object -- part of the ES6 (ECMAScript 2015) standard.
// NOTE -> Map is a more optimal and cleaner approach.

let myHashMap = new Map(); // Creates the hash map

myHashMap.set("apple", "fruit"); // Sets up a key-value pair
myHashMap.set("carrot", "vegetable"); // Another pair

let category = myHashMap.get("apple");

console.log(category); // fruit

class HashMap {
  constructor(capacity = 17, staticLoadFactor = 0.75) {
    // Make the capacity a prime number to reduce the chance of collisions, especially as the hash map grows. Prime numbers are known to help with the distribution of hash values.
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
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity; // For very long keys, the hash code will exceed the maximum integer value allowed by JavaScript. Once that happens, calculations become inaccurate, and the chance of collisions significantly increases. One way to avoid this issue is to apply the modulo % operator on each iteration instead of outside the loop at the end
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
          // Key exists, update value
          this.table[index][i][1] = value;
          return;
        }
      }
      // If key doesn't exist, push the new key-value pair
      this.table[index].push([key, value]);
    } else {
      this.table[index] = [[key, value]];
    }

    this.numItems++;
    this.currentLoadFactor = this.numItems / this.capacity; // Recalculate the load factor

    // Resize up if necessary
    this.resizeCapacityUp();
  }

  // get(key) takes one argument as a key and returns the value that is assigned to this key. If a key is not found, return null.
  get(key) {
    const index = this.mapHash(key);
    // Check if there is an array at the calculated index
    if (this.table[index]) {
      // Loop through the array at that index (for collision resolution)
      for (let i = 0; i < this.table[index].length; i++) {
        // Check if the key at this position matches the key sought for
        if (this.table[index][i][0] === key) {
          console.log(
            `get() -> [key: ${key}, value: ${this.table[index][i][1]}].`
          );
          return this.table[index][i][1]; // Return the value associated with the key
        }
      }
    }
    console.log(`get() -> [key: ${key}] was not found.`);
    return null; // Return null here so loop can finish first
  }

  // has(key) takes a key as an argument and returns true or false based on whether or not the key is in the hash map.
  has(key) {
    const index = this.mapHash(key);
    // Check if there is an array at the calculated index
    if (this.table[index]) {
      // Loop through the array at that index (for collision resolution)
      for (let i = 0; i < this.table[index].length; i++) {
        // Check if the key at this position matches the key we're looking for
        if (this.table[index][i][0] === key) {
          console.log(`has() -> [key: ${key}] found.`);
          return true; // Return the value associated with the key
        }
      }
    }
    console.log(`has() -> [key: ${key}] was not found.`);
    return false; // Return null here so loop can finish first
  }

  // remove(key) takes a key as an argument. If the given key is in the hash map, it should remove the entry with that key and return true. If the key isn’t in the hash map, it should return false.
  remove(key) {
    const index = this.mapHash(key);
    // Check if there is an array at the calculated index
    if (this.table[index]) {
      // Loop through the array at that index (for collision resolution)
      for (let i = 0; i < this.table[index].length; i++) {
        // Check if the key at this position matches the key we're looking for
        if (this.table[index][i][0] === key) {
          // Remove the key-value pair by splicing the array
          this.table[index].splice(i, 1); // Removes the key-value pair at index i

          if (this.table[index].length === 0) {
            // If the bucket is now empty, set it to undefined <-- NO! DELETE IT!
            // this.table[index] = undefined;
            delete this.table[index];
          }

          this.numItems--; // Decrement numItems as entry is removed
          this.currentLoadFactor = this.numItems / this.capacity; // Recalculate the load factor
          this.resizeCapacityDown(); // Resize down if necessary
          console.log(
            `remove() -> key-value pair linked to [key: ${key}] was removed`
          );
          return true;
        }
      }
    }

    console.log(`remove() -> [key: ${key}] was not found.`);
    return false; // Return null here so loop can finish first
  }

  // length() returns the number of stored keys in the hash map.
  // Renamed this to "countAllKeys" to avoid confusion in terms, as I gravitate to thinking of length in terms of counting buckets
  countAllKeys() {
    let count = 0;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        count += this.table[i].length; // Add the number of key-value pairs in this bucket
      }
    }
    console.log(`countAllKeys() -> number of stored keys = ${count}`);
    return count;
  }

  // Not in project brief, but I added two ways of counting buckets below
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

  // clear() removes all entries in the hash map. Instead of directly setting this.table to a new array or [] to reset the table, I wanted to be able to log what what deleted by iterating over everything prior to deletion. I might change this. Fine for now and so noted.
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
    this.currentLoadFactor = this.numItems / this.capacity; // Recalculate the load factor
    this.resizeCapacityDown(); // Resize down if necessary
    return console.log(
      `clear() -> buckets deleted = ${count}; items deleted = ${holderNumItems}`
    );
  }

  // keys() returns an array containing all the keys inside the hash map.

  // Old code...
  // keys() {
  //   let keysArr = [];
  //   for (let i = 0; i < this.table.length; i++) {
  //     if (this.table[i]) {
  //       for (let j = 0; j < this.table[i].length; j++) {
  //         keysArr.push(this.table[i][j][0]);
  //       }
  //     }
  //   }
  //   console.log(`keys() -> key list: ${keysArr}`);
  //   return keysArr;
  // }

  // Better code..
  keys() {
    let keysArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        // Use map to extract the keys from each bucket, then flatten the result
        keysArr.push(...this.table[i].map((entry) => entry[0]));
      }
    }
    console.log(`keys() -> key list: ${keysArr}`);
    return keysArr;
  }

  // values() returns an array containing all the values.

  // Old code...
  // values() {
  //   let valuesArr = [];
  //   for (let i = 0; i < this.table.length; i++) {
  //     if (this.table[i]) {
  //       for (let j = 0; j < this.table[i].length; j++) {
  //         valuesArr.push(this.table[i][j][1]);
  //       }
  //     }
  //   }
  //   console.log(`values() -> value list: ${valuesArr}`);
  //   return valuesArr;
  // }

  // Better code...
  values() {
    let valuesArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        // Use map to extract the values from each bucket, then flatten the result
        valuesArr.push(...this.table[i].map((entry) => entry[1]));
      }
    }
    console.log(`values() -> value list: ${valuesArr}`);
    return valuesArr;
  }

  // entries() returns an array that contains each key, value pair. Example: [[firstKey, firstValue], [secondKey, secondValue]]
  // I changed name to keyValues() rather than entries() because I am particular.

  // Old code...
  // keyValues() {
  //   let keyValuesArr = [];
  //   for (let i = 0; i < this.table.length; i++) {
  //     if (this.table[i]) {
  //       for (let j = 0; j < this.table[i].length; j++) {
  //         keyValuesArr.push(this.table[i][j]);
  //       }
  //     }
  //   }
  //   console.log(`keyValues() -> key-values list: ${keyValuesArr}`);
  //   return keyValuesArr;
  // }

  // Better code...
  keyValues() {
    let keyValuesArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        // Flatten the key-value pairs from each bucket and push them into the keyValuesArr
        keyValuesArr.push(...this.table[i]);
      }
    }
    console.log(`keyValues() -> key-values list: ${keyValuesArr}`);
    return keyValuesArr;
  }

  resizeCapacityUp() {
    // Check if current load factor exceeds the defined threshold
    if (this.numItems / this.capacity >= this.staticLoadFactor) {
      console.log(
        `Resizing up. Current load factor: ${
          this.numItems / this.capacity
        } (Expansion threshold: 0.75)`
      );
      // Double the capacity
      this.capacity *= 2;

      const newTable = new Array(this.capacity); // Create a new table with the increased capacity

      // Rehash all items from the old table into the new table
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i]) {
          for (let j = 0; j < this.table[i].length; j++) {
            const [key, value] = this.table[i][j];
            const newIndex = this.mapHash(key); // Rehash the key for the new table size
            if (!newTable[newIndex]) {
              newTable[newIndex] = [];
            }
            newTable[newIndex].push([key, value]);
          }
        }
      }

      // Now point the table to the new table
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

      // Ensure the capacity doesn't shrink too small
      // Halve capacity
      this.capacity = Math.floor(this.capacity / 2);
      const newTable = new Array(this.capacity);

      // Rehash and move all elements to the new table
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i]) {
          for (let j = 0; j < this.table[i].length; j++) {
            const [key, value] = this.table[i][j];
            const index = this.mapHash(key); // Rehash the key for the new table size
            if (!newTable[index]) {
              newTable[index] = [];
            }
            newTable[index].push([key, value]);
          }
        }
      }

      // Update the table reference to the new table
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

// 9. Test the other methods of your hash map, such as get(key), has(key), remove(key), length(), clear(), keys(), values(), and entries(), to check if they are still working as expected after expanding your hash map.

// console.log(test.set(1, "1")); // Correctly throws an error if input is not a string

console.log(test.get("tiger")); // Should be null, and not in table...result was pink

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

// console.log(test); // NOTE: Printing the raw contents of the hash map directly using console.log() could show messy or irrelevant details (like undefined values or empty slots), which might be confusing to anyone who just wants to know the number of items or the keys. Helper functions provide a cleaner, more useful interface to access specific parts of the hash map, such as retrieving the number of items, checking if a key exists, or seeing all the keys without printing the internal array structure...so use them rather than console.log(test)!

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
// Basically the same as the HashMap above, save that values are not needed and that ONLY UNIQUE KEYS CAN BE ADDED. Making changes accordingly, e.g., kill get(), keep has(), change set() to add(), etc.

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
          // delete this.table[index][i]; // This line leaves and empty slot at that index, don't use this
          if (this.table[index].length === 0) {
            // Again, this deleted the empty [], good stuff
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

  // Old code...
  // keys() {
  //   let keysArr = [];
  //   for (let i = 0; i < this.table.length; i++) {
  //     //console.log(this.table[i]);
  //     if (this.table[i] !== undefined) {
  //       keysArr.push(`${this.table[i]}`);
  //     }
  //   }
  //   console.log(`keys() -> key list: ${keysArr}`);
  //   return keysArr;
  // }

  // Better code...
  keys() {
    let keysArr = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        // Only process non-empty buckets
        keysArr.push(...this.table[i]); // Use spread syntax to add all keys in this bucket
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
console.log(`first ari01 is ${testSet.setHash("ari01")}`);

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

console.log(testSet);

testSet.add("ari01"); // THIS HAD GONE THROUGH INTO THE HASH SET AND HASHED TO TWO DIFFERENT KEYS BECAUSE RESIZING UP FUNCTION WAS IN THE WRONG SPOT INSIDE ADD(). FIXED, MOVED IT UP IN SET() TOO.
console.log(`second ari01 is ${testSet.setHash("ari01")}`);
testSet.add("leo05");
testSet.add("sag09");

testSet.has("ari01");
testSet.has("leo05");
testSet.has("sag09");

testSet.add("astrologyIsDumb");
testSet.has("astrologyIsDumb");
testSet.add("astrologyIsDumb");

testSet.has("oph13th");
testSet.remove("oph13th");
testSet.has("oph13th");

testSet.countAllKeys();
testSet.countAllBuckets2();
testSet.keys();
console.log(testSet.keys());

console.log(testSet);

// testSet.clear();
// console.log(testSet);
