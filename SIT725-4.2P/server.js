const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017/"; // MongoDB connection string
const dbName = "practical4db"; // database name
const collectionName = "student"; // collection name

//creating a common connections for all operation methods to improve reusability of code
async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    return { client, db };
}

// Create student records
async function createItem(item) {
    const { client, db } = await connectToDatabase();
    try {
        const result = await db.collection(collectionName).insertOne(item);
        console.log("inserrted item is:", result.insertedId);
    } catch (error) {
        console.error("Error inserting item:", error);
    } finally {
        await client.close();
    }
}

// Reading all the stored items
async function readAllItems() {
    const { client, db } = await connectToDatabase();
    try {
        const items = await db.collection(collectionName).find().toArray(); // find() function is used for finding the records 
        console.log("list of all Items: ", items);
    } catch (error) {
        console.error("Error in fetching items: ", error);
    } finally {
        await client.close();
    }
}

// fetch student recirds by provided IDs
async function readItemById(id) {
    const { client, db } = await connectToDatabase();
    try {
        const item = await db.collection(collectionName).findOne({ _id: new ObjectId(id) }); //findone() method is used for finding the records with given id
        console.log("Item: ", item);
    } catch (error) {
        console.error("Error fetching item: ", error);
    } finally {
        await client.close();
    }
}

// deleteing the record of provided ID
async function deleteItem(id) {
    const { client, db } = await connectToDatabase();
    try {
        const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) }); // delete method is used for deleting the records
        console.log("Item deleted: ", result.deletedCount);
    } catch (error) {
        console.error("Error deleting item: ", error);
    } finally {
        await client.close();
    }
}

//run below method for creating new student records
// createItem({ name: "nikhil", surname: "jadav", email: "nikhil.jadhav3210@gmail.com" });
// createItem({ name: "jaiminee", surname: "chaudhari", email: "nikhil.jadhav3210@gmail.com" });
// createItem({ name: "nikhil", surname: "jadav", email: "nikhil.jadhav3210@gmail.com" });
// createItem({ name: "arvind", surname: "jadav", email: "nikhil.jadhav3210@gmail.com" });
// createItem({ name: "hansa", surname: "jadav", email: "nikhil.jadhav3210@gmail.com" });


//run below method for listing down all student records
// readAllItems();

//below method is for fetching student records with provided student id
// readItemById('674d474fe58ef69da3cda8c1');

//run method for deleting student records
deleteItem("674d474fe58ef69da3cda8c2");