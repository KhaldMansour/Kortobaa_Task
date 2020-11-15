const faker = require("faker");
const Seeder = require("mysql-db-seed").Seeder;
// ES6 use `import {Seeder} from "mysql-db-seed";`

// Generate a new Seeder instance
const seed = new Seeder(
  10, 
  "localhost",
  "root",
  "root",
  "kortobaa"
);

(async () => {
  await seed.seed(
    5,
    "products", 
    {
      image: faker.image.people,
      title: faker.name.firstName,
      user_id: faker.random.number({min:1, max:3}) ,
      createdAt: seed.nativeTimestamp(),
      updatedAt: seed.nativeTimestamp()
    }
  )
  seed.exit();
  process.exit();
})();