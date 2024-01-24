import {MongoClient} from "mongodb";
//?maxPoolSize=20&w=majority


export type BookType = {
    id: number
    title: string
    author : string
    publicationYear : number
    isAvailable : boolean
    borrower : string | null
    dueDate: string | null
}



const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const client = new MongoClient(mongoUri)
const db = client.db("library");
export const booksCollection = db.collection<BookType>("books");




export async function runDb(){
    try{
        await client.connect();
        await client.db("books").command(({ping: 1}));
        console.log("Connected succesfully to mango server");
    }
    catch {
        console.log("Can't connect to db");
        await client.close();
    }
}